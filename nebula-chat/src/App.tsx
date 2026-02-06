// import { useRef, useEffect, useState } from "react";
// import {
//   Search,
//   MoreVertical,
//   Phone,
//   Video,
//   ArrowLeft,
//   LogOut,
//   Sun,
//   Moon,
//   Users,
//   Settings,
//   XCircle,
//   Ban,
//   Sparkles,
//   UserPlus,
//   PhoneMissed,
//   HelpCircle,
// } from "lucide-react";

// import { useChat } from "./hooks/useChat";
// import { formatLastSeen } from "./utils";
// import LoginScreen from "./components/LoginScreen";
// import ChatItem from "./components/ChatItem";
// import MessageBubble from "./components/MessageBubble";
// import ChatInput from "./components/ChatInput";
// import CallOverlay from "./components/CallOverlay";
// import { EmptyState } from "./components/Modals";
// import ProfilePanel from "./components/ProfilePanel";
// import ProfilePopup from "./components/ProfilePopup";
// import ProfileDetailsModal from "./components/ProfileDetailsModal";
// import SettingsModal from "./components/SettingsModal";
// import {  BASE_URL } from "./lib/axios";
// // CHANGE: Define API URL based on environment variables
// // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// function App() {
//   const {
//     user,
//     setUser,
//     activeChatId,
//     setActiveChatId,
//     contacts,
//     messages,
//     theme,
//     toggleTheme,
//     inputText,
//     setInputText,
//     searchTerm,
//     setSearchTerm,
//     replyingTo,
//     setReplyingTo,
//     smartReplies,
//     activeContact,
//     handleSendMessage,
//     callStatus,
//     startCall,
//     endCall,
//     callType,
//     answerCall,
//     showSidebarMenu,
//     setShowSidebarMenu,
//     viewingProfile,
//     setViewingProfile,
//     previewProfile,
//     setPreviewProfile,
//     detailedProfile,
//     setDetailedProfile,
//     handleUpdateContact,
//     addContactByCode,
//     updateMyProfile,
//   } = useChat();

//   const [showChatMenu, setShowChatMenu] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const chatMenuRef = useRef<HTMLDivElement>(null);
//   const sidebarMenuRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         showChatMenu &&
//         chatMenuRef.current &&
//         !chatMenuRef.current.contains(event.target as Node)
//       ) {
//         setShowChatMenu(false);
//       }
//       if (
//         showSidebarMenu &&
//         sidebarMenuRef.current &&
//         !sidebarMenuRef.current.contains(event.target as Node)
//       ) {
//         setShowSidebarMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showChatMenu, showSidebarMenu]);

//   useEffect(() => {
//     const handleGlobalKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         if (showSettings) setShowSettings(false);
//         else if (detailedProfile) setDetailedProfile(null);
//         else if (previewProfile) setPreviewProfile(null);
//         else if (viewingProfile) setViewingProfile(null);
//         else if (replyingTo) setReplyingTo(null);
//         else if (activeChatId) setActiveChatId(null);
//       }
//       if ((e.ctrlKey || e.metaKey) && e.key === "b") {
//         e.preventDefault();
//         toggleTheme();
//       }
//     };
//     window.addEventListener("keydown", handleGlobalKeyDown);
//     return () => window.removeEventListener("keydown", handleGlobalKeyDown);
//   }, [
//     showSettings,
//     detailedProfile,
//     previewProfile,
//     viewingProfile,
//     replyingTo,
//     activeChatId,
//     toggleTheme,
//   ]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, replyingTo]);

//   const handleAddFriend = () => {
//     const code = window.prompt(
//       "Enter your friend's Nebula ID (e.g., NEB-X7K2):"
//     );
//     if (code) {
//       addContactByCode(code);
//     }
//   };

//   const openAIChat = () => {
//     const aiContact = contacts.find((c) => c.isAI);
//     if (aiContact) setActiveChatId(aiContact.id);
//   };

//   if (!user) return <LoginScreen onLogin={setUser} />;

//   return (
//     <div
//       className="flex h-screen overflow-hidden font-sans relative transition-colors duration-300"
//       style={{ backgroundColor: theme.bg }}
//     >
//       {showSettings && (
//         <SettingsModal
//           user={user}
//           theme={theme}
//           onClose={() => setShowSettings(false)}
//           onUpdate={updateMyProfile}
//         />
//       )}

//       {callStatus === "incoming" && activeContact && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
//           <div className="bg-gray-800 p-8 rounded-3xl text-center shadow-2xl border border-gray-700 w-80">
//             <img
//               src={activeContact.avatar}
//               alt="Caller"
//               className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-lg"
//             />
//             <h2 className="text-2xl font-bold text-white mb-1">
//               {activeContact.name}
//             </h2>
//             <p className="text-indigo-400 mb-8 font-medium animate-pulse">
//               Incoming {callType} Call...
//             </p>
//             <div className="flex justify-center gap-6">
//               <button
//                 onClick={endCall}
//                 className="p-4 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
//               >
//                 <PhoneMissed size={28} />
//               </button>
//               <button
//                 onClick={answerCall}
//                 className="p-4 bg-green-500 rounded-full text-white shadow-lg hover:bg-green-600 transition-transform hover:scale-110 animate-bounce"
//               >
//                 <Phone size={28} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {detailedProfile && (
//         <ProfileDetailsModal
//           contact={detailedProfile}
//           onClose={() => setDetailedProfile(null)}
//           theme={theme}
//           onUpdate={handleUpdateContact}
//         />
//       )}
//       {previewProfile && (
//         <ProfilePopup
//           contact={previewProfile}
//           onClose={() => setPreviewProfile(null)}
//           onCall={(type) => {
//             setPreviewProfile(null);
//             setActiveChatId(previewProfile.id);
//             startCall(type);
//           }}
//           onMessage={() => {
//             setPreviewProfile(null);
//             setActiveChatId(previewProfile.id);
//           }}
//           onViewDetails={() => {
//             setPreviewProfile(null);
//             setDetailedProfile(previewProfile);
//           }}
//           theme={theme}
//         />
//       )}
//       {(callStatus === "connected" || callStatus === "ringing") &&
//         activeContact && (
//           <CallOverlay
//             contact={activeContact}
//             type={callType}
//             onEnd={endCall}
//           />
//         )}

