const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const http = require('http');
const { Server } = require("socket.io");

const result = dotenv.config();
if (result.error) console.log("Error loading .env:", result.error);

const app = express();
const server = http.createServer(app);

// --- CONFIGURATION ---
// Define the Client URL (Frontend) dynamically
const CLIENT_URL = process.env.CLIENT_URL ||  "https://nebula-two-phi.vercel.app";

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL, 
    methods: ["GET", "POST", "PUT"],
    credentials: true
  }
});

app.use(express.json({ limit: '10mb' }));

// --- HELPER: Generate Unique Color based on Name ---
const getRandomColor = (name) => {
  const colors = [
    'F44336', 'E91E63', '9C27B0', '673AB7', '3F51B5', '2196F3', 
    '03A9F4', '00BCD4', '009688', '4CAF50', '8BC34A', 'FFC107', 
    'FF9800', 'FF5722', '795548', '607D8B'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// --- SOCKET.IO LOGIC ---
let onlineUsers = [];

const addUser = (userId, socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
  onlineUsers.push({ userId, socketId });
  console.log("User Connected:", userId);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", onlineUsers); 
  });

  socket.on("callUser", ({ senderId, receiverId, type }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("incomingCall", { senderId, type });
    } else {
      io.to(socket.id).emit("userOffline");
    }
  });

  socket.on("answerCall", ({ senderId }) => {
    const user = getUser(senderId);
    if (user) {
      io.to(user.socketId).emit("callAccepted");
    }
  });

  socket.on("endCall", ({ targetId }) => {
    const user = getUser(targetId);
    if (user) {
      io.to(user.socketId).emit("callEnded");
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true },
  displayName: String,
  email: String,
  avatar: String,
  shareId: { type: String, unique: true, index: true },
  bio: { type: String, default: "Hey! I am using Nebula Chat." },
  lastSeen: { type: Date, default: Date.now },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const User = mongoose.model('User', UserSchema);

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  type: { type: String, enum: ['text', 'image', 'video', 'file', 'call'], default: 'text' },
  callDetails: { status: { type: String, enum: ['missed', 'ended'] }, duration: String },
  timestamp: { type: Date, default: Date.now },
  isAI: { type: Boolean, default: false }
});
MessageSchema.index({ sender: 1, receiver: 1, timestamp: 1 });
MessageSchema.index({ receiver: 1, sender: 1, timestamp: 1 });
const Message = mongoose.model('Message', MessageSchema);

// --- UTILS ---
const generateShareId = () => 'NEB-' + crypto.randomBytes(3).toString('hex').toUpperCase();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
const sendWelcomeEmail = async (toEmail, name, shareId) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const mailOptions = {
    from: `"Nebula Chat" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Welcome to Nebula Chat! ✨',
    html: `<h3>Welcome ${name}!</h3><p>Your Share ID is: <b>${shareId}</b></p>`
  };
  transporter.sendMail(mailOptions).catch(err => console.error("Email Error:", err));
};

// --- MIDDLEWARE ---
// Updated CORS to use dynamic CLIENT_URL
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [process.env.COOKIE_KEY] }));
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) req.session.regenerate = (cb) => cb();
    if (req.session && !req.session.save) req.session.save = (cb) => cb();
    next();
});
app.use(passport.initialize());
app.use(passport.session());

// --- AUTH & AVATAR GENERATION ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (token, refToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // --- NEW: Avatar Logic ---
        const googlePic = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
        const color = getRandomColor(profile.displayName);
        // Fallback to UI Avatars if Google Pic is missing
        const finalAvatar = googlePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=${color}&color=fff&rounded=true&bold=true`;
        // -------------------------

        user = await new User({
          googleId: profile.id, displayName: profile.displayName,
          email: profile.emails[0].value, avatar: finalAvatar,
          shareId: generateShareId(),
          lastSeen: new Date()
        }).save();
        sendWelcomeEmail(user.email, user.displayName, user.shareId);
      } else { user.lastSeen = new Date(); await user.save(); }
      done(null, user);
    } catch (err) { done(err, null); }
  }
));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(u => done(null, u)));

// --- ROUTES ---
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Updated Callback to redirect to CLIENT_URL
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => res.redirect(CLIENT_URL));

app.get('/api/logout', (req, res, next) => req.logout(err => err ? next(err) : res.redirect('/')));

app.get('/api/current_user', async (req, res) => {
  if (!req.user) return res.status(401).send(null);
  try {
      const myId = req.user._id;
      await User.findByIdAndUpdate(myId, { lastSeen: new Date() });
      const userRaw = await User.findById(myId);
      const incomingSenders = await Message.find({ receiver: myId }).distinct('sender');
      let newContactsFound = false;
      incomingSenders.forEach(senderId => {
          if (!userRaw.contacts.includes(senderId) && !senderId.equals(myId)) {
              userRaw.contacts.push(senderId);
              newContactsFound = true;
          }
      });
      if (newContactsFound) await userRaw.save();
      const userDoc = await User.findById(myId).populate('contacts').lean();
      const lastMessagesAgg = await Message.aggregate([
          { $match: { $or: [{ sender: myId }, { receiver: myId }] } },
          { $sort: { timestamp: -1 } },
          { $group: { _id: { $cond: [{ $eq: ["$sender", myId] }, "$receiver", "$sender"] }, lastMessageDoc: { $first: "$$ROOT" } } }
      ]);
      const lastMessageMap = {};
      lastMessagesAgg.forEach(item => { lastMessageMap[item._id.toString()] = item.lastMessageDoc; });
      const contactsWithMeta = userDoc.contacts.map(contact => ({ ...contact, lastMessageDoc: lastMessageMap[contact._id.toString()] || null }));
      res.send({ ...userDoc, contacts: contactsWithMeta });
  } catch (err) { res.status(500).send({ error: "Failed to load user" }); }
});

app.put('/api/user/update', async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Not logged in" });
  const { displayName, bio, avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { displayName, bio, avatar },
      { new: true }
    );
    res.send(updatedUser);
  } catch (err) { res.status(500).send({ error: "Failed to update profile" }); }
});

app.post('/api/contacts/add', async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Not logged in" });
  const { targetShareId } = req.body;
  try {
    const userToAdd = await User.findOne({ shareId: targetShareId }).lean();
    if (!userToAdd) return res.status(404).send({ error: "User ID not found" });
    if (userToAdd._id.toString() === req.user._id.toString()) return res.status(400).send({ error: "Cannot add yourself" });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { contacts: userToAdd._id } });
    res.send(userToAdd);
  } catch (err) { res.status(500).send({ error: "Failed to add contact" }); }
});

app.post('/api/messages/send', async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Not logged in" });
  const { receiverId, text, type = 'text', callDetails } = req.body;
  try {
    const newMessage = await new Message({
      sender: req.user._id, receiver: receiverId, text: text, type: type, callDetails: callDetails, isAI: false
    }).save();
    await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });
    res.send(newMessage);
  } catch (err) { res.status(500).send(err); }
});

app.get('/api/messages/:contactId', async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Not logged in" });
  const { contactId } = req.params;
  try {
    await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });
    const messages = await Message.find({
      $or: [{ sender: req.user._id, receiver: contactId }, { sender: contactId, receiver: req.user._id }]
    }).sort({ timestamp: 1 }).lean();
    res.send(messages);
  } catch (err) { res.status(500).send(err); }
});

// Updated Root Redirect to CLIENT_URL
app.get('/', (req, res) => res.redirect(CLIENT_URL));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));