// import React, { useState, useEffect, useRef } from "react";
// import {
//   X,
//   Phone,
//   Info,
//   Save,
//   Camera,
//   Pencil,
//   Check,
//   Trash2,
//   Bell,
//   Ban,
//   Heart,
//   BellOff,
// } from "lucide-react";
// import type { Theme, User } from "../types";
// import { CURRENT_USER_ID, DEFAULT_AVATAR } from "../constants";

// // --- Sub-Component: Mute Menu ---
// const MuteDurationMenu = ({
//   onClose,
//   onConfirm,
//   theme,
// }: {
//   onClose: () => void;
//   onConfirm: (label: string) => void;
//   theme: Theme;
// }) => {
//   const options = [
//     { label: "7 Hours", value: "7h" },
//     { label: "24 Hours", value: "24h" },
//     { label: "7 Days", value: "7d" },
//     { label: "Always", value: "always" },
//   ];

//   return (
//     <div
//       className="absolute top-16 left-1/2 transform -translate-x-1/2 w-48 z-50 bg-white shadow-xl rounded-xl p-2 border animate-in fade-in zoom-in-95"
//       style={{ backgroundColor: theme.bg, borderColor: theme.border }}
//     >
//       <h3 className="text-xs font-bold px-2 py-1 mb-1 opacity-50 uppercase">
//         Mute Duration
//       </h3>
//       {options.map((opt) => (
//         <button
//           key={opt.value}
//           onClick={() => onConfirm(opt.label)}
//           className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium flex justify-between"
//           style={{ color: theme.textMain }}
//         >
//           {opt.label}
//         </button>
//       ))}
//       <div className="h-px bg-gray-100 my-1"></div>
//       <button
//         onClick={onClose}
//         className="w-full text-center py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600"
//       >
//         CANCEL
//       </button>
//     </div>
//   );
// };

// interface ProfilePanelProps {
//   contact: User & { isFavorite?: boolean };
//   onClose: () => void;
//   theme: Theme;
//   onUpdate: (updatedUser: User) => void;
// }

// export default function ProfilePanel({
//   contact,
//   onClose,
//   theme,
//   onUpdate,
// }: ProfilePanelProps) {
//   const isMe = contact.id === CURRENT_USER_ID;
//   const [isEditing, setIsEditing] = useState(false);
//   const [isRenaming, setIsRenaming] = useState(false);
//   const [showMuteMenu, setShowMuteMenu] = useState(false); // Local state for popup

//   const [editedName, setEditedName] = useState(contact.name);
//   const [formData, setFormData] = useState({
//     phone: contact.phone || "",
//     about: contact.about || "",
//   });
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     setEditedName(contact.name);
//     setFormData({ phone: contact.phone || "", about: contact.about || "" });
//     setIsEditing(false);
//     setIsRenaming(false);
//     setShowMuteMenu(false);
//   }, [contact]);

//   const handleSaveProfile = () => {
//     onUpdate({ ...contact, ...formData });
//     setIsEditing(false);
//   };

//   const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && isMe) {
//       onUpdate({ ...contact, avatar: URL.createObjectURL(file) });
//     }
//   };

//   // --- FUNCTIONAL ACTIONS ---
//   const toggleMute = () => {
//     if (contact.muted) {
//       onUpdate({ ...contact, muted: false });
//     } else {
//       setShowMuteMenu(!showMuteMenu);
//     }
//   };

//   const confirmMute = () => {
//     onUpdate({ ...contact, muted: true });
//     setShowMuteMenu(false);
//   };

//   const toggleFavorite = () => {
//     // @ts-ignore
//     onUpdate({ ...contact, isFavorite: !contact.isFavorite });
//   };

//   const toggleBlock = () => {
//     onUpdate({ ...contact, blocked: !contact.blocked });
//   };

