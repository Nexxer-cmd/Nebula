// const express = require("express");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const mongoose = require("mongoose");
// const cookieSession = require("cookie-session");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const http = require("http");
// const path = require("path");
// const { Server } = require("socket.io");

// const result = dotenv.config();
// if (result.error) console.log("Error loading .env:", result.error);

// // [FIX] Ensure critical keys exist to prevent runtime crashes
// if (!process.env.COOKIE_KEY || !process.env.MONGO_URI) {
//   console.error("FATAL ERROR: COOKIE_KEY or MONGO_URI is not defined.");
//   process.exit(1);
// }

// const app = express();
// const server = http.createServer(app);
// // This tells Express to trust the Render proxy and use HTTPS
// app.set("trust proxy", 1);

// // --- CONFIGURATION ---
// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// const io = new Server(server, {
//   cors: {
//     origin: CLIENT_URL,
//     methods: ["GET", "POST", "PUT"],
//     credentials: true,
//   },
// });

// app.use(express.json({ limit: "10mb" }));

// // --- HELPER: Generate Unique Color based on Name ---
// const getRandomColor = (name) => {
//   const colors = [
//     "F44336", "E91E63", "9C27B0", "673AB7", "3F51B5", "2196F3",
//     "03A9F4", "00BCD4", "009688", "4CAF50", "8BC34A", "FFC107",
//     "FF9800", "FF5722", "795548", "607D8B",
//   ];
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return colors[Math.abs(hash) % colors.length];
// };

// // --- SOCKET.IO LOGIC ---
// // [FIX] Moved getUser to a scope where it can be exported or used logically,
// // though keeping it here is fine as long as routes can access the 'io' instance.
// let onlineUsers = [];

// const addUser = (userId, socketId) => {
//   // Remove existing socket for this user to prevent duplicates
//   onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
//   onlineUsers.push({ userId, socketId });
//   console.log("User Connected:", userId);
// };

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUsers.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", onlineUsers);
//   });

//   socket.on("callUser", ({ senderId, receiverId, type }) => {
//     const user = getUser(receiverId);
//     if (user) {
//       io.to(user.socketId).emit("incomingCall", { senderId, type });
//     }
//   });

//   socket.on("answerCall", ({ senderId }) => {
//     const user = getUser(senderId);
//     if (user) {
//       io.to(user.socketId).emit("callAccepted");
//     }
//   });

//   socket.on("endCall", ({ targetId }) => {
//     const user = getUser(targetId);
//     if (user) {
//       io.to(user.socketId).emit("callEnded");
//     }
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     io.emit("getUsers", onlineUsers);
//   });
// });

// // [FIX] Set strictQuery to suppress Mongoose 7 warnings
// mongoose.set('strictQuery', false);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ MongoDB Error:", err));

// // --- SCHEMAS ---
// const UserSchema = new mongoose.Schema({
//   googleId: { type: String, index: true },
//   displayName: String,
//   email: String,
//   avatar: String,
//   shareId: { type: String, unique: true, index: true },
//   bio: { type: String, default: "Hey! I am using Nebula Chat." },
//   lastSeen: { type: Date, default: Date.now },
//   contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// });
// const User = mongoose.model("User", UserSchema);

// const MessageSchema = new mongoose.Schema({
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   text: String,
//   type: {
//     type: String,
//     enum: ["text", "image", "video", "file", "call"],
//     default: "text",
//   },
//   callDetails: {
//     status: { type: String, enum: ["missed", "ended"] },
//     duration: String,
//   },
//   timestamp: { type: Date, default: Date.now },
//   isAI: { type: Boolean, default: false },
// });
// MessageSchema.index({ sender: 1, receiver: 1, timestamp: 1 });
// MessageSchema.index({ receiver: 1, sender: 1, timestamp: 1 });
// const Message = mongoose.model("Message", MessageSchema);

// // --- UTILS ---
// const generateShareId = () =>
//   "NEB-" + crypto.randomBytes(3).toString("hex").toUpperCase();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
// });

