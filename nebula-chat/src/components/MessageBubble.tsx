// import {
//   Check,
//   CheckCheck,
//   Reply,
//   Phone,
//   Video,
//   PhoneMissed,
//   PhoneIncoming,
//   PhoneOutgoing,
// } from "lucide-react";
// import type { Theme } from "../types";

// interface MessageBubbleProps {
//   message: any;
//   theme: Theme;
//   onReply: (message: any) => void;
//   currentUserId?: string;
// }

// export default function MessageBubble({
//   message,
//   theme,
//   onReply,
//   currentUserId,
// }: MessageBubbleProps) {
//   const isMe = message.senderId === currentUserId || message.senderId === "me";

//   // --- SPECIAL RENDER FOR CALL LOGS ---
//   if (message.type === "call") {
//     const isMissed = message.callDetails?.status === "missed";
//     const isVideo = message.text.includes("Video");

//     // Determine Icon
//     let CallIcon = Phone;
//     if (isMissed) {
//       CallIcon = PhoneMissed;
//     } else if (isVideo) {
//       CallIcon = Video;
//     } else {
//       CallIcon = isMe ? PhoneOutgoing : PhoneIncoming;
//     }

//     return (
//       // ALIGNMENT FIX: 'justify-end' if I started the call, 'justify-start' if they did
//       <div
//         className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}
//       >
//         <div
//           className="flex items-center gap-3 px-4 py-2 bg-gray-100/80 rounded-full text-xs font-medium border border-gray-200 shadow-sm transition-all hover:bg-white"
//           style={{
//             backgroundColor: theme.sidebar,
//             color: theme.textSec,
//             borderColor: theme.border,
//           }}
//         >
//           <div
//             className={`p-2 rounded-full ${
//               isMissed
//                 ? "bg-red-100 text-red-500"
//                 : "bg-indigo-100 text-indigo-500"
//             }`}
//           >
//             <CallIcon size={16} />
//           </div>
//           <div className="flex flex-col items-start">
//             <span className={`font-bold ${isMissed ? "text-red-500" : ""}`}>
//               {isVideo ? "Video Call" : "Audio Call"}
//             </span>
//             <div className="flex items-center gap-1 opacity-70 text-[10px]">
//               <span>
//                 {isMissed ? "Missed" : message.callDetails?.duration || "Ended"}
//               </span>
//               <span>•</span>
//               <span>{message.timestamp}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- NORMAL TEXT MESSAGES ---
//   return (
//     <div
//       className={`flex w-full mb-4 ${
//         isMe ? "justify-end" : "justify-start"
//       } group animate-in fade-in slide-in-from-bottom-2 duration-300`}
//     >
//       <div
//         className={`relative max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2 shadow-sm text-sm ${
//           isMe
//             ? "bg-indigo-600 text-white rounded-br-none"
//             : "bg-white text-gray-800 rounded-bl-none border"
//         }`}
//         style={
//           !isMe
//             ? {
//                 backgroundColor: theme.inputBg,
//                 color: theme.textMain,
//                 borderColor: theme.border,
//               }
//             : {}
//         }
//       >
//         {message.replyTo && (
//           <div
//             className={`mb-2 rounded-lg p-2 text-xs border-l-4 ${
//               isMe
//                 ? "bg-white/10 border-white/50 text-white/90"
//                 : "bg-gray-100 border-indigo-500 text-gray-600"
//             }`}
//           >
//             <p className="font-bold opacity-75">{message.replyTo.senderName}</p>
//             <p className="truncate opacity-75">{message.replyTo.text}</p>
//           </div>
//         )}

//         <p className="leading-relaxed break-words whitespace-pre-wrap">
//           {message.text}
//         </p>

//         <div className={`flex items-center justify-end gap-2 mt-1 select-none`}>
//           <span
//             className={`text-[10px] ${
//               isMe ? "text-indigo-100" : "text-gray-400"
//             }`}
//           >
//             {message.timestamp}
//           </span>