//   return (
//     <div
//       className="h-full w-full md:w-96 border-l z-20 animate-in slide-in-from-right overflow-y-auto custom-scrollbar flex flex-col relative"
//       style={{ backgroundColor: theme.bg, borderColor: theme.border }}
//     >
//       {/* Header Image & Close Button */}
//       <div className="h-40 relative flex-shrink-0 bg-indigo-500">
//         <div className="absolute inset-0 bg-black/30"></div>
//         <img
//           src={contact.avatar}
//           className="w-full h-full object-cover opacity-60 blur-sm"
//           alt="bg"
//         />
//         <div className="absolute top-0 left-0 right-0 h-14 flex items-center px-4">
//           <button
//             onClick={onClose}
//             className="p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors backdrop-blur-sm flex items-center gap-2 text-sm font-medium"
//           >
//             <X size={18} /> Close
//           </button>
//         </div>
//       </div>

//       {/* Profile Picture */}
//       <div className="px-6 relative flex-1">
//         <div className="relative w-32 h-32 -top-16 mx-auto">
//           <div
//             className="w-32 h-32 rounded-full border-[6px] shadow-2xl overflow-hidden relative group"
//             style={{ borderColor: theme.bg, backgroundColor: theme.bg }}
//           >
//             <img
//               src={contact.avatar}
//               className="w-full h-full object-cover"
//               alt="profile"
//             />
//             {isMe && (
//               <div
//                 className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Camera size={24} className="text-white" />
//                 <span className="text-xs text-white font-bold mt-1">
//                   CHANGE
//                 </span>
//               </div>
//             )}
//           </div>
//           {isMe && contact.avatar !== DEFAULT_AVATAR && (
//             <button
//               onClick={() => onUpdate({ ...contact, avatar: DEFAULT_AVATAR })}
//               className="absolute bottom-1 right-1 p-2 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-transform active:scale-90"
//             >
//               <Trash2 size={14} />
//             </button>
//           )}
//           <input
//             type="file"
//             ref={fileInputRef}
//             className="hidden"
//             accept="image/*"
//             onChange={handleAvatarUpload}
//           />
//         </div>

//         <div className="-mt-12 text-center">
//           {/* Name Section */}
//           <div className="flex items-center justify-center gap-2 mb-1">
//             {isRenaming && !isMe ? (
//               <div className="flex items-center gap-2 justify-center">
//                 <input
//                   autoFocus
//                   type="text"
//                   value={editedName}
//                   onChange={(e) => setEditedName(e.target.value)}
//                   className="border-b-2 border-indigo-500 outline-none bg-transparent font-bold text-2xl py-1 text-center"
//                   style={{ color: theme.textMain }}
//                 />
//                 <button
//                   onClick={() => {
//                     if (editedName.trim()) {
//                       onUpdate({ ...contact, name: editedName });
//                       setIsRenaming(false);
//                     }
//                   }}
//                   className="text-green-500 bg-green-50 p-1.5 rounded-full hover:bg-green-100"
//                 >
//                   <Check size={18} />
//                 </button>
//                 <button
//                   onClick={() => {
//                     setIsRenaming(false);
//                     setEditedName(contact.name);
//                   }}
//                   className="text-red-500 bg-red-50 p-1.5 rounded-full hover:bg-red-100"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <h2
//                   className="text-2xl font-bold"
//                   style={{ color: theme.textMain }}
//                 >
//                   {contact.name}
//                 </h2>
//                 {!isMe && (
//                   <button
//                     onClick={() => setIsRenaming(true)}
//                     className="text-gray-400 hover:text-indigo-500 p-1 opacity-50 hover:opacity-100"
//                   >
//                     <Pencil size={16} />
//                   </button>
//                 )}
//               </>
//             )}
//           </div>

//           <p
//             className="text-sm font-medium mb-8"
//             style={{ color: theme.textSec }}
//           >
//             {isMe ? (
//               <span className="text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
//                 It's you
//               </span>
//             ) : contact.status === "online" ? (
//               <span className="text-green-500 flex items-center justify-center gap-1">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>Online
//               </span>
//             ) : (
//               `Last seen ${contact.lastSeen}`
//             )}
//           </p>

