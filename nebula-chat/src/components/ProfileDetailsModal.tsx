// import React, { useState, useRef, useEffect } from 'react';
// import { X, Phone, Info, Mail,  Camera, Pencil, Check, Ban, Bell, Heart, BellOff, Clock } from 'lucide-react';
// import type { Theme, User } from '../types';
// import { CURRENT_USER_ID } from '../constants';

// const MuteDurationModal = ({ onClose, onConfirm, theme }: { onClose: () => void, onConfirm: (label: string) => void, theme: Theme }) => {
//   const options = [
//     { label: '7 Hours', value: '7h' },
//     { label: '24 Hours', value: '24h' },
//     { label: '7 Days', value: '7d' },
//     { label: '30 Days', value: '30d' },
//     { label: 'Always', value: 'always' }
//   ];

//   return (
//     <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-3xl animate-in fade-in">
//        <div className="bg-white rounded-2xl w-64 p-4 shadow-2xl" onClick={e => e.stopPropagation()} style={{ backgroundColor: theme.bg }}>
//           <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: theme.textMain }}>
//             <Clock size={16} /> Mute for...
//           </h3>
//           <div className="space-y-1">
//             {options.map((opt) => (
//               <button 
//                 key={opt.value} 
//                 onClick={() => onConfirm(opt.label)} 
//                 className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium" 
//                 style={{ color: theme.textMain, backgroundColor: theme.inputBg }}
//               >
//                 {opt.label}
//               </button>
//             ))}
//           </div>
//           <button onClick={onClose} className="w-full mt-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wide">Cancel</button>
//        </div>
//     </div>
//   );
// };

// interface ProfileDetailsModalProps {
//   contact: User & { isFavorite?: boolean };
//   onClose: () => void;
//   theme: Theme;
//   onUpdate: (updatedUser: User) => void;
// }

// export default function ProfileDetailsModal({ contact, onClose, theme, onUpdate }: ProfileDetailsModalProps) {
//   const isMe = contact.id === CURRENT_USER_ID;
//   const [isEditing, setIsEditing] = useState(false);
//   const [isRenaming, setIsRenaming] = useState(false);
//   const [showMuteMenu, setShowMuteMenu] = useState(false);
  
//   const [editedName, setEditedName] = useState(contact.name);
//   const [formData, setFormData] = useState({ phone: contact.phone || '', about: contact.about || '' });
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     setEditedName(contact.name);
//     setFormData({ phone: contact.phone || '', about: contact.about || '' });
//   }, [contact]);

//   const handleSave = () => {
//     onUpdate({ ...contact, ...formData });
//     setIsEditing(false);
//   };

//   const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0] && isMe) {
//       // In a real app, upload this file to server. Here we assume URL.createObjectURL for preview.
//       // Ideally, you should use the same upload logic as SettingsModal
//       onUpdate({ ...contact, avatar: URL.createObjectURL(e.target.files[0]) });
//     }
//   };

//   const toggleMute = () => {
//     if (contact.muted) {
//       onUpdate({ ...contact, muted: false });
//     } else {
//       setShowMuteMenu(true);
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
//     <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
//       <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()} style={{ backgroundColor: theme.bg }}>
         
//          {showMuteMenu && <MuteDurationModal onClose={() => setShowMuteMenu(false)} onConfirm={confirmMute} theme={theme} />}

//          <div className="h-32 bg-indigo-600 relative">
//              <div className="absolute inset-0 bg-black/20"></div>
//              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"><X size={20} /></button>
//          </div>

//          <div className="px-8 pb-8 relative">
//             <div className="relative w-32 h-32 -top-16 mx-auto">
//                <div className="w-32 h-32 rounded-full border-[6px] shadow-lg overflow-hidden relative group" style={{ borderColor: theme.bg, backgroundColor: theme.bg }}>
//                   <img src={contact.avatar} className="w-full h-full object-cover" alt="profile" />
//                   {isMe && (
//                     <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
//                         <Camera size={24} className="text-white" />
//                         <span className="text-[10px] text-white font-bold mt-1">CHANGE</span>
//                     </div>
//                   )}
//                </div>
//                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
//             </div>

//             <div className="-mt-12 text-center">
//                <div className="flex items-center justify-center gap-2 mb-1">
//                  {isRenaming && !isMe ? (
//                    <div className="flex items-center gap-2">
//                      <input autoFocus value={editedName} onChange={(e) => setEditedName(e.target.value)} className="border-b-2 border-indigo-500 bg-transparent text-xl font-bold text-center w-40 outline-none" style={{ color: theme.textMain }} />
//                      <button onClick={() => { onUpdate({ ...contact, name: editedName }); setIsRenaming(false); }} className="text-green-500"><Check size={20}/></button>
//                    </div>
//                  ) : (
//                    <>
//                      <h2 className="text-2xl font-bold" style={{ color: theme.textMain }}>{contact.name}</h2>
//                      {!isMe && <button onClick={() => setIsRenaming(true)} className="text-gray-400 hover:text-indigo-500"><Pencil size={16} /></button>}
//                    </>
//                  )}
//                </div>
               
//                <p className="text-sm font-medium mb-6" style={{ color: contact.status === 'online' ? '#22c55e' : theme.textSec }}>
//                  {isMe ? 'It\'s you!' : contact.status === 'online' ? 'Online' : contact.lastSeen}
//                </p>