// const sendWelcomeEmail = async (toEmail, name, shareId) => {
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
//   const mailOptions = {
//     from: `"Nebula Chat" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: "Welcome to Nebula Chat! ✨",
//     html: `<h3>Welcome ${name}!</h3><p>Your Share ID is: <b>${shareId}</b></p>`,
//   };
//   transporter
//     .sendMail(mailOptions)
//     .catch((err) => console.error("Email Error:", err));
// };

// // --- MIDDLEWARE ---
// app.use(cors({ origin: CLIENT_URL, credentials: true }));

// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: [process.env.COOKIE_KEY],
//     // [FIX] Security: sameSite 'lax' is better for OAuth redirects in some browsers
//     sameSite: "none",
//      secure: true
//     // secure: process.env.NODE_ENV === "production", // Only secure in prod
//   })
// );

// app.use((req, res, next) => {
//   if (req.session && !req.session.regenerate)
//     req.session.regenerate = (cb) => cb();
//   if (req.session && !req.session.save) req.session.save = (cb) => cb();
//   next();
// });

// app.use(passport.initialize());
// app.use(passport.session());

// // --- AUTH & AVATAR GENERATION ---
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback" ,
//     },
//     async (token, refToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           const googlePic =
//             profile.photos && profile.photos.length > 0
//               ? profile.photos[0].value
//               : null;
//           const color = getRandomColor(profile.displayName);
//           const finalAvatar =
//             googlePic ||
//             `https://ui-avatars.com/api/?name=${encodeURIComponent(
//               profile.displayName
//             )}&background=${color}&color=fff&rounded=true&bold=true`;

//           user = await new User({
//             googleId: profile.id,
//             displayName: profile.displayName,
//             email: profile.emails[0].value,
//             avatar: finalAvatar,
//             shareId: generateShareId(),
//             lastSeen: new Date(),
//           }).save();
//           sendWelcomeEmail(user.email, user.displayName, user.shareId);
//         } else {
//           user.lastSeen = new Date();
//           await user.save();
//         }
//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => done(null, user.id));

// // [FIX] Added error handling for deserializeUser
// passport.deserializeUser((id, done) =>
//   User.findById(id)
//     .then((u) => done(null, u))
//     .catch((err) => done(err, null))
// );

// // --- ROUTES ---

// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
//   })
// );

// app.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
//   res.redirect("/"); // Redirects to the homepage (which is now served by this server)
// });

// app.get("/api/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     req.session = null;
//     res.clearCookie("session");
//     res.redirect(CLIENT_URL);
//   });
// });

// app.get("/api/current_user", async (req, res) => {
//   if (!req.user) return res.status(401).send(null);
//   try {
//     const myId = req.user._id;
//     await User.findByIdAndUpdate(myId, { lastSeen: new Date() });

//     // Auto-add contacts logic
//     const userRaw = await User.findById(myId);
//     const incomingSenders = await Message.find({ receiver: myId }).distinct("sender");

//     let newContactsFound = false;
//     incomingSenders.forEach((senderId) => {
//       if (!userRaw.contacts.includes(senderId) && !senderId.equals(myId)) {
//         userRaw.contacts.push(senderId);
//         newContactsFound = true;
//       }
//     });
//     if (newContactsFound) await userRaw.save();

//     const userDoc = await User.findById(myId).populate("contacts").lean();

//     // Aggregation for Last Message
//     const lastMessagesAgg = await Message.aggregate([
//       { $match: { $or: [{ sender: myId }, { receiver: myId }] } },
//       { $sort: { timestamp: -1 } },
//       {
//         $group: {
//           _id: { $cond: [{ $eq: ["$sender", myId] }, "$receiver", "$sender"] },
//           lastMessageDoc: { $first: "$$ROOT" },
//         },
//       },
//     ]);

//     const lastMessageMap = {};
//     lastMessagesAgg.forEach((item) => {
//       lastMessageMap[item._id.toString()] = item.lastMessageDoc;
//     });

//     const contactsWithMeta = userDoc.contacts.map((contact) => ({
//       ...contact,
//       lastMessageDoc: lastMessageMap[contact._id.toString()] || null,
//     }));

//     res.send({ ...userDoc, contacts: contactsWithMeta });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: "Failed to load user" });
//   }
// });