//       {/* SIDEBAR */}
//       <div
//         className={`flex-col border-r h-full w-full md:w-[400px] flex-shrink-0 relative ${
//           activeChatId ? "hidden md:flex" : "flex"
//         }`}
//         style={{ backgroundColor: theme.sidebar, borderColor: theme.border }}
//       >
//         <div className="px-6 h-20 flex justify-between items-center flex-shrink-0">
//           <div className="flex items-center gap-3 group">
//             <div
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setPreviewProfile(user);
//               }}
//               className="cursor-pointer transition-transform active:scale-95 hover:opacity-80 relative"
//             >
//               <img
//                 src={user.avatar}
//                 className="w-10 h-10 rounded-full object-cover border border-gray-200"
//                 alt="me"
//               />
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//             </div>
//             <h1 className="text-xl font-bold" style={{ color: theme.textMain }}>
//               Chats
//             </h1>
//             <button
//               onClick={handleAddFriend}
//               className="p-1.5 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors ml-1"
//               title="Add Friend by ID"
//             >
//               <UserPlus size={18} />
//             </button>
//           </div>
//           <div className="flex gap-2 relative">
//             <button
//               onClick={toggleTheme}
//               className="p-2.5 rounded-full hover:bg-black/5 transition-all active:scale-90"
//               title="Toggle Theme (Ctrl+B)"
//               style={{ color: theme.iconColor }}
//             >
//               {theme.id === "light" ? <Moon size={20} /> : <Sun size={20} />}
//             </button>
//             <button
//               onClick={() => setShowSidebarMenu(!showSidebarMenu)}
//               className={`p-2 rounded-full transition-all ${
//                 showSidebarMenu ? "bg-black/10 rotate-90" : "hover:bg-black/5"
//               }`}
//               style={{ color: theme.iconColor }}
//             >
//               <MoreVertical size={20} />
//             </button>

//             {/* UPDATED SIDEBAR MENU */}
//             {showSidebarMenu && (
//               <div
//                 ref={sidebarMenuRef}
//                 className="absolute top-12 right-0 bg-white shadow-2xl rounded-2xl py-2 border w-60 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right overflow-hidden"
//                 style={{ backgroundColor: theme.bg, borderColor: theme.border }}
//               >
//                 <div
//                   className="px-4 py-3 border-b"
//                   style={{ borderColor: theme.border }}
//                 >
//                   <p
//                     className="text-xs font-bold uppercase opacity-70 mb-1"
//                     style={{ color: theme.textSec }}
//                   >
//                     Your Share ID
//                   </p>
//                   <p className="text-sm font-mono font-bold text-indigo-500 select-all bg-indigo-500/10 px-2 py-1 rounded-md">
//                     {user.shareId || "Loading..."}
//                   </p>
//                 </div>

//                 <div className="p-2 space-y-1">
//                   {/* Settings Button with GLOW */}
//                   <button
//                     onClick={() => {
//                       setShowSettings(true);
//                       setShowSidebarMenu(false);
//                     }}
//                     className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium transition-all rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
//                     style={{ color: theme.textMain }}
//                   >
//                     <Settings size={18} /> Settings
//                   </button>

//                   {/* Help Button with GLOW */}
//                   <button
//                     onClick={() => {
//                       alert("Help & Support coming soon!");
//                       setShowSidebarMenu(false);
//                     }}
//                     className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium transition-all rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
//                     style={{ color: theme.textMain }}
//                   >
//                     <HelpCircle size={18} /> Help & Support
//                   </button>
//                 </div>

//                 <div
//                   className="h-px mx-2 my-1"
//                   style={{ backgroundColor: theme.border }}
//                 ></div>
//                 <div className="p-2">
//                   {/* CHANGE: Use dynamic API_URL for logout */}
//                   <button
//                     onClick={() =>
//                       window.open(`${BASE_URL}/api/logout`, "_self")
//                     }
//                     className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full text-sm font-medium transition-all rounded-xl hover:shadow-md hover:shadow-red-500/10"
//                   >
//                     <LogOut size={18} /> Logout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="px-4 pb-2 flex-shrink-0">
//           <div
//             className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition-colors focus-within:ring-1 focus-within:ring-indigo-500/30"
//             style={{ backgroundColor: theme.inputBg }}
//           >
//             <Search size={18} className="text-gray-400 mr-2" />
//             <input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search..."
//               className="bg-transparent border-none outline-none w-full text-sm font-medium"
//               style={{ color: theme.textMain }}
//             />
//           </div>
//         </div>

//         {/* CHAT LIST (FIXED HOVER PADDING) */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar relative px-2">
//           {contacts
//             .filter((c) => !c.isAI)
//             .filter((c) =>
//               c.name.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .map((contact) => (
//               // Added 'mx-2' and 'rounded-xl' to fix hover bleeding
//               <div
//                 key={contact.id}
//                 className="relative group my-1 rounded-xl overflow-hidden mx-1"
//               >
//                 <div
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setPreviewProfile(contact);
//                   }}
//                   className="absolute left-3 top-3 w-12 h-12 z-20 cursor-pointer rounded-full transition-all hover:opacity-80"
//                 ></div>
//                 <ChatItem
//                   contact={contact}
//                   onClick={() => setActiveChatId(contact.id)}
//                   isActive={activeChatId === contact.id}
//                   theme={theme}
//                 />
//               </div>
//             ))}
//         </div>
//         <div className="absolute bottom-6 right-6 z-30">
//           <button
//             onClick={openAIChat}
//             className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center animate-in slide-in-from-bottom-4 duration-500"
//             title="Ask Nebula AI"
//           >
//             <Sparkles size={28} fill="currentColor" className="animate-pulse" />
//           </button>
//         </div>
//       </div>

