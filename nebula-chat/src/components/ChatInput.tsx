// import React, { useState, useRef, useEffect } from "react";
// import { Smile, Paperclip, Send, Mic, X, Sparkles, Reply } from "lucide-react"; // <--- Added Reply icon
// import { EMOJIS } from "../constants";
// import type { Theme } from "../types";

// interface ChatInputProps {
//   onSend: (text: string, type?: string) => void;
//   theme: Theme;
//   text: string;
//   setText: (s: string) => void;
//   replyingTo: any;
//   cancelReply: () => void;
//   smartReplies: string[];
// }

// export default function ChatInput({
//   onSend,
//   theme,
//   text,
//   setText,
//   replyingTo,
//   cancelReply,
//   smartReplies,
// }: ChatInputProps) {
//   const [showEmojis, setShowEmojis] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (replyingTo) {
//       inputRef.current?.focus();
//     }
//   }, [replyingTo]);

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (text.trim()) {
//         onSend(text);
//         setShowEmojis(false);
//       }
//     }
//     if ((e.ctrlKey || e.metaKey) && e.key === "e") {
//       e.preventDefault();
//       setShowEmojis((prev) => !prev);
//     }
//   };

//   const handleEmojiClick = (emoji: string) => {
//     setText(text + emoji);
//     inputRef.current?.focus();
//   };

//   return (
//     <div
//       className="px-4 py-4 relative border-t"
//       style={{ backgroundColor: theme.header, borderColor: theme.border }}
//     >
//       {/* --- UPDATED REPLY CONTEXT --- */}
//       {replyingTo && (
//         <div className="flex items-center gap-3 p-3 mb-3 bg-gray-100/80 rounded-2xl border border-indigo-100 shadow-sm animate-in slide-in-from-bottom-2 backdrop-blur-sm">
//           {/* Big Reply Icon */}
//           <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
//             <Reply size={20} />
//           </div>

//           {/* Reply Text Details */}
//           <div className="flex-1 min-w-0 border-l-4 border-indigo-500 pl-3 py-1">
//             <p className="font-bold text-sm text-indigo-600 mb-0.5">
//               Replying to {replyingTo.senderName}
//             </p>
//             <p className="truncate text-sm text-gray-600">{replyingTo.text}</p>
//           </div>

//           {/* Prominent Cross (Cancel) Button */}
//           <button
//             onClick={cancelReply}
//             className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-red-500 transition-colors"
//             title="Cancel Reply"
//           >
//             <X size={22} />
//           </button>
//         </div>
//       )}
//       {/* ----------------------------- */}

//       {/* Smart Replies (Hidden Scrollbar) */}
//       {smartReplies.length > 0 && !text && (
//         <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar pb-1">
//           {smartReplies.map((r, i) => (
//             <button
//               key={i}
//               onClick={() => onSend(r)}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100 shadow-sm"
//             >
//               <Sparkles size={12} /> {r}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Emoji Picker */}
//       {showEmojis && (
//         <div
//           className="absolute bottom-20 left-4 bg-white shadow-xl rounded-2xl border w-64 h-64 overflow-y-auto grid grid-cols-6 p-2 z-50 animate-in zoom-in-95"
//           style={{ borderColor: theme.border }}
//         >
//           {EMOJIS.map((e) => (
//             <button
//               key={e}
//               onClick={() => handleEmojiClick(e)}
//               className="p-2 hover:bg-gray-100 rounded text-xl transition-colors"
//             >
//               {e}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Input Bar */}
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={() => setShowEmojis(!showEmojis)}
//           className={`p-2 rounded-full transition-colors ${
//             showEmojis
//               ? "bg-indigo-100 text-indigo-600"
//               : "text-gray-500 hover:bg-gray-100"
//           }`}
//           title="Emojis (Ctrl+E)"
//         >
//           <Smile size={24} />
//         </button>

//         <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
//           <Paperclip size={24} />
//         </button>

//         <input
//           ref={inputRef}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a message..."
//           className="flex-1 px-4 py-2 rounded-full border-none focus:ring-2 bg-gray-100 transition-all"
//           style={{ backgroundColor: theme.inputBg, color: theme.textMain }}
//         />

//         {text ? (
//           <button
//             onClick={() => onSend(text)}
//             className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors transform active:scale-90"
//           >
//             <Send size={20} />
//           </button>
//         ) : (
//           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
//             <Mic size={24} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState, useRef, useEffect } from "react";
// import { Smile, Paperclip, Send, Mic, X, Sparkles, Reply } from "lucide-react";
// import { EMOJIS } from "../constants";
// import type { Theme } from "../types";

// interface ChatInputProps {
//   onSend: (text: string, type?: string) => void;
//   onFileUpload: (file: File) => void; // [FIX] Added prop
//   theme: Theme;
//   text: string;
//   setText: (s: string) => void;
//   replyingTo: any;
//   cancelReply: () => void;
//   smartReplies: string[];
// }

// export default function ChatInput({
//   onSend,
//   onFileUpload,
//   theme,
//   text,
//   setText,
//   replyingTo,
//   cancelReply,
//   smartReplies,
// }: ChatInputProps) {
//   const [showEmojis, setShowEmojis] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null); // [FIX] Added ref

//   useEffect(() => {
//     if (replyingTo) {
//       inputRef.current?.focus();
//     }
//   }, [replyingTo]);

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (text.trim()) {
//         onSend(text);
//         setShowEmojis(false);
//       }
//     }
//     if ((e.ctrlKey || e.metaKey) && e.key === "e") {
//       e.preventDefault();
//       setShowEmojis((prev) => !prev);
//     }
//   };

//   const handleEmojiClick = (emoji: string) => {
//     setText(text + emoji);
//     inputRef.current?.focus();
//   };

//   // [FIX] Handler for file selection
//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       onFileUpload(e.target.files[0]);
//     }
//   };

//   return (
//     <div
//       className="px-4 py-4 relative border-t"
//       style={{ backgroundColor: theme.header, borderColor: theme.border }}
//     >
//       {/* --- UPDATED REPLY CONTEXT --- */}
//       {replyingTo && (
//         <div className="flex items-center gap-3 p-3 mb-3 bg-gray-100/80 rounded-2xl border border-indigo-100 shadow-sm animate-in slide-in-from-bottom-2 backdrop-blur-sm">
//           <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
//             <Reply size={20} />
//           </div>
//           <div className="flex-1 min-w-0 border-l-4 border-indigo-500 pl-3 py-1">
//             <p className="font-bold text-sm text-indigo-600 mb-0.5">
//               Replying to {replyingTo.senderName}
//             </p>
//             <p className="truncate text-sm text-gray-600">{replyingTo.text}</p>
//           </div>
//           <button
//             onClick={cancelReply}
//             className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-red-500 transition-colors"
//             title="Cancel Reply"
//           >
//             <X size={22} />
//           </button>
//         </div>
//       )}

//       {/* Smart Replies */}
//       {smartReplies.length > 0 && !text && (
//         <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar pb-1">
//           {smartReplies.map((r, i) => (
//             <button
//               key={i}
//               onClick={() => onSend(r)}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100 shadow-sm"
//             >
//               <Sparkles size={12} /> {r}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Emoji Picker */}
//       {showEmojis && (
//         <div
//           className="absolute bottom-20 left-4 bg-white shadow-xl rounded-2xl border w-64 h-64 overflow-y-auto grid grid-cols-6 p-2 z-50 animate-in zoom-in-95"
//           style={{ borderColor: theme.border }}
//         >
//           {EMOJIS.map((e) => (
//             <button
//               key={e}
//               onClick={() => handleEmojiClick(e)}
//               className="p-2 hover:bg-gray-100 rounded text-xl transition-colors"
//             >
//               {e}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* [FIX] Hidden File Input */}
//       <input 
//         type="file" 
//         ref={fileInputRef} 
//         className="hidden" 
//         onChange={handleFileSelect} 
//       />

//       {/* Input Bar */}
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={() => setShowEmojis(!showEmojis)}
//           className={`p-2 rounded-full transition-colors ${
//             showEmojis
//               ? "bg-indigo-100 text-indigo-600"
//               : "text-gray-500 hover:bg-gray-100"
//           }`}
//           title="Emojis (Ctrl+E)"
//         >
//           <Smile size={24} />
//         </button>

//         {/* [FIX] Connected Button */}
//         <button 
//           onClick={() => fileInputRef.current?.click()}
//           className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
//         >
//           <Paperclip size={24} />
//         </button>

//         <input
//           ref={inputRef}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a message..."
//           className="flex-1 px-4 py-2 rounded-full border-none focus:ring-2 bg-gray-100 transition-all"
//           style={{ backgroundColor: theme.inputBg, color: theme.textMain }}
//         />

//         {text ? (
//           <button
//             onClick={() => onSend(text)}
//             className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors transform active:scale-90"
//           >
//             <Send size={20} />
//           </button>
//         ) : (
//           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
//             <Mic size={24} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }




// ADDED 05 FEB 2026


import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, Mic, X, Sparkles, Reply } from "lucide-react";
import { EMOJIS } from "../constants";
import type { Theme } from "../types";

interface ChatInputProps {
  onSend: (text: string, type?: string) => void;
  onFileUpload: (file: File) => void;
  onTyping: (isTyping: boolean) => void; // Added from Code 1
  theme: Theme;
  text: string;
  setText: (s: string) => void;
  replyingTo: any;
  setReplyingTo: (msg: any) => void;
  smartReplies: string[];
}

export default function ChatInput({
  onSend,
  onFileUpload,
  onTyping,
  theme,
  text,
  setText,
  replyingTo,
  setReplyingTo,
  smartReplies,
}: ChatInputProps) {
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when replying
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  // Handle Sending
  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      onTyping(false); // Stop typing indicator immediately
      setShowEmojis(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shortcut for Emojis
    if ((e.ctrlKey || e.metaKey) && e.key === "e") {
      e.preventDefault();
      setShowEmojis((prev) => !prev);
    }
  };

  // Handle Text Change (with typing logic)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  const handleEmojiClick = (emoji: string) => {
    const newText = text + emoji;
    setText(newText);
    onTyping(true); // Emojis count as typing
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className="px-4 py-4 relative border-t z-20"
      style={{ backgroundColor: theme.header, borderColor: theme.border }}
    >
      {/* --- REPLY CONTEXT --- */}
      {replyingTo && (
        <div className="flex items-center gap-3 p-3 mb-3 bg-gray-100/80 rounded-2xl border border-indigo-100 shadow-sm animate-in slide-in-from-bottom-2 backdrop-blur-sm">
          <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
            <Reply size={20} />
          </div>
          <div className="flex-1 min-w-0 border-l-4 border-indigo-500 pl-3 py-1">
            <p className="font-bold text-sm text-indigo-600 mb-0.5">
              Replying to {replyingTo.senderName}
            </p>
            <p className="truncate text-sm text-gray-600">{replyingTo.text}</p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-red-500 transition-colors"
            title="Cancel Reply"
          >
            <X size={22} />
          </button>
        </div>
      )}

      {/* --- SMART REPLIES --- */}
      {smartReplies.length > 0 && !text && (
        <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar pb-1">
          {smartReplies.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                onSend(r);
                onTyping(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors whitespace-nowrap border border-indigo-100 shadow-sm"
            >
              <Sparkles size={12} /> {r}
            </button>
          ))}
        </div>
      )}

      {/* --- EMOJI PICKER --- */}
      {showEmojis && (
        <div
          className="absolute bottom-20 left-4 bg-white shadow-xl rounded-2xl border w-64 h-64 overflow-y-auto grid grid-cols-6 p-2 z-50 animate-in zoom-in-95"
          style={{ borderColor: theme.border }}
        >
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => handleEmojiClick(e)}
              className="p-2 hover:bg-gray-100 rounded text-xl transition-colors"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* --- INPUT BAR --- */}
      <div className="flex items-center space-x-2">
        {/* Emoji Button */}
        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className={`p-2 rounded-full transition-colors ${
            showEmojis
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-500 hover:bg-gray-100"
          }`}
          title="Emojis (Ctrl+E)"
        >
          <Smile size={24} />
        </button>

        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Paperclip size={24} />
        </button>

        {/* Text Input */}
        <input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border-none focus:ring-2 bg-gray-100 transition-all outline-none"
          style={{ backgroundColor: theme.inputBg, color: theme.textMain }}
        />

        {/* Send / Mic Button */}
        {text.trim() ? (
          <button
            onClick={handleSend}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors transform active:scale-90 shadow-md"
          >
            <Send size={20} />
          </button>
        ) : (
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Mic size={24} />
          </button>
        )}
      </div>
    </div>
  );
}