//                {!isMe && (
//                    <div className="flex justify-center gap-6 mb-8 py-4 border-y" style={{ borderColor: theme.border }}>
//                        <div onClick={toggleMute} className="flex flex-col items-center cursor-pointer group select-none">
//                            <div className={`p-3 rounded-full mb-1 transition-colors ${contact.muted ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}`}>
//                               {contact.muted ? <BellOff size={20}/> : <Bell size={20}/>}
//                            </div>
//                            <span className={`text-xs font-medium ${contact.muted ? 'text-indigo-600' : 'text-gray-500'}`}>{contact.muted ? 'Unmute' : 'Mute'}</span>
//                        </div>
//                        <div onClick={toggleFavorite} className="flex flex-col items-center cursor-pointer group select-none">
//                            <div className={`p-3 rounded-full mb-1 transition-colors ${contact.isFavorite ? 'bg-pink-600 text-white' : 'bg-pink-50 text-pink-600 group-hover:bg-pink-100'}`}>
//                               <Heart size={20} fill={contact.isFavorite ? "currentColor" : "none"} />
//                            </div>
//                            <span className={`text-xs font-medium ${contact.isFavorite ? 'text-pink-600' : 'text-gray-500'}`}>Favorite</span>
//                        </div>
//                        <div onClick={toggleBlock} className="flex flex-col items-center cursor-pointer group select-none">
//                            <div className={`p-3 rounded-full mb-1 transition-colors ${contact.blocked ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 group-hover:bg-red-100'}`}>
//                               <Ban size={20}/>
//                            </div>
//                            <span className={`text-xs font-medium ${contact.blocked ? 'text-red-600' : 'text-gray-500'}`}>{contact.blocked ? 'Unblock' : 'Block'}</span>
//                        </div>
//                    </div>
//                )}

//                <div className="space-y-4 text-left">
//                   <div className="flex gap-4">
//                      <Info size={20} className="mt-1 text-gray-400" />
//                      <div className="flex-1">
//                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Bio</p>
//                        {isEditing && isMe ? (
//                          <textarea rows={2} value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className="w-full bg-gray-100 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" style={{color: theme.textMain}}/>
//                        ) : (
//                          <p className="text-sm" style={{ color: theme.textMain }}>{contact.about || 'No bio'}</p>
//                        )}
//                      </div>
//                   </div>

//                   <div className="flex gap-4">
//                      <Phone size={20} className="mt-1 text-gray-400" />
//                      <div className="flex-1">
//                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Phone</p>
//                        {isEditing && isMe ? (
//                          <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-100 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" style={{color: theme.textMain}}/>
//                        ) : (
//                          <p className="text-sm" style={{ color: theme.textMain }}>{contact.phone || 'N/A'}</p>
//                        )}
//                      </div>
//                   </div>
                  
//                   {/* FIXED EMAIL DISPLAY */}
//                   <div className="flex gap-4">
//                      <Mail size={20} className="mt-1 text-gray-400" />
//                      <div className="flex-1">
//                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Email</p>
//                        <p className="text-sm" style={{ color: theme.textMain }}>{contact.email || 'N/A'}</p>
//                      </div>
//                   </div>
//                </div>

//                {isMe && (
//                    <div className="mt-8">
//                        {isEditing ? (
//                            <div className="flex gap-2">
//                                <button onClick={handleSave} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-bold">Save</button>
//                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold">Cancel</button>
//                            </div>
//                        ) : (
//                            <button onClick={() => setIsEditing(true)} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-colors">Edit Details</button>
//                        )}
//                    </div>
//                )}
//             </div>
//          </div>
//       </div>
//     </div>
//   );
// }


// DATE 05 FEB 2026

import { X, Ban, Trash2, Mail, Info } from "lucide-react";
import type { Theme, User } from "../types";

interface ProfileDetailsModalProps {
  contact: User;
  onClose: () => void;
  currentUser: User; // [FIX] Added missing prop
  theme: Theme;
  onUpdate: (updatedContact: User) => void;
}

export default function ProfileDetailsModal({ 
  contact, 
  onClose, 
  currentUser, 
  theme, 
  onUpdate 
}: ProfileDetailsModalProps) {
  const isMe = contact.id === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden mx-4"
        style={{ backgroundColor: theme.bg, color: theme.textMain }}
      >
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-16 relative">
          <img 
            src={contact.avatar} 
            alt={contact.name} 
            className="w-32 h-32 rounded-full border-4 object-cover shadow-lg mx-auto mb-4 bg-white"
            style={{ borderColor: theme.bg }}
          />
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{contact.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1 opacity-70">
              <Mail size={14} />
              <span className="text-sm">{contact.email || "No email available"}</span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
               <h3 className="text-xs font-bold uppercase opacity-50 mb-2 flex items-center gap-2">
                 <Info size={12} /> About
               </h3>
               <p className="text-sm leading-relaxed">{contact.about || "Hey there! I am using Nebula Chat."}</p>
             </div>

             {!isMe && (
               <div className="space-y-2 pt-2">
                 <button 
                   onClick={() => onUpdate({ ...contact, blocked: !contact.blocked })}
                   className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                     contact.blocked 
                       ? "bg-red-100 text-red-600 hover:bg-red-200" 
                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                   }`}
                 >
                   <Ban size={18} /> {contact.blocked ? "Unblock Contact" : "Block Contact"}
                 </button>
                 <button className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 transition-colors">
                   <Trash2 size={18} /> Delete Chat
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}