//           {isMe && (
//             <span>
//               {message.status === "sent" && (
//                 <Check size={12} className="text-indigo-200" />
//               )}
//               {message.status === "delivered" && (
//                 <CheckCheck size={12} className="text-indigo-200" />
//               )}
//               {message.status === "read" && (
//                 <CheckCheck size={12} className="text-blue-200" />
//               )}
//             </span>
//           )}

//           <button
//             onClick={() =>
//               onReply({ ...message, senderName: isMe ? "You" : "User" })
//             }
//             className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full ${
//               isMe
//                 ? "hover:bg-white/20 text-white"
//                 : "hover:bg-black/10 text-gray-500"
//             }`}
//             title="Reply"
//           >
//             <Reply size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// ADDED 05 FEB 2026




import React, { useState, useRef, memo } from "react";
import {
  Check,
  CheckCheck,
  Reply,
  Trash2,
  Ban,
  FileText,
  Download,
} from "lucide-react";
import type { Theme } from "../types";

interface MessageBubbleProps {
  message: any;
  theme: Theme;
  onReply: (message: any) => void;
  onReact: (id: string, emoji: string) => void;
  onDelete: (id: string, type: 'for-me' | 'everyone') => void;
  currentUserId?: string;
}

const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "👍"];

// --- HELPER: Safe Time Formatting ---
// Prevents component crash on invalid timestamp
const getFormattedTime = (dateInput: any) => {
  if (!dateInput) return "";
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  } catch (e) {
    return "";
  }
};

