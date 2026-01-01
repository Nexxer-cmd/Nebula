import React from 'react';
import { Check, CheckCheck, Reply, Phone, Video, PhoneMissed, PhoneIncoming, PhoneOutgoing } from 'lucide-react'; 
import type { Theme } from '../types';

interface MessageBubbleProps {
  message: any;
  theme: Theme;
  onReply: (message: any) => void;
  currentUserId?: string;
}

export default function MessageBubble({ message, theme, onReply, currentUserId }: MessageBubbleProps) {
  const isMe = message.senderId === currentUserId || message.senderId === 'me';
  
  // --- SPECIAL RENDER FOR CALL LOGS ---
  if (message.type === 'call') {
     const isMissed = message.callDetails?.status === 'missed';
     const isVideo = message.text.includes('Video');
     
     // Determine Icon
     let CallIcon = Phone;
     if (isMissed) {
         CallIcon = PhoneMissed;
     } else if (isVideo) {
         CallIcon = Video;
     } else {
         CallIcon = isMe ? PhoneOutgoing : PhoneIncoming;
     }

     return (
       // ALIGNMENT FIX: 'justify-end' if I started the call, 'justify-start' if they did
       <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-100/80 rounded-full text-xs font-medium border border-gray-200 shadow-sm transition-all hover:bg-white" style={{ backgroundColor: theme.sidebar, color: theme.textSec, borderColor: theme.border }}>
              <div className={`p-2 rounded-full ${isMissed ? 'bg-red-100 text-red-500' : 'bg-indigo-100 text-indigo-500'}`}>
                  <CallIcon size={16} />
              </div>
              <div className="flex flex-col items-start">
                  <span className={`font-bold ${isMissed ? 'text-red-500' : ''}`}>
                      {isVideo ? 'Video Call' : 'Audio Call'}
                  </span>
                  <div className="flex items-center gap-1 opacity-70 text-[10px]">
                      <span>{isMissed ? 'Missed' : (message.callDetails?.duration || 'Ended')}</span>
                      <span>•</span>
                      <span>{message.timestamp}</span>
                  </div>
              </div>
          </div>
       </div>
     );
  }

  // --- NORMAL TEXT MESSAGES ---
  return (
    <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
       <div className={`relative max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2 shadow-sm text-sm ${
           isMe 
             ? 'bg-indigo-600 text-white rounded-br-none' 
             : 'bg-white text-gray-800 rounded-bl-none border'
       }`} style={!isMe ? { backgroundColor: theme.inputBg, color: theme.textMain, borderColor: theme.border } : {}}>
          
          {message.replyTo && (
              <div className={`mb-2 rounded-lg p-2 text-xs border-l-4 ${isMe ? 'bg-white/10 border-white/50 text-white/90' : 'bg-gray-100 border-indigo-500 text-gray-600'}`}>
                  <p className="font-bold opacity-75">{message.replyTo.senderName}</p>
                  <p className="truncate opacity-75">{message.replyTo.text}</p>
              </div>
          )}

          <p className="leading-relaxed break-words whitespace-pre-wrap">{message.text}</p>

          <div className={`flex items-center justify-end gap-2 mt-1 select-none`}>
              <span className={`text-[10px] ${isMe ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {message.timestamp}
              </span>
              
              {isMe && (
                  <span>
                      {message.status === 'sent' && <Check size={12} className="text-indigo-200" />}
                      {message.status === 'delivered' && <CheckCheck size={12} className="text-indigo-200" />}
                      {message.status === 'read' && <CheckCheck size={12} className="text-blue-200" />}
                  </span>
              )}

              <button 
                onClick={() => onReply({ ...message, senderName: isMe ? 'You' : 'User' })} 
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full ${isMe ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-gray-500'}`}
                title="Reply"
              >
                  <Reply size={16} />
              </button>
          </div>
       </div>
    </div>
  );
}