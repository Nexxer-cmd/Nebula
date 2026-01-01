import React from 'react';
import { Image, Video, FileText, Camera } from 'lucide-react';
import type { Theme } from '../types';

interface ChatItemProps {
  contact: any; // Using any for flexibility with new fields
  onClick: () => void;
  isActive: boolean;
  theme: Theme;
}

export default function ChatItem({ contact, onClick, isActive, theme }: ChatItemProps) {
  // Determine if typing
  const isTyping = contact.status === 'typing...';

  // Helper to get icon for message type
  const getIcon = (type: string) => {
      switch(type) {
          case 'image': return <Camera size={14} className="inline mr-1" />;
          case 'video': return <Video size={14} className="inline mr-1" />;
          case 'file': return <FileText size={14} className="inline mr-1" />;
          default: return null;
      }
  };

  // Format preview text based on type
  let previewText = contact.lastMessage || "No messages yet";
  if (contact.lastMessageType === 'image') previewText = "Photo";
  if (contact.lastMessageType === 'video') previewText = "Video";
  if (contact.lastMessageType === 'file') previewText = "Document";

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 mb-2 rounded-2xl cursor-pointer transition-all duration-200 group ${
        isActive 
          ? `bg-indigo-600 shadow-md shadow-indigo-500/20` 
          : `hover:bg-gray-100/50 active:scale-[0.98]`
      }`}
      style={!isActive ? { backgroundColor: theme.sidebar } : {}}
    >
      <div className="relative">
        <img src={contact.avatar} alt={contact.name} className={`w-12 h-12 rounded-full object-cover border-2 ${isActive ? 'border-white/30' : 'border-transparent group-hover:border-gray-200'} transition-all`} />
        
        {/* Online/Offline Indicator */}
        {contact.status !== 'typing...' && (
           <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 rounded-full ${
             contact.status === 'online' ? 'bg-green-500 border-white' : 'bg-gray-400 border-white'
           }`}></div>
        )}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h3 className={`font-bold text-[15px] truncate ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: theme.textMain } : {}}>
            {contact.name}
          </h3>
          
          {/* Time / Typing Indicator */}
          <span className={`text-xs font-medium ${isActive ? 'text-indigo-200' : isTyping ? 'text-indigo-500 animate-pulse' : ''}`} style={!isActive && !isTyping ? { color: theme.textSec } : {}}>
            {isTyping ? 'typing...' : contact.lastMessageTime}
          </span>
        </div>

        <div className="flex items-center justify-between">
           <p className={`text-sm truncate font-medium flex items-center ${isActive ? 'text-indigo-100' : isTyping ? 'text-indigo-500' : ''}`} style={!isActive && !isTyping ? { color: theme.textSec } : {}}>
             {/* Show Blue Typing OR Last Message Icon+Text */}
             {isTyping ? (
                 'typing...' 
             ) : (
                 <>
                   {getIcon(contact.lastMessageType)}
                   {contact.lastMessageDoc?.sender === 'me' && contact.lastMessageType === 'text' ? 'You: ' : ''} 
                   {previewText}
                 </>
             )}
           </p>

           {/* Unread Count Badge (Static for now) */}
           {contact.unread > 0 && !isActive && (
             <div className="ml-2 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
               {contact.unread}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}