// app.put("/api/user/update", async (req, res) => {
//   if (!req.user) return res.status(401).send({ error: "Not logged in" });
//   const { displayName, bio, avatar } = req.body;
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       { displayName, bio, avatar },
//       { new: true }
//     );
//     res.send(updatedUser);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to update profile" });
//   }
// });

// app.post("/api/contacts/add", async (req, res) => {
//   if (!req.user) return res.status(401).send({ error: "Not logged in" });
//   const { targetShareId } = req.body;
//   try {
//     const userToAdd = await User.findOne({ shareId: targetShareId }).lean();
//     if (!userToAdd) return res.status(404).send({ error: "User ID not found" });
//     if (userToAdd._id.toString() === req.user._id.toString())
//       return res.status(400).send({ error: "Cannot add yourself" });

//     await User.findByIdAndUpdate(req.user._id, {
//       $addToSet: { contacts: userToAdd._id },
//     });
//     res.send(userToAdd);
//   } catch (err) {
//     res.status(500).send({ error: "Failed to add contact" });
//   }
// });

// // --- MESSAGING ROUTE WITH SOCKET INTEGRATION ---
// app.post("/api/messages/send", async (req, res) => {
//   if (!req.user) return res.status(401).send({ error: "Not logged in" });
//   const { receiverId, text, type = "text", callDetails } = req.body;

//   try {
//     const newMessage = await new Message({
//       sender: req.user._id,
//       receiver: receiverId,
//       text: text,
//       type: type,
//       callDetails: callDetails,
//       isAI: false,
//     }).save();

//     await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });

//     // [FIX] Real-time Socket Emission
//     // We search the onlineUsers array (defined in this file) for the receiver
//     const receiver = getUser(receiverId);
//     if (receiver) {
//       // Emit to the specific socket ID
//       io.to(receiver.socketId).emit("getMessage", newMessage);
//     }

//     // We also return the message to the sender
//     res.send(newMessage);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send(err);
//   }
// });

// app.get("/api/messages/:contactId", async (req, res) => {
//   if (!req.user) return res.status(401).send({ error: "Not logged in" });
//   const { contactId } = req.params;
//   try {
//     await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });

//     const messages = await Message.find({
//       $or: [
//         { sender: req.user._id, receiver: contactId },
//         { sender: contactId, receiver: req.user._id },
//       ],
//     })
//     .sort({ timestamp: 1 })
//     .lean();

//     res.send(messages);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Root Redirect
// // app.get("/", (req, res) => res.redirect(CLIENT_URL));

// const PORT = process.env.PORT || 5000;
// // --- SERVE REACT FRONTEND ---

// // 1. Tell Express to serve the static files from the 'dist' folder
// app.use(express.static(path.join(__dirname, "dist")));

// // 2. Handle React Routing
// // If a user hits a route like /chat or /profile, send them the index.html
// // so React Router can take over.
// // [FIX] Changed "*" to /.*/ to fix the Express 5 PathError
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// // ... server.listen is below this
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// const express = require("express");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const mongoose = require("mongoose");
// const cookieSession = require("cookie-session");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const http = require("http");
// const path = require("path");
// const multer = require("multer"); // Added from Code A
// const { Server } = require("socket.io");

// const result = dotenv.config();
// if (result.error) console.log("Error loading .env:", result.error);

// // Critical Safety Check
// if (!process.env.COOKIE_KEY || !process.env.MONGO_URI) {
//   console.error("FATAL ERROR: COOKIE_KEY or MONGO_URI is not defined.");
//   process.exit(1);
// }

// const app = express();
// const server = http.createServer(app);

// // Trust Proxy for Render/Heroku (Required for secure cookies behind load balancers)
// app.set("trust proxy", 1);

// const PROD_URL = "https://nebulafrontend-o0dr.onrender.com";
// const CLIENT_URL = process.env.NODE_ENV === "production" ? PROD_URL : "http://localhost:5173";

// // --- MIDDLEWARE ---
// app.use(cors({
//   origin: CLIENT_URL,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// app.use(express.json({ limit: "15mb" }));
// app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// // --- DATABASE CONNECTION ---
// mongoose.set('strictQuery', false);
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));