const MessageBubble = ({
  message,
  theme,
  onReply,
  onReact,
  onDelete,
  currentUserId,
}: MessageBubbleProps) => {
  const isMe = message.senderId === currentUserId || message.sender === "me";
  const formattedTime = getFormattedTime(message.timestamp);
  
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const pressTimer = useRef<any>(null);

  // --- TOUCH/LONG PRESS LOGIC ---
  const handleStart = () => {
    pressTimer.current = setTimeout(() => {
      setShowMenu(true);
      if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
    }, 500);
  };

  const handleEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setShowDeleteOption(false);
  };

  // --- 1. DELETED MESSAGE STATE ---
  if (message.isDeleted) {
    return (
      <div className={`flex w-full mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
        <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-gray-400 text-xs italic flex items-center gap-2">
          <Ban size={12} /> This message was deleted
        </div>
      </div>
    );
  }

  // --- 2. ACTIVE MESSAGE STATE ---
  return (
    <>
      <div
        className={`flex w-full mb-3 relative group ${isMe ? "justify-end" : "justify-start"}`}
        onContextMenu={(e) => { e.preventDefault(); setShowMenu(true); }}
      >
        <div
          className={`relative max-w-[75%] md:max-w-[60%] shadow-sm text-sm flex flex-col transition-transform active:scale-95 duration-200 ${
            isMe
              ? "bg-indigo-600 text-white rounded-2xl rounded-br-none"
              : "bg-white text-gray-800 rounded-2xl rounded-bl-none border"
          }`}
          style={!isMe ? { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border } : {}}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
        >
          {/* --- A. DESKTOP HOVER REPLY BUTTON --- */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReply(message);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 shadow-sm transform hover:scale-110 ${
              isMe 
                ? "bg-black/20 text-white hover:bg-black/30" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
            }`}
            title="Reply"
          >
            <Reply size={14} />
          </button>

          {/* --- B. REPLY CONTEXT PREVIEW --- */}
          {message.replyTo && (
            <div
              className={`mx-1 mt-1 mb-0 rounded-lg p-2 text-xs border-l-4 flex flex-col ${
                isMe
                  ? "bg-black/20 border-white/60 text-white/90"
                  : "bg-indigo-50 border-indigo-500 text-gray-600"
              }`}
            >
              <span className="font-bold mb-0.5 opacity-90">
                {message.replyTo.senderName || "User"}
              </span>
              <span className="truncate opacity-80">{message.replyTo.text}</span>
            </div>
          )}

          {/* --- C. MESSAGE CONTENT --- */}
          <div className={message.type === 'image' ? "p-1" : "px-3 py-2 pr-8"}>
            {message.type === "image" && message.fileUrl ? (
              <img
                src={message.fileUrl}
                alt="attachment"
                className="rounded-xl w-full h-auto max-h-[300px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
            ) : message.type === "file" && message.fileUrl ? (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isMe ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="p-2 bg-white rounded-full text-indigo-600">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate underline decoration-dotted underline-offset-2">
                    {message.fileName || message.text || "Attachment"}
                  </p>
                  <p className="text-[10px] opacity-70 uppercase">Download</p>
                </div>
                <Download size={16} className="opacity-70" />
              </a>
            ) : (
              <p className="leading-relaxed break-words whitespace-pre-wrap font-normal">
                {message.text}
              </p>
            )}
          </div>

          {/* --- D. FOOTER (Time & Status) --- */}
          <div className={`flex items-center justify-end gap-1 px-3 pb-1.5 select-none mt-auto ${message.type === 'image' ? "px-2 pb-1" : ""}`}>
            <span className={`text-[10px] ${isMe ? "text-indigo-100/80" : "text-gray-400"}`}>
              {formattedTime}
            </span>
            {isMe && (
              <span className="ml-0.5">
                {message.status === "read" ? (
                  <CheckCheck size={14} className="text-cyan-300 drop-shadow-[0_0_3px_rgba(103,232,249,0.8)]" strokeWidth={2.5} />
                ) : message.status === "delivered" ? (
                  <CheckCheck size={14} className="text-indigo-200" strokeWidth={2} />
                ) : (
                  <Check size={14} className="text-indigo-200" strokeWidth={2} />
                )}
              </span>
            )}
          </div>

          {/* --- E. REACTIONS DISPLAY --- */}
          {message.reactions?.length > 0 && (
            <div className={`absolute -bottom-3 ${isMe ? "left-0" : "right-0"} flex bg-white border rounded-full px-1.5 py-0.5 shadow-sm text-xs z-10 scale-90 gap-1`}>
              {message.reactions.map((r: any, i: number) => (
                <span key={i} className="animate-in zoom-in duration-300">{r.emoji}</span>
              ))}
            </div>
          )}
        </div>

        {/* --- 3. LONG PRESS / CONTEXT MENU --- */}
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={closeMenu} />
            <div 
              className={`absolute top-full mt-2 ${isMe ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} z-50 bg-white rounded-xl shadow-xl border p-2 flex flex-col gap-2 min-w-[180px] animate-in fade-in zoom-in-95 duration-200`}
            >
              {/* Quick Reactions */}
              <div className="flex justify-between bg-gray-50 rounded-lg p-1.5">
                {QUICK_REACTIONS.map(emoji => (
                  <button key={emoji} onClick={() => { onReact(message.id, emoji); closeMenu(); }} className="hover:scale-125 transition text-lg w-8 h-8 flex items-center justify-center">
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                {/* Reply Option (Essential for Mobile users who can't hover) */}
                <button onClick={() => { onReply(message); closeMenu(); }} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-gray-700 rounded-lg text-sm w-full text-left font-medium transition-colors">
                  <Reply size={16} /> Reply
                </button>
                
                {/* Delete Option */}
                {isMe && (
                  <button onClick={() => setShowDeleteOption(true)} className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm w-full text-left font-medium transition-colors">
                    <Trash2 size={16} /> Delete
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* --- 4. DELETE CONFIRMATION MODAL --- */}
        {showDeleteOption && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="font-bold text-center text-lg mb-2 text-gray-900">Delete Message?</h3>
              <p className="text-center text-gray-500 text-sm mb-6">Select who you want to delete this message for.</p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { onDelete(message.id, 'everyone'); closeMenu(); }}
                  className="w-full py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                >
                  Delete for Everyone
                </button>
                <button 
                  onClick={() => { onDelete(message.id, 'for-me'); closeMenu(); }}
                  className="w-full py-3.5 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Delete for Me
                </button>
                <button 
                  onClick={() => setShowDeleteOption(false)}
                  className="w-full py-3 text-gray-400 font-medium hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Optimizes performance for long chat lists
export default memo(MessageBubble);