//       <div
//         className={`flex-1 flex flex-col h-full min-w-0 relative ${
//           !activeChatId ? "hidden md:flex" : "flex"
//         }`}
//         style={{ backgroundColor: theme.bg }}
//       >
//         {activeChatId && activeContact ? (
//           <>
//             <div
//               className="h-20 border-b flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0"
//               style={{
//                 backgroundColor: theme.header,
//                 borderColor: theme.border,
//               }}
//             >
//               <div className="flex items-center">
//                 <button
//                   onClick={() => setActiveChatId(null)}
//                   className="mr-3 p-2 hover:bg-black/5 rounded-full transition-colors"
//                   title="Close Chat"
//                 >
//                   <ArrowLeft size={20} style={{ color: theme.textMain }} />
//                 </button>
//                 <div
//                   onClick={() => setViewingProfile(activeContact)}
//                   className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
//                 >
//                   <img
//                     src={activeContact.avatar}
//                     className="w-10 h-10 rounded-full mr-3 object-cover shadow-sm"
//                     alt="contact"
//                   />
//                   <div>
//                     <h2
//                       className="font-bold text-base truncate flex items-center gap-2"
//                       style={{ color: theme.textMain }}
//                     >
//                       {activeContact.name}
//                       {activeContact.blocked && (
//                         <Ban size={14} className="text-red-500" />
//                       )}
//                       {activeContact.isAI && (
//                         <Sparkles
//                           size={14}
//                           className="text-indigo-500"
//                           fill="currentColor"
//                         />
//                       )}
//                     </h2>
//                     <p
//                       className="text-xs font-medium truncate transition-colors"
//                       style={{
//                         color:
//                           activeContact.status === "online" ||
//                           activeContact.status === "typing..."
//                             ? "#22c55e"
//                             : theme.textSec,
//                       }}
//                     >
//                       {activeContact.status === "online" ||
//                       activeContact.status === "typing..."
//                         ? activeContact.status
//                         : activeContact.isAI
//                         ? "offline"
//                         : `last seen ${formatLastSeen(
//                             activeContact.lastSeenRaw
//                           )}`}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex gap-1" style={{ color: theme.iconColor }}>
//                 <button
//                   onClick={() => startCall("audio")}
//                   className="p-2 hover:bg-black/5 rounded-full transition-colors"
//                 >
//                   <Phone size={20} />
//                 </button>
//                 <button
//                   onClick={() => startCall("video")}
//                   className="p-2 hover:bg-black/5 rounded-full transition-colors"
//                 >
//                   <Video size={20} />
//                 </button>
//                 <button
//                   onClick={() => setShowChatMenu(!showChatMenu)}
//                   className="p-2 hover:bg-black/5 rounded-full transition-colors"
//                 >
//                   <MoreVertical size={20} />
//                 </button>
//                 {showChatMenu && (
//                   <div
//                     ref={chatMenuRef}
//                     className="absolute top-16 right-4 w-56 bg-white shadow-xl rounded-xl py-2 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-100"
//                     style={{
//                       backgroundColor: theme.bg,
//                       borderColor: theme.border,
//                     }}
//                   >
//                     <button
//                       onClick={() => {
//                         setActiveChatId(null);
//                         setShowChatMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-3 hover:bg-black/5 flex items-center gap-3 text-sm font-medium text-red-500 transition-colors"
//                     >
//                       <XCircle size={18} /> Close Chat
//                     </button>
//                     <div
//                       className="h-px bg-gray-100 my-1"
//                       style={{ backgroundColor: theme.border }}
//                     ></div>
//                     <button
//                       onClick={() => {
//                         setViewingProfile(activeContact);
//                         setShowChatMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-3 hover:bg-black/5 flex items-center gap-3 text-sm font-medium"
//                       style={{ color: theme.textMain }}
//                     >
//                       <Users size={18} /> Contact Info
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//               {messages.map((msg: any) => (
//                 <MessageBubble
//                   key={msg.id}
//                   message={msg}
//                   theme={theme}
//                   onReply={(m) => setReplyingTo(m)}
//                   currentUserId={user?.id}
//                 />
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             {!activeContact.blocked ? (
//               <ChatInput
//                 onSend={handleSendMessage}
//                 theme={theme}
//                 text={inputText}
//                 setText={setInputText}
//                 replyingTo={replyingTo}
//                 cancelReply={() => setReplyingTo(null)}
//                 smartReplies={activeContact.isAI ? smartReplies : []}
//               />
//             ) : (
//               <div
//                 className="p-5 text-center border-t text-sm font-bold cursor-pointer transition-colors hover:opacity-80 flex flex-col items-center justify-center gap-2"
//                 style={{
//                   backgroundColor: theme.header,
//                   borderColor: theme.border,
//                   color: theme.textSec,
//                 }}
//                 onClick={() =>
//                   handleUpdateContact({ ...activeContact, blocked: false })
//                 }
//               >
//                 <Ban size={24} className="text-red-500" />
//                 <span className="text-red-500">
//                   You blocked this contact. Tap to unblock.
//                 </span>
//               </div>
//             )}
//           </>
//         ) : (
//           <EmptyState theme={theme} />
//         )}
//       </div>
//       {viewingProfile && (
//         <ProfilePanel
//           contact={viewingProfile}
//           onClose={() => setViewingProfile(null)}
//           theme={theme}
//           onUpdate={handleUpdateContact}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// import { useRef, useEffect, useState, useMemo } from "react";
// import {
//   Search,
//   MoreVertical,
//   Phone,
//   Video,
//   ArrowLeft,
//   LogOut,
//   Sun,
//   Moon,
//   Users,
//   Settings,
//   XCircle,
//   Ban,
//   Sparkles,
//   UserPlus,
//   PhoneMissed,
//   HelpCircle,
// } from "lucide-react";

// import { useChat } from "./hooks/useChat";
// import { formatLastSeen } from "./utils";
// import LoginScreen from "./components/LoginScreen";
// import ChatItem from "./components/ChatItem";
// import MessageBubble from "./components/MessageBubble";
// import ChatInput from "./components/ChatInput";
// import CallOverlay from "./components/CallOverlay";
// import { EmptyState } from "./components/Modals";
// import ProfilePanel from "./components/ProfilePanel";
// import ProfilePopup from "./components/ProfilePopup";
// import ProfileDetailsModal from "./components/ProfileDetailsModal";
// import SettingsModal from "./components/SettingsModal";
// import { BASE_URL } from "./lib/axios";

// function App() {
//   const {
//     user,
//     setUser,
//     activeChatId,
//     setActiveChatId,
//     contacts,
//     messages,
//     theme,
//     toggleTheme,
//     inputText,
//     setInputText,
//     searchTerm,
//     setSearchTerm,
//     replyingTo,
//     setReplyingTo,
//     smartReplies,
//     activeContact,
//     handleSendMessage,
//     handleFileUpload, // [FIX] Destructure this
//     callStatus,
//     startCall,
//     endCall,
//     callType,
//     answerCall,
//     showSidebarMenu,
//     setShowSidebarMenu,
//     viewingProfile,
//     setViewingProfile,
//     previewProfile,
//     setPreviewProfile,
//     detailedProfile,
//     setDetailedProfile,
//     handleUpdateContact,
//     addContactByCode,
//     updateMyProfile,
//   } = useChat();

//   const [showChatMenu, setShowChatMenu] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);
//   const chatMenuRef = useRef<HTMLDivElement>(null);
//   const sidebarMenuRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // [OPTIMIZATION] Memoize filtered contacts to prevent re-calc on every render
//   const filteredContacts = useMemo(() => {
//     return contacts
//       .filter((c) => !c.isAI)
//       .filter((c) =>
//         c.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//   }, [contacts, searchTerm]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         showChatMenu &&
//         chatMenuRef.current &&
//         !chatMenuRef.current.contains(event.target as Node)
//       ) {
//         setShowChatMenu(false);
//       }
//       if (
//         showSidebarMenu &&
//         sidebarMenuRef.current &&
//         !sidebarMenuRef.current.contains(event.target as Node)
//       ) {
//         setShowSidebarMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showChatMenu, showSidebarMenu]);

//   useEffect(() => {
//     const handleGlobalKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         if (showSettings) setShowSettings(false);
//         else if (detailedProfile) setDetailedProfile(null);
//         else if (previewProfile) setPreviewProfile(null);
//         else if (viewingProfile) setViewingProfile(null);
//         else if (replyingTo) setReplyingTo(null);
//         else if (activeChatId) setActiveChatId(null);
//       }
//       if ((e.ctrlKey || e.metaKey) && e.key === "b") {
//         e.preventDefault();
//         toggleTheme();
//       }
//     };
//     window.addEventListener("keydown", handleGlobalKeyDown);
//     return () => window.removeEventListener("keydown", handleGlobalKeyDown);
//   }, [
//     showSettings,
//     detailedProfile,
//     previewProfile,
//     viewingProfile,
//     replyingTo,
//     activeChatId,
//     toggleTheme,
//   ]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, replyingTo]);

//   const handleAddFriend = () => {
//     const code = window.prompt(
//       "Enter your friend's Nebula ID (e.g., NEB-X7K2):"
//     );
//     if (code) {
//       addContactByCode(code);
//     }
//   };

//   const openAIChat = () => {
//     const aiContact = contacts.find((c) => c.isAI);
//     if (aiContact) setActiveChatId(aiContact.id);
//   };

//   if (!user) return <LoginScreen onLogin={setUser} />;

//   return (
//     <div
//       className="flex h-screen overflow-hidden font-sans relative transition-colors duration-300"
//       style={{ backgroundColor: theme.bg }}
//     >
//       {showSettings && (
//         <SettingsModal
//           user={user}
//           theme={theme}
//           onClose={() => setShowSettings(false)}
//           onUpdate={updateMyProfile}
//         />
//       )}

//       {callStatus === "incoming" && activeContact && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
//           <div className="bg-gray-800 p-8 rounded-3xl text-center shadow-2xl border border-gray-700 w-80">
//             <img
//               src={activeContact.avatar}
//               alt="Caller"
//               className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-lg"
//             />
//             <h2 className="text-2xl font-bold text-white mb-1">
//               {activeContact.name}
//             </h2>
//             <p className="text-indigo-400 mb-8 font-medium animate-pulse">
//               Incoming {callType} Call...
//             </p>
//             <div className="flex justify-center gap-6">
//               <button
//                 onClick={endCall}
//                 className="p-4 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
//               >
//                 <PhoneMissed size={28} />
//               </button>
//               <button
//                 onClick={answerCall}
//                 className="p-4 bg-green-500 rounded-full text-white shadow-lg hover:bg-green-600 transition-transform hover:scale-110 animate-bounce"
//               >
//                 <Phone size={28} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {detailedProfile && (
//         <ProfileDetailsModal
//           contact={detailedProfile}
//           onClose={() => setDetailedProfile(null)}
//           theme={theme}
//           onUpdate={handleUpdateContact}
//         />
//       )}
//       {previewProfile && (
//         <ProfilePopup
//           contact={previewProfile}
//           onClose={() => setPreviewProfile(null)}
//           onCall={(type) => {
//             setPreviewProfile(null);
//             setActiveChatId(previewProfile.id);
//             startCall(type);
//           }}
//           onMessage={() => {
//             setPreviewProfile(null);
//             setActiveChatId(previewProfile.id);
//           }}
//           onViewDetails={() => {
//             setPreviewProfile(null);
//             setDetailedProfile(previewProfile);
//           }}
//           theme={theme}
//         />
//       )}
//       {(callStatus === "connected" || callStatus === "ringing") &&
//         activeContact && (
//           <CallOverlay
//             contact={activeContact}
//             type={callType}
//             onEnd={endCall}
//           />
//         )}

//       {/* SIDEBAR */}
//       <div
//         className={`flex-col border-r h-full w-full md:w-[400px] flex-shrink-0 relative ${
//           activeChatId ? "hidden md:flex" : "flex"
//         }`}
//         style={{ backgroundColor: theme.sidebar, borderColor: theme.border }}
//       >
//         <div className="px-6 h-20 flex justify-between items-center flex-shrink-0">
//           <div className="flex items-center gap-3 group">
//             <div
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setPreviewProfile(user);
//               }}
//               className="cursor-pointer transition-transform active:scale-95 hover:opacity-80 relative"
//             >
//               <img
//                 src={user.avatar}
//                 className="w-10 h-10 rounded-full object-cover border border-gray-200"
//                 alt="me"
//               />
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//             </div>
//             <h1 className="text-xl font-bold" style={{ color: theme.textMain }}>
//               Chats
//             </h1>
//             <button
//               onClick={handleAddFriend}
//               className="p-1.5 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors ml-1"
//               title="Add Friend by ID"
//             >
//               <UserPlus size={18} />
//             </button>
//           </div>
//           <div className="flex gap-2 relative">
//             <button
//               onClick={toggleTheme}
//               className="p-2.5 rounded-full hover:bg-black/5 transition-all active:scale-90"
//               title="Toggle Theme (Ctrl+B)"
//               style={{ color: theme.iconColor }}
//             >
//               {theme.id === "light" ? <Moon size={20} /> : <Sun size={20} />}
//             </button>
//             <button
//               onClick={() => setShowSidebarMenu(!showSidebarMenu)}
//               className={`p-2 rounded-full transition-all ${
//                 showSidebarMenu ? "bg-black/10 rotate-90" : "hover:bg-black/5"
//               }`}
//               style={{ color: theme.iconColor }}
//             >
//               <MoreVertical size={20} />
//             </button>

//             {/* SIDEBAR MENU */}
//             {showSidebarMenu && (
//               <div
//                 ref={sidebarMenuRef}
//                 className="absolute top-12 right-0 bg-white shadow-2xl rounded-2xl py-2 border w-60 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right overflow-hidden"
//                 style={{ backgroundColor: theme.bg, borderColor: theme.border }}
//               >
//                 <div
//                   className="px-4 py-3 border-b"
//                   style={{ borderColor: theme.border }}
//                 >
//                   <p
//                     className="text-xs font-bold uppercase opacity-70 mb-1"
//                     style={{ color: theme.textSec }}
//                   >
//                     Your Share ID
//                   </p>
//                   <p className="text-sm font-mono font-bold text-indigo-500 select-all bg-indigo-500/10 px-2 py-1 rounded-md">
//                     {user.shareId || "Loading..."}
//                   </p>
//                 </div>

//                 <div className="p-2 space-y-1">
//                   <button
//                     onClick={() => {
//                       setShowSettings(true);
//                       setShowSidebarMenu(false);
//                     }}
//                     className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium transition-all rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
//                     style={{ color: theme.textMain }}
//                   >
//                     <Settings size={18} /> Settings
//                   </button>

//                   <button
//                     onClick={() => {
//                       alert("Help & Support coming soon!");
//                       setShowSidebarMenu(false);
//                     }}
//                     className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium transition-all rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
//                     style={{ color: theme.textMain }}
//                   >
//                     <HelpCircle size={18} /> Help & Support
//                   </button>
//                 </div>

//                 <div
//                   className="h-px mx-2 my-1"
//                   style={{ backgroundColor: theme.border }}
//                 ></div>
//                 <div className="p-2">
//                   <button
//                     onClick={() =>
//                       window.open(`${BASE_URL}/api/logout`, "_self")
//                     }
//                     className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full text-sm font-medium transition-all rounded-xl hover:shadow-md hover:shadow-red-500/10"
//                   >
//                     <LogOut size={18} /> Logout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="px-4 pb-2 flex-shrink-0">
//           <div
//             className="flex items-center bg-gray-100 rounded-lg px-3 py-2 transition-colors focus-within:ring-1 focus-within:ring-indigo-500/30"
//             style={{ backgroundColor: theme.inputBg }}
//           >
//             <Search size={18} className="text-gray-400 mr-2" />
//             <input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search..."
//               className="bg-transparent border-none outline-none w-full text-sm font-medium"
//               style={{ color: theme.textMain }}
//             />
//           </div>
//         </div>

//         {/* CHAT LIST */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar relative px-2">
//           {/* [OPTIMIZATION] Use the memoized filtered list */}
//           {filteredContacts.map((contact) => (
//               <div
//                 key={contact.id}
//                 className="relative group my-1 rounded-xl overflow-hidden mx-1"
//               >
//                 <div
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setPreviewProfile(contact);
//                   }}
//                   className="absolute left-3 top-3 w-12 h-12 z-20 cursor-pointer rounded-full transition-all hover:opacity-80"
//                 ></div>
//                 <ChatItem
//                   contact={contact}
//                   onClick={() => setActiveChatId(contact.id)}
//                   isActive={activeChatId === contact.id}
//                   theme={theme}
//                 />
//               </div>
//             ))}
//         </div>
//         <div className="absolute bottom-6 right-6 z-30">
//           <button
//             onClick={openAIChat}
//             className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center animate-in slide-in-from-bottom-4 duration-500"
//             title="Ask Nebula AI"
//           >
//             <Sparkles size={28} fill="currentColor" className="animate-pulse" />
//           </button>
//         </div>
//       </div>

//       <div
//         className={`flex-1 flex flex-col h-full min-w-0 relative ${
//           !activeChatId ? "hidden md:flex" : "flex"
//         }`}
//         style={{ backgroundColor: theme.bg }}
//       >
//         {activeChatId && activeContact ? (
//           <>
//             <div
//               className="h-20 border-b flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0"
//               style={{
//                 backgroundColor: theme.header,
//                 borderColor: theme.border,
//               }}
//             >
//               <div className="flex items-center">
//                 <button
//                   onClick={() => setActiveChatId(null)}
//                   className="mr-3 p-2 hover:bg-black/5 rounded-full transition-colors"
//                   title="Close Chat"
//                 >
//                   <ArrowLeft size={20} style={{ color: theme.textMain }} />
//                 </button>
//                 <div
//                   onClick={() => setViewingProfile(activeContact)}
//                   className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
//                 >
//                   <img
//                     src={activeContact.avatar}
//                     className="w-10 h-10 rounded-full mr-3 object-cover shadow-sm"
//                     alt="contact"
//                   />
//                   <div>
//                     <h2
//                       className="font-bold text-base truncate flex items-center gap-2"
//                       style={{ color: theme.textMain }}
//                     >
//                       {activeContact.name}
//                       {activeContact.blocked && (
//                         <Ban size={14} className="text-red-500" />
//                       )}
//                       {activeContact.isAI && (
//                         <Sparkles
//                           size={14}
//                           className="text-indigo-500"
//                           fill="currentColor"
//                         />
//                       )}
//                     </h2>
//                     <p
//                       className="text-xs font-medium truncate transition-colors"
//                       style={{
//                         color:
//                           activeContact.status === "online" ||
//                           activeContact.status === "typing..."
//                             ? "#22c55e"
//                             : theme.textSec,
//                       }}
//                     >
//                       {activeContact.status === "online" ||
//                       activeContact.status === "typing..."
//                         ? activeContact.status
//                         : activeContact.isAI
//                         ? "offline"
//                         : `last seen ${formatLastSeen(
//                             activeContact.lastSeenRaw
//                           )}`}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex gap-1" style={{ color: theme.iconColor }}>
//                 <button
//                   onClick={() => startCall("audio")}
//                   className="p-2 hover:bg-black/5 rounded-full transition-colors"
//                 >
//                   <Phone size={20} />
//                 </button>
//                 <button
//                   onClick={() => startCall("video")}
//                   className="p-2 hover:bg-black/5 rounded-full transition-colors"
//                 >
//                   <Video size={20} />
//                 </button>
//                 <button
//                   onClick={() => setShowChatMenu(!showChatMenu)}
//                   className="p-2 hover:bg-black/5 rounded-full transition-colors"
//                 >
//                   <MoreVertical size={20} />
//                 </button>
//                 {showChatMenu && (
//                   <div
//                     ref={chatMenuRef}
//                     className="absolute top-16 right-4 w-56 bg-white shadow-xl rounded-xl py-2 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-100"
//                     style={{
//                       backgroundColor: theme.bg,
//                       borderColor: theme.border,
//                     }}
//                   >
//                     <button
//                       onClick={() => {
//                         setActiveChatId(null);
//                         setShowChatMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-3 hover:bg-black/5 flex items-center gap-3 text-sm font-medium text-red-500 transition-colors"
//                     >
//                       <XCircle size={18} /> Close Chat
//                     </button>
//                     <div
//                       className="h-px bg-gray-100 my-1"
//                       style={{ backgroundColor: theme.border }}
//                     ></div>
//                     <button
//                       onClick={() => {
//                         setViewingProfile(activeContact);
//                         setShowChatMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-3 hover:bg-black/5 flex items-center gap-3 text-sm font-medium"
//                       style={{ color: theme.textMain }}
//                     >
//                       <Users size={18} /> Contact Info
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//               {messages.map((msg: any) => (
//                 <MessageBubble
//                   key={msg.id}
//                   message={msg}
//                   theme={theme}
//                   onReply={(m) => setReplyingTo(m)}
//                   currentUserId={user?.id}
//                 />
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             {!activeContact.blocked ? (
//               <ChatInput
//                 onSend={handleSendMessage}
//                 onFileUpload={handleFileUpload} // [FIX] Passed prop
//                 theme={theme}
//                 text={inputText}
//                 setText={setInputText}
//                 replyingTo={replyingTo}
//                 cancelReply={() => setReplyingTo(null)}
//                 smartReplies={activeContact.isAI ? smartReplies : []}
//               />
//             ) : (
//               <div
//                 className="p-5 text-center border-t text-sm font-bold cursor-pointer transition-colors hover:opacity-80 flex flex-col items-center justify-center gap-2"
//                 style={{
//                   backgroundColor: theme.header,
//                   borderColor: theme.border,
//                   color: theme.textSec,
//                 }}
//                 onClick={() =>
//                   handleUpdateContact({ ...activeContact, blocked: false })
//                 }
//               >
//                 <Ban size={24} className="text-red-500" />
//                 <span className="text-red-500">
//                   You blocked this contact. Tap to unblock.
//                 </span>
//               </div>
//             )}
//           </>
//         ) : (
//           <EmptyState theme={theme} />
//         )}
//       </div>
//       {viewingProfile && (
//         <ProfilePanel
//           contact={viewingProfile}
//           onClose={() => setViewingProfile(null)}
//           theme={theme}
//           onUpdate={handleUpdateContact}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

import { useState, useRef, useEffect, useMemo } from "react";
import {
  MoreVertical,
  Search,
  Phone,
  Video,
  LogOut,
  UserPlus,
  Moon,
  Sun,
  Settings,
  ArrowLeft,
  Sparkles,
  Ban,
  HelpCircle,
  XCircle,
  PhoneMissed,
} from "lucide-react";

// --- Components (Default Imports) ---
import ChatItem from "./components/ChatItem";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import ProfilePanel from "./components/ProfilePanel";
import LoginScreen from "./components/LoginScreen";
import CallOverlay from "./components/CallOverlay";

// [FIX] Default Imports for these components
import ProfileDetailsModal from "./components/ProfileDetailsModal";
import SettingsModal from "./components/SettingsModal";
import ProfilePopup from "./components/ProfilePopup";

import AddContactModal from "./components/AddContactModal";
import { EmptyState } from "./components/Modals";

import { useChat } from "./hooks/useChat";
import { BASE_URL } from "./lib/axios";
import { formatLastSeen } from "./utils";

function App() {
  const {
    user,
    setUser,
    activeChatId,
    setActiveChatId,
    contacts,
    messages,
    theme,
    toggleTheme,
    inputText,
    setInputText,
    searchTerm,
    setSearchTerm,
    replyingTo,
    setReplyingTo,
    activeContact,
    handleSendMessage,
    handleFileUpload,
    addContactByCode,
    updateMyProfile,
    callStatus,
    startCall,
    endCall,
    callType,
    answerCall,
    showSidebarMenu,
    setShowSidebarMenu,
    viewingProfile,
    setViewingProfile,
    previewProfile,
    setPreviewProfile,
    detailedProfile,
    setDetailedProfile,
    handleUpdateContact,
    sendTyping,
    typingUsers,
    deleteMessage,
    reactToMessage,
    smartReplies,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarMenuRef = useRef<HTMLDivElement>(null);

  const [showAddContact, setShowAddContact] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);

  // --- Memoized Filters ---
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => !c.isAI)
      .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [contacts, searchTerm]);

  // --- Auto Scroll ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId, replyingTo]);

  // --- Keyboard Shortcuts & Outside Click ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSettings(false);
        setShowAddContact(false);
        setShowChatMenu(false);
        setDetailedProfile(null);
        setPreviewProfile(null);
        setViewingProfile(null);
        setReplyingTo(null);
        if (
          !showSettings &&
          !detailedProfile &&
          !previewProfile &&
          !viewingProfile
        ) {
          setActiveChatId(null);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleTheme();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarMenuRef.current &&
        !sidebarMenuRef.current.contains(event.target as Node)
      ) {
        setShowSidebarMenu(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showSettings,
    detailedProfile,
    previewProfile,
    viewingProfile,
    toggleTheme,
    setShowSidebarMenu,
    setActiveChatId,
  ]);

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div
      className="flex h-screen overflow-hidden font-sans relative transition-colors duration-300"
      style={{ backgroundColor: theme.bg, color: theme.textMain }}
    >
      {/* --- INCOMING CALL UI --- */}
      {callStatus === "incoming" && activeContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-gray-800 p-8 rounded-3xl text-center shadow-2xl border border-gray-700 w-80">
            <img
              src={activeContact.avatar}
              alt="Caller"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 shadow-lg object-cover"
            />
            <h2 className="text-2xl font-bold text-white mb-1">
              {activeContact.name}
            </h2>
            <p className="text-indigo-400 mb-8 font-medium animate-pulse">
              Incoming {callType} Call...
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={endCall}
                className="p-4 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
              >
                <PhoneMissed size={28} />
              </button>
              <button
                onClick={answerCall}
                className="p-4 bg-green-500 rounded-full text-white shadow-lg hover:bg-green-600 transition-transform hover:scale-110 animate-bounce"
              >
                <Phone size={28} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ACTIVE CALL OVERLAY --- */}
      {(callStatus === "connected" || callStatus === "ringing") && (
        <CallOverlay type={callType} contact={activeContact} onEnd={endCall} />
      )}

      {/* --- MODALS --- */}
      {showAddContact && (
        <AddContactModal
          onClose={() => setShowAddContact(false)}
          onAdd={addContactByCode}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          user={user}
          onUpdate={updateMyProfile} // Use 'onUpdate' not 'onUpdateProfile' if that matches the component
          theme={theme}
        />
      )}
      {previewProfile && (
        <ProfilePopup
          contact={previewProfile}
          theme={theme}
          onClose={() => setPreviewProfile(null)}
          onViewProfile={(c: any) => {
            setPreviewProfile(null);
            setDetailedProfile(c);
          }}
          onMessage={() => {
            setPreviewProfile(null);
            setActiveChatId(previewProfile.id);
          }}
          onCall={(type: any) => {
            setPreviewProfile(null);
            setActiveChatId(previewProfile.id);
            startCall(type);
          }}
        />
      )}
      {detailedProfile && (
        <ProfileDetailsModal
          contact={detailedProfile}
          currentUser={user} // [FIX] Added missing prop
          onClose={() => setDetailedProfile(null)}
          theme={theme}
          onUpdate={handleUpdateContact}
        />
      )}

      {/* --- SIDEBAR --- */}
      <div
        className={`w-full md:w-[380px] flex flex-col border-r relative z-10 transition-transform duration-300 md:translate-x-0 ${
          activeChatId
            ? "-translate-x-full hidden md:flex"
            : "translate-x-0 flex"
        }`}
        style={{ backgroundColor: theme.sidebar, borderColor: theme.border }}
      >
        {/* Header */}
        <div
          className="h-16 flex items-center justify-between px-4 border-b flex-shrink-0"
          style={{ borderColor: theme.border }}
        >
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80"
            onClick={() => setDetailedProfile(user)}
          >
            <img
              src={user.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-indigo-500 p-0.5 object-cover"
            />
            <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Nebula
            </h1>
          </div>
          <div className="flex gap-2 relative">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-black/5 rounded-full"
              style={{ color: theme.iconColor }}
            >
              {theme.type === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setShowAddContact(true)}
              className="p-2 hover:bg-black/5 rounded-full"
              style={{ color: theme.iconColor }}
            >
              <UserPlus size={20} />
            </button>
            <button
              onClick={() => setShowSidebarMenu(!showSidebarMenu)}
              className="p-2 hover:bg-black/5 rounded-full"
              style={{ color: theme.iconColor }}
            >
              <MoreVertical size={20} />
            </button>

            {showSidebarMenu && (
              <div
                ref={sidebarMenuRef}
                className="absolute top-12 right-0 bg-white shadow-2xl rounded-xl border py-2 w-60 z-50 animate-in fade-in zoom-in-95 origin-top-right overflow-hidden"
                style={{ backgroundColor: theme.bg, borderColor: theme.border }}
              >
                <div
                  className="px-4 py-3 border-b"
                  style={{ borderColor: theme.border }}
                >
                  <p className="text-xs font-bold uppercase opacity-70 mb-1">
                    Your Share ID
                  </p>
                  <p className="text-sm font-mono font-bold text-indigo-500 select-all bg-indigo-500/10 px-2 py-1 rounded-md">
                    {user.shareId || "Loading..."}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setShowSidebarMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 w-full text-sm hover:bg-gray-50 rounded-lg transition-colors"
                    style={{ color: theme.textMain }}
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    onClick={() => {
                      alert("Coming Soon!");
                      setShowSidebarMenu(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 w-full text-sm hover:bg-gray-50 rounded-lg transition-colors"
                    style={{ color: theme.textMain }}
                  >
                    <HelpCircle size={16} /> Help
                  </button>
                </div>
                <div
                  className="h-px bg-gray-100 my-1"
                  style={{ backgroundColor: theme.border }}
                />
                <div className="p-2">
                  <button
                    onClick={() =>
                      (window.location.href = `${BASE_URL}/api/logout`)
                    }
                    className="flex items-center gap-3 px-4 py-2 w-full text-sm hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
            style={{
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
            }}
          >
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none w-full text-sm"
              style={{ color: theme.textMain }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="relative group my-1">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewProfile(contact);
                }}
                className="absolute left-2 top-2 w-12 h-12 z-20 cursor-pointer rounded-full opacity-0 hover:opacity-10"
              />
              <ChatItem
                contact={contact}
                isActive={activeChatId === contact.id}
                onClick={() => setActiveChatId(contact.id)}
                theme={theme}
              />
            </div>
          ))}
        </div>

        {/* AI FAB */}
        <div className="absolute bottom-6 right-6 z-30">
          <button
            onClick={() => {
              const ai = contacts.find((c) => c.isAI);
              if (ai) setActiveChatId(ai.id);
            }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center animate-in slide-in-from-bottom-4"
          >
            <Sparkles size={28} className="animate-pulse" />
          </button>
        </div>
      </div>

      {/* --- RIGHT CHAT --- */}
      <div
        className={`flex-1 flex flex-col relative w-full h-full transition-transform duration-300 md:translate-x-0 ${activeChatId ? "translate-x-0" : "translate-x-full hidden md:flex md:translate-x-0"}`}
        style={{ backgroundColor: theme.bg }}
      >
        {activeChatId && activeContact ? (
          <>
            <div
              className="h-16 border-b flex items-center justify-between px-4 shadow-sm z-10 flex-shrink-0"
              style={{
                backgroundColor: theme.header,
                borderColor: theme.border,
              }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="md:hidden p-2 -ml-2 text-gray-500"
                >
                  <ArrowLeft size={20} style={{ color: theme.textMain }} />
                </button>
                <div
                  className="relative cursor-pointer flex items-center gap-3"
                  onClick={() => setViewingProfile(activeContact)}
                >
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      {activeContact.name}{" "}
                      {activeContact.blocked && (
                        <Ban size={14} className="text-red-500" />
                      )}
                    </h3>
                    <p
                      className={`text-xs ${typingUsers.has(activeContact.id) ? "text-indigo-500 font-bold" : "opacity-70"}`}
                    >
                      {typingUsers.has(activeContact.id)
                        ? "typing..."
                        : activeContact.status === "online"
                          ? "Online"
                          : `last seen ${formatLastSeen(activeContact.lastSeenRaw)}`}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-1"
                style={{ color: theme.iconColor }}
              >
                <button
                  onClick={() => startCall("audio")}
                  className="p-2 hover:bg-black/5 rounded-full"
                >
                  <Phone size={20} />
                </button>
                <button
                  onClick={() => startCall("video")}
                  className="p-2 hover:bg-black/5 rounded-full"
                >
                  <Video size={20} />
                </button>
                <button
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className="p-2 hover:bg-black/5 rounded-full"
                >
                  <MoreVertical size={20} />
                </button>
                {showChatMenu && (
                  <div className="absolute top-14 right-4 bg-white shadow-xl rounded-xl border py-2 w-48 z-50 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setActiveChatId(null);
                        setShowChatMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm flex items-center gap-2"
                    >
                      <XCircle size={16} /> Close Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
              style={{
                backgroundImage:
                  theme.type === "light"
                    ? "radial-gradient(#e5e7eb 1px, transparent 1px)"
                    : "radial-gradient(#374151 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">👋</span>
                  </div>
                  <p>Say hello to start the conversation!</p>
                </div>
              ) : (
                messages.map((msg: any, index: number) => {
                  const prevMsg = messages[index - 1];
                  const isNewDay =
                    !prevMsg ||
                    new Date(msg.timestamp).toDateString() !==
                      new Date(prevMsg.timestamp).toDateString();
                  return (
                    <div key={msg.id}>
                      {isNewDay && (
                        <div className="flex justify-center my-6 opacity-70">
                          <span className="bg-gray-200/50 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
                            {new Date(msg.timestamp).toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}
                      <MessageBubble
                        message={msg}
                        theme={theme}
                        currentUserId={user.id}
                        onReply={setReplyingTo}
                        onReact={reactToMessage}
                        onDelete={(id, type) => deleteMessage(id, type)}
                      />
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {!activeContact.blocked ? (
              <ChatInput
                text={inputText}
                setText={setInputText}
                onSend={handleSendMessage}
                onFileUpload={handleFileUpload}
                theme={theme}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onTyping={(isTyping) => sendTyping(isTyping)}
                smartReplies={activeContact.isAI ? smartReplies : []}
              />
            ) : (
              <div
                className="p-5 text-center border-t text-sm font-bold cursor-pointer transition-colors hover:bg-gray-50 flex flex-col items-center justify-center gap-2"
                style={{
                  backgroundColor: theme.header,
                  borderColor: theme.border,
                }}
                onClick={() =>
                  handleUpdateContact({ ...activeContact, blocked: false })
                }
              >
                <Ban size={24} className="text-red-500" />
                <span className="text-red-500">
                  You blocked this contact. Tap to unblock.
                </span>
              </div>
            )}
          </>
        ) : (
          <EmptyState theme={theme} />
        )}

        <ProfilePanel
          contact={viewingProfile}
          isOpen={!!viewingProfile}
          onClose={() => setViewingProfile(null)}
          theme={theme}
          onUpdateContact={handleUpdateContact}
        />
      </div>
    </div>
  );
}

export default App;