// // --- SESSION CONFIG ---
// app.use(cookieSession({
//   maxAge: 30 * 24 * 60 * 60 * 1000,
//   keys: [process.env.COOKIE_KEY],
//   // Secure cookies only in production to avoid localhost issues
//   secure: process.env.NODE_ENV === "production",
//   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//   httpOnly: true
// }));
//  app.use((req, res, next) => {
//   if (req.session && !req.session.regenerate) {
//     req.session.regenerate = (cb) => {
//       cb();
//     };
//   }
//   if (req.session && !req.session.save) {
//     req.session.save = (cb) => {
//       cb();
//     };
//   }
//   next();
// });

// app.use(passport.initialize());
// app.use(passport.session());

// // --- SCHEMAS ---
// const UserSchema = new mongoose.Schema({
//   googleId: { type: String, index: true },
//   displayName: String,
//   email: String,
//   avatar: String,
//   shareId: { type: String, unique: true, index: true },
//   bio: { type: String, default: "Hey! I am using Nebula Chat." },
//   lastSeen: { type: Date, default: Date.now },
//   contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// });
// const User = mongoose.model("User", UserSchema);

// const MessageSchema = new mongoose.Schema({
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   text: String,
//   type: {
//     type: String,
//     enum: ["text", "image", "video", "file", "call"],
//     default: "text",
//   },
//   fileUrl: String, // Added to support file uploads
//   fileName: String,
//   callDetails: {
//     status: { type: String, enum: ["missed", "ended"] },
//     duration: String,
//   },
//   timestamp: { type: Date, default: Date.now },
//   replyTo: String
// });
// // Index for fast chat history retrieval
// MessageSchema.index({ sender: 1, receiver: 1, timestamp: 1 });
// MessageSchema.index({ receiver: 1, sender: 1, timestamp: 1 });
// const Message = mongoose.model("Message", MessageSchema);

// // --- SOCKET.IO SETUP ---
// const io = new Server(server, {
//   cors: {
//     origin: CLIENT_URL,
//     methods: ["GET", "POST", "PUT"],
//     credentials: true,
//   },
// });

// let onlineUsers = [];

// // Ensure we convert to string to match different ID types
// const getUser = (userId) => onlineUsers.find((user) => user.userId === userId.toString());

// io.on("connection", (socket) => {
//   socket.on("addUser", (userId) => {
//     onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
//     onlineUsers.push({ userId, socketId: socket.id });
//     io.emit("getUsers", onlineUsers);
//   });

//   // Call Signaling
//   socket.on("callUser", ({ senderId, receiverId, type }) => {
//     const user = getUser(receiverId);
//     if (user) {
//       io.to(user.socketId).emit("incomingCall", { senderId, type });
//     }
//   });

//   socket.on("answerCall", ({ senderId }) => {
//     const user = getUser(senderId);
//     if (user) {
//       io.to(user.socketId).emit("callAccepted");
//     }
//   });

//   socket.on("endCall", ({ targetId }) => {
//     const user = getUser(targetId);
//     if (user) {
//       io.to(user.socketId).emit("callEnded");
//     }
//   });

//   socket.on("disconnect", () => {
//     onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
//     io.emit("getUsers", onlineUsers);
//   });
// });

// // --- AUTH UTILS ---
// const getRandomColor = (name) => {
//   const colors = ["F44336", "E91E63", "9C27B0", "2196F3", "009688", "FFC107", "FF5722"];
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   return colors[Math.abs(hash) % colors.length];
// };

// const generateShareId = () => "NEB-" + crypto.randomBytes(3).toString("hex").toUpperCase();

// // --- PASSPORT CONFIG ---
// passport.use(
//   new GoogleStrategy({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//       proxy: true
//     },
//     async (token, refToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });
//         if (!user) {
//           const color = getRandomColor(profile.displayName);
//           const avatar = profile.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=${color}&color=fff`;

//           user = await new User({
//             googleId: profile.id,
//             displayName: profile.displayName,
//             email: profile.emails[0].value,
//             avatar: avatar,
//             shareId: generateShareId(),
//           }).save();
//         }
//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) => User.findById(id).then(u => done(null, u)).catch(e => done(e, null)));