//           {/* --- FUNCTIONAL BUTTONS --- */}
//           {!isMe && (
//             <div
//               className="flex justify-center gap-4 mb-8 pb-8 border-b relative"
//               style={{ borderColor: theme.border }}
//             >
//               {/* Mute Button */}
//               <div className="relative">
//                 <button
//                   onClick={toggleMute}
//                   className="flex flex-col items-center gap-2 group transition-colors"
//                 >
//                   <div
//                     className={`p-3 rounded-full transition-colors ${
//                       contact.muted
//                         ? "bg-indigo-100 text-indigo-600"
//                         : "bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-500"
//                     }`}
//                   >
//                     {contact.muted ? <BellOff size={20} /> : <Bell size={20} />}
//                   </div>
//                   <span
//                     className={`text-xs font-medium ${
//                       contact.muted ? "text-indigo-600" : "text-gray-500"
//                     }`}
//                   >
//                     {contact.muted ? "Unmute" : "Mute"}
//                   </span>
//                 </button>
//                 {/* Mute Dropdown */}
//                 {showMuteMenu && (
//                   <MuteDurationMenu
//                     onClose={() => setShowMuteMenu(false)}
//                     onConfirm={confirmMute}
//                     theme={theme}
//                   />
//                 )}
//               </div>

//               {/* Favorite Button */}
//               <button
//                 onClick={toggleFavorite}
//                 className="flex flex-col items-center gap-2 group transition-colors"
//               >
//                 <div
//                   className={`p-3 rounded-full transition-colors ${
//                     contact.isFavorite
//                       ? "bg-pink-100 text-pink-600"
//                       : "bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-600"
//                   }`}
//                 >
//                   <Heart
//                     size={20}
//                     fill={contact.isFavorite ? "currentColor" : "none"}
//                   />
//                 </div>
//                 <span
//                   className={`text-xs font-medium ${
//                     contact.isFavorite ? "text-pink-600" : "text-gray-500"
//                   }`}
//                 >
//                   Favorite
//                 </span>
//               </button>

//               {/* Block Button */}
//               <button
//                 onClick={toggleBlock}
//                 className="flex flex-col items-center gap-2 group transition-colors"
//               >
//                 <div
//                   className={`p-3 rounded-full transition-colors ${
//                     contact.blocked
//                       ? "bg-red-100 text-red-600"
//                       : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600"
//                   }`}
//                 >
//                   <Ban size={20} />
//                 </div>
//                 <span
//                   className={`text-xs font-medium ${
//                     contact.blocked ? "text-red-600" : "text-gray-500"
//                   }`}
//                 >
//                   {contact.blocked ? "Unblock" : "Block"}
//                 </span>
//               </button>
//             </div>
//           )}

//           {/* Info Fields */}
//           <div className="space-y-6 text-left px-2">
//             <div className="flex items-start gap-4">
//               <Info size={20} className="mt-1 text-gray-400" />
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 font-medium mb-1">About</p>
//                 {isEditing && isMe ? (
//                   <textarea
//                     rows={3}
//                     value={formData.about}
//                     onChange={(e) =>
//                       setFormData({ ...formData, about: e.target.value })
//                     }
//                     className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
//                     style={{
//                       color: theme.textMain,
//                       backgroundColor: theme.inputBg,
//                     }}
//                   />
//                 ) : (
//                   <p
//                     className="text-base leading-relaxed whitespace-pre-wrap"
//                     style={{ color: theme.textMain }}
//                   >
//                     {contact.about || "No info available"}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-start gap-4">
//               <Phone size={20} className="mt-1 text-gray-400" />
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500 font-medium mb-1">Phone</p>
//                 {isEditing && isMe ? (
//                   <input
//                     value={formData.phone}
//                     onChange={(e) =>
//                       setFormData({ ...formData, phone: e.target.value })
//                     }
//                     className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
//                     style={{
//                       color: theme.textMain,
//                       backgroundColor: theme.inputBg,
//                     }}
//                   />
//                 ) : (
//                   <p className="text-base" style={{ color: theme.textMain }}>
//                     {contact.phone || "No phone number"}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons for "Me" */}
//           {isMe && (
//             <div className="mt-10 mb-6 px-2">
//               {isEditing ? (
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleSaveProfile}
//                     className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
//                   >
//                     <Save size={18} /> Save
//                   </button>
//                   <button
//                     onClick={() => {
//                       setIsEditing(false);
//                       setFormData({
//                         phone: contact.phone || "",
//                         about: contact.about || "",
//                       });
//                     }}
//                     className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors border-2 border-indigo-100"
//                 >
//                   Edit Profile Details
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// ADDED DATE 05 FEB 2026



