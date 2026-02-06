// import { X, Phone, Video, MessageSquare, Info } from "lucide-react";
// import type { Theme, User } from "../types";

// interface ProfilePopupProps {
//   contact: User;
//   onClose: () => void;
//   onCall: (type: "audio" | "video") => void;
//   onMessage: () => void;
//   onViewDetails: () => void;
//   theme: Theme;
// }

// export default function ProfilePopup({
//   contact,
//   onClose,
//   onCall,
//   onMessage,
//   onViewDetails,
//   theme,
// }: ProfilePopupProps) {
//   return (
//     <div
//       className="fixed inset-0 z-[70] flex items-center justify-start p-4 md:pl-20 bg-black/30 backdrop-blur-[1px] animate-in fade-in duration-200"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-64 rounded-2xl overflow-hidden shadow-2xl transform transition-all animate-in slide-in-from-left-8 zoom-in-95 duration-200 ring-1 ring-white/20"
//         onClick={(e) => e.stopPropagation()}
//         style={{ backgroundColor: theme.bg }}
//       >
//         {/* Minimal Header */}
//         <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
//           <button
//             onClick={onViewDetails} // <--- INFO ICON
//             className="absolute top-2 left-2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
//             title="View Full Details"
//           >
//             <Info size={14} />
//           </button>
//           <button
//             onClick={onClose}
//             className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
//           >
//             <X size={14} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="px-5 pb-5 relative text-center">
//           {/* Centered Avatar */}
//           <div className="-mt-10 mb-2 flex justify-center">
//             <div className="relative">
//               <img
//                 src={contact.avatar}
//                 alt={contact.name}
//                 className="w-20 h-20 rounded-full border-[4px] object-cover shadow-md"
//                 style={{ borderColor: theme.bg }}
//               />
//               <span
//                 className={`absolute bottom-1 right-0 w-4 h-4 rounded-full border-2 ${
//                   contact.status === "online" ? "bg-green-500" : "bg-gray-400"
//                 }`}
//                 style={{ borderColor: theme.bg }}
//               ></span>
//             </div>
//           </div>

//           {/* Name */}
//           <div className="mb-4">
//             <h2
//               className="text-lg font-bold truncate"
//               style={{ color: theme.textMain }}
//             >
//               {contact.name}
//             </h2>
//             <p className="text-xs opacity-60" style={{ color: theme.textSec }}>
//               {contact.status}
//             </p>
//           </div>

//           {/* Functional Buttons */}
//           <div className="flex gap-2 justify-center">
//             <button
//               onClick={() => onCall("audio")}
//               className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm"
//               title="Audio Call"
//             >
//               <Phone size={18} />
//             </button>
//             <button
//               onClick={() => onCall("video")}
//               className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm"
//               title="Video Call"
//             >
//               <Video size={18} />
//             </button>
//             <button
//               onClick={onMessage}
//               className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg shadow-indigo-200"
//               title="Message"
//             >
//               <MessageSquare size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// DATE 05 FEB 2026

import { X, MessageSquare, Phone, Video, User as UserIcon } from "lucide-react";
import type { Theme, User } from "../types";

interface ProfilePopupProps {
  contact: User;
  theme: Theme;
  onClose: () => void;
  // [FIX] Added missing props matched in App.tsx
  onViewProfile: (contact: User) => void;
  onMessage: () => void;
  onCall: (type: "audio" | "video") => void;
}

export default function ProfilePopup({ 
  contact, 
  theme, 
  onClose, 
  onViewProfile, 
  onMessage, 
  onCall 
}: ProfilePopupProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-72 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ backgroundColor: theme.bg, color: theme.textMain }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover */}
        <div className="h-20 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-5 pb-5 relative">
          <div className="relative -mt-10 mb-3 flex justify-center">
            <img 
              src={contact.avatar} 
              alt={contact.name} 
              className="w-20 h-20 rounded-full border-4 object-cover shadow-md"
              style={{ borderColor: theme.bg }}
            />
            {contact.status === "online" && (
              <div className="absolute bottom-1 right-24 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-bold">{contact.name}</h2>
            <p className="text-xs opacity-70 truncate max-w-[200px] mx-auto">
              {contact.about || contact.status}
            </p>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-4 gap-2">
            <ActionBtn icon={<MessageSquare size={18} />} label="Chat" color="text-indigo-600" bg="bg-indigo-50" onClick={onMessage} />
            <ActionBtn icon={<Phone size={18} />} label="Audio" color="text-green-600" bg="bg-green-50" onClick={() => onCall("audio")} />
            <ActionBtn icon={<Video size={18} />} label="Video" color="text-purple-600" bg="bg-purple-50" onClick={() => onCall("video")} />
            <ActionBtn icon={<UserIcon size={18} />} label="Profile" color="text-gray-600" bg="bg-gray-100" onClick={() => onViewProfile(contact)} />
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionBtn = ({ icon, label, color, bg, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-transform hover:scale-105 ${color} ${bg}`}
  >
    <div className="p-1.5 rounded-full bg-white/50">{icon}</div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);