// // --- FILE UPLOAD (Restored from Code A) ---
// // Note: In a real production app, consider using AWS S3 or Cloudinary.
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage });

// // Ensure 'uploads' directory exists and is served statically
// const fs = require('fs');
// if (!fs.existsSync('uploads')){ fs.mkdirSync('uploads'); }
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).send({ error: "No file uploaded" });

//   // Return the path that the frontend can use to display the image
//   res.send({
//     success: true,
//     fileUrl: `/uploads/${req.file.filename}`,
//     fileName: req.file.originalname
//   });
// });

// // --- API ROUTES ---

// // Auth
// app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
// app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => res.redirect(CLIENT_URL));
// app.get("/api/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect(CLIENT_URL);
//   });
// });

// // User Data
// app.get("/api/current_user", async (req, res) => {
//   if (!req.user) return res.status(401).send(null);

//   // Update last seen
//   await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });

//   // Fetch user with contacts
//   const userDoc = await User.findById(req.user._id).populate("contacts").lean();

//   // Aggregate last messages for sidebar
//   const lastMessagesAgg = await Message.aggregate([
//     { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
//     { $sort: { timestamp: -1 } },
//     { $group: {
//         _id: { $cond: [{ $eq: ["$sender", req.user._id] }, "$receiver", "$sender"] },
//         lastMessageDoc: { $first: "$$ROOT" }
//     }}
//   ]);

//   const lastMessageMap = {};
//   lastMessagesAgg.forEach(i => lastMessageMap[i._id.toString()] = i.lastMessageDoc);

//   const contactsWithMeta = userDoc.contacts.map(c => ({
//     ...c,
//     lastMessageDoc: lastMessageMap[c._id.toString()] || null
//   }));

//   res.send({ ...userDoc, contacts: contactsWithMeta });
// });

// // Profile Update
// app.put("/api/user/update", async (req, res) => {
//   if (!req.user) return res.status(401).send({ error: "Unauthorized" });
//   try {
//     const updated = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
//     res.send(updated);
//   } catch(e) { res.status(500).send(e); }
// });

// // Add Contact
// app.post("/api/contacts/add", async (req, res) => {
//   if (!req.user) return res.status(401).send({ error: "Unauthorized" });
//   try {
//     const userToAdd = await User.findOne({ shareId: req.body.targetShareId });
//     if (!userToAdd) return res.status(404).send({ error: "User not found" });

//     await User.findByIdAndUpdate(req.user._id, { $addToSet: { contacts: userToAdd._id } });
//     res.send(userToAdd);
//   } catch(e) { res.status(500).send(e); }
// });

// // Send Message
// app.post("/api/messages/send", async (req, res) => {
//   if (!req.user) return res.status(401).send({ error: "Unauthorized" });

//   const { receiverId, text, type, fileUrl, fileName, callDetails, replyTo } = req.body;

//   // 1. ADD THIS VALIDATION
//   if (!receiverId) {
//     console.error("Message Error: Missing receiverId");
//     return res.status(400).send({ error: "Receiver ID is required" });
//   }

//   try {
//     const newMessage = await new Message({
//       sender: req.user._id,
//       receiver: receiverId,
//       text, type, fileUrl, fileName, callDetails, replyTo,
//       timestamp: new Date()
//     }).save();

//     // 1. Return to sender immediately
//     res.send(newMessage);

//     // 2. Emit to receiver via Socket
//     const receiverSocket = getUser(receiverId);
//     if (receiverSocket) {
//       io.to(receiverSocket.socketId).emit("getMessage", newMessage);
//     }
//   } catch (err) {
//     // 2. ADD THIS LOGGING
//     console.error("FATAL MESSAGE ERROR:", err);
//     res.status(500).send({ error: err.message });
//   }
// });

// // Get Messages
// app.get("/api/messages/:contactId", async (req, res) => {
//   if (!req.user) return res.status(401).send({ error: "Unauthorized" });
//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender: req.user._id, receiver: req.params.contactId },
//         { sender: req.params.contactId, receiver: req.user._id }
//       ]
//     }).sort({ timestamp: 1 });
//     res.send(messages);
//   } catch(e) { res.status(500).send(e); }
// });