import { useState, useEffect } from "react";
import { X, Phone, Mail, Save, User } from "lucide-react";
import type { Theme, User as UserType } from "../types";

// [FIX] Updated Interface to match App.tsx usage
interface ProfilePanelProps {
  contact: UserType | null;
  isOpen: boolean; 
  onClose: () => void;
  theme: Theme;
  onUpdateContact: (updatedContact: UserType) => void;
}

export default function ProfilePanel({ 
  contact, 
  isOpen, 
  onClose, 
  theme, 
  onUpdateContact 
}: ProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", bio: "", phone: "" });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        bio: contact.about || "", // Mapping 'about' to bio field
        phone: contact.phone || "",
      });
    }
  }, [contact]);

  if (!contact) return null;

  const handleSave = () => {
    onUpdateContact({ 
      ...contact, 
      name: formData.name,
      about: formData.bio,
      phone: formData.phone 
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`absolute inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ backgroundColor: theme.bg, color: theme.textMain, borderLeft: `1px solid ${theme.border}` }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0" style={{ borderColor: theme.border }}>
        <h2 className="font-bold text-lg">Profile Info</h2>
        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-32 h-32 rounded-full object-cover border-4 shadow-md"
              style={{ borderColor: theme.bg }}
            />
            {/* Online Indicator */}
            {contact.status === "online" && (
              <div className="absolute bottom-1 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          {!isEditing ? (
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold">{contact.name}</h2>
              <p className="text-sm opacity-60 mt-1">{contact.status}</p>
            </div>
          ) : (
            <input 
              className="mt-4 text-center text-2xl font-bold w-full bg-transparent border-b-2 border-indigo-500 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          {/* Bio / About */}
          <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
            <div className="flex items-center gap-2 mb-2 opacity-60">
              <User size={16} />
              <span className="text-xs font-bold uppercase">About</span>
            </div>
            {!isEditing ? (
              <p className="text-sm leading-relaxed">{contact.about || "No info available."}</p>
            ) : (
              <textarea 
                className="w-full bg-transparent border-none focus:outline-none text-sm resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={3}
              />
            )}
          </div>

          {/* Contact Details */}
          <div className="p-4 rounded-2xl border space-y-4" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
            <div className="flex items-center gap-3">
              <Mail size={18} className="opacity-50" />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold uppercase opacity-50 mb-0.5">Email</p>
                <p className="text-sm truncate" title={contact.email}>{contact.email || "Hidden"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone size={18} className="opacity-50" />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase opacity-50 mb-0.5">Phone</p>
                {!isEditing ? (
                  <p className="text-sm">{contact.phone || "N/A"}</p>
                ) : (
                  <input 
                    className="w-full bg-transparent border-b border-indigo-300 focus:outline-none text-sm"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8">
          {isEditing ? (
            <div className="flex gap-3">
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
              >
                <Save size={18} /> Save
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            // Only allow editing if it's the current user (Optional logic)
            // For now, allowing edits to demonstrate functionality
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Edit Contact Info
            </button>
          )}
        </div>
      </div>
    </div>
  );
}