// // --- PRODUCTION SERVING ---
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../nebula-chat/dist")));
//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.join(__dirname, "../nebula-chat","dist", "index.html"));
//   });
// }

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cors = require("cors");
const crypto = require("crypto");
const http = require("http");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { Server } = require("socket.io");
const nodemailer = require("nodemailer");

// --- ENVIRONMENT SETUP ---
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Critical Safety Check
if (!process.env.COOKIE_KEY || !process.env.MONGO_URI) {
  console.error("FATAL ERROR: COOKIE_KEY or MONGO_URI is not defined.");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

// Trust Proxy for Render
app.set("trust proxy", 1);

// --- URL CONFIGURATION ---
const PROD_FRONTEND = "https://nebula-ui.onrender.com";
const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? PROD_FRONTEND
    : "http://localhost:5173";

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// [FIX] Increased Payload Limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// --- DATABASE CONNECTION ---
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// --- SESSION CONFIG ---
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
  }),
);

// Fix for Passport session regeneration
app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true },
  displayName: String,
  email: String,
  avatar: String,
  shareId: { type: String, unique: true, index: true },
  bio: { type: String, default: "Hey! I am using Nebula Chat." },
  lastSeen: { type: Date, default: Date.now },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const User = mongoose.model("User", UserSchema);

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: String,
  type: {
    type: String,
    enum: ["text", "image", "video", "file", "call"],
    default: "text",
  },
  fileUrl: String,
  fileName: String,
  callDetails: {
    status: { type: String, enum: ["missed", "ended"] },
    duration: String,
  },
  timestamp: { type: Date, default: Date.now },
  replyTo: String,
});
MessageSchema.index({ sender: 1, receiver: 1, timestamp: 1 });
MessageSchema.index({ receiver: 1, sender: 1, timestamp: 1 });
const Message = mongoose.model("Message", MessageSchema);

// --- SOCKET.IO ---
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

let onlineUsers = [];
const getUser = (userId) =>
  onlineUsers.find((user) => user.userId === userId.toString());

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    onlineUsers.push({ userId, socketId: socket.id });
    io.emit("getUsers", onlineUsers);
  });
  socket.on("callUser", ({ senderId, receiverId, type }) => {
    const user = getUser(receiverId);
    if (user) io.to(user.socketId).emit("incomingCall", { senderId, type });
  });
  socket.on("answerCall", ({ senderId }) => {
    const user = getUser(senderId);
    if (user) io.to(user.socketId).emit("callAccepted");
  });
  socket.on("endCall", ({ targetId }) => {
    const user = getUser(targetId);
    if (user) io.to(user.socketId).emit("callEnded");
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", onlineUsers);
  });
});

// --- UTILS ---
const getRandomColor = (name) => {
  const colors = [
    "F44336",
    "E91E63",
    "9C27B0",
    "2196F3",
    "009688",
    "FFC107",
    "FF5722",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const generateShareId = () =>
  "NEB-" + crypto.randomBytes(3).toString("hex").toUpperCase();

// --- EMAIL CONFIGURATION ---
// [DEBUG] Log if credentials exist
console.log("📧 Email Config Check:", {
  hasUser: !!process.env.EMAIL_USER,
  hasPass: !!process.env.EMAIL_PASS,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Email Connection Error:", error);
  } else {
    console.log("✅ Email Server is ready to take our messages");
  }
});

// --- PASSPORT ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (token, refToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // 1. Create User
          console.log("🆕 Creating new user:", profile.displayName);
          const color = getRandomColor(profile.displayName);
          const avatar =
            profile.photos?.[0]?.value ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=${color}&color=fff`;

          user = await new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            avatar: avatar,
            shareId: generateShareId(),
          }).save();

          // 2. Send Welcome Email
          if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log("📨 Attempting to send welcome email to:", user.email);

            const mailOptions = {
              from: '"Nebula Chat" <' + process.env.EMAIL_USER + ">",
              to: user.email,
              subject: "Welcome to Nebula Chat! 🚀",
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                  <h2 style="color: #673AB7;">Welcome, ${user.displayName}!</h2>
                  <p>We are thrilled to have you on board. Your unique Share ID is:</p>
                  <h3 style="background: #f4f4f4; padding: 10px; display: inline-block;">${user.shareId}</h3>
                  <p>Share this ID with friends to start chatting!</p>
                  <br/>
                  <p>Best regards,<br/>The Nebula Team</p>
                </div>
              `,
            };

            // Send mail using Async/Await to catch errors better
            try {
              const info = await transporter.sendMail(mailOptions);
              console.log("✅ Email Sent ID:", info.messageId);
            } catch (emailError) {
              console.error("❌ Failed to send email:", emailError);
            }
          } else {
            console.log(
              "⚠️ Email credentials missing in .env, skipping welcome email.",
            );
          }
        } else {
          console.log("👋 Existing user logged in:", user.displayName);
        }

        done(null, user);
      } catch (err) {
        console.error("Auth Error:", err);
        done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id)
    .then((u) => done(null, u))
    .catch((e) => done(e, null)),
);

// --- FILE UPLOAD ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send({ error: "No file uploaded" });
  res.send({
    success: true,
    fileUrl: `/uploads/${req.file.filename}`,
    fileName: req.file.originalname,
  });
});

// --- API ROUTES ---

// Temp route to clear DB (USE WITH CAUTION)
app.get("/api/nuke-db", async (req, res) => {
  if (process.env.NODE_ENV === "production")
    return res.status(403).send("Not allowed in production");
  try {
    await User.deleteMany({});
    await Message.deleteMany({});
    res.send("💥 database cleared. All users and messages deleted.");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Auth
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect(CLIENT_URL),
);
app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.redirect(CLIENT_URL);
  });
});

// User Data
app.get("/api/current_user", async (req, res) => {
  if (!req.user) return res.status(401).send(null);
  await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });
  const userDoc = await User.findById(req.user._id).populate("contacts").lean();

  const lastMessagesAgg = await Message.aggregate([
    { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$sender", req.user._id] }, "$receiver", "$sender"],
        },
        lastMessageDoc: { $first: "$$ROOT" },
      },
    },
  ]);
  const lastMessageMap = {};
  lastMessagesAgg.forEach(
    (i) => (lastMessageMap[i._id.toString()] = i.lastMessageDoc),
  );
  const contactsWithMeta = userDoc.contacts.map((c) => ({
    ...c,
    lastMessageDoc: lastMessageMap[c._id.toString()] || null,
  }));
  res.send({ ...userDoc, contacts: contactsWithMeta });
});

app.put("/api/user/update", async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Unauthorized" });
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.send(updated);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/api/contacts/add", async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Unauthorized" });
  try {
    const userToAdd = await User.findOne({ shareId: req.body.targetShareId });
    if (!userToAdd) return res.status(404).send({ error: "User not found" });
    if (userToAdd._id.equals(req.user._id))
      return res.status(400).send({ error: "Cannot add yourself." });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { contacts: userToAdd._id },
    });
    res.send(userToAdd);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/api/messages/send", async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Unauthorized" });
  const { receiverId, text, type, fileUrl, fileName, callDetails, replyTo } =
    req.body;
  if (!receiverId)
    return res.status(400).send({ error: "Receiver ID is required" });
  try {
    const newMessage = await new Message({
      sender: req.user._id,
      receiver: receiverId,
      text,
      type,
      fileUrl,
      fileName,
      callDetails,
      replyTo,
      timestamp: new Date(),
    }).save();
    res.send(newMessage);
    const receiverSocket = getUser(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit("getMessage", newMessage);
    }
  } catch (err) {
    console.error("Message Error:", err);
    res.status(500).send({ error: err.message });
  }
});

app.get("/api/messages/:contactId", async (req, res) => {
  if (!req.user) return res.status(401).send({ error: "Unauthorized" });
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.contactId },
        { sender: req.params.contactId, receiver: req.user._id },
      ],
    }).sort({ timestamp: 1 });
    res.send(messages);
  } catch (e) {
    res.status(500).send(e);
  }
});

// --- ROOT REDIRECT ---
app.get("/", (req, res) => {
  res.redirect(CLIENT_URL);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
