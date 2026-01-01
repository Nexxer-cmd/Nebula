import React from 'react';
import { X, Phone, Video, MessageSquare, Info } from 'lucide-react';
import type { Theme, User } from '../types';

interface ProfilePopupProps {
  contact: User;
  onClose: () => void;
  onCall: (type: 'audio' | 'video') => void;
  onMessage: () => void;
  onViewDetails: () => void;
  theme: Theme;
}

export default function ProfilePopup({ contact, onClose, onCall, onMessage, onViewDetails, theme }: ProfilePopupProps) {
  return (
    <div 
        className="fixed inset-0 z-[70] flex items-center justify-start p-4 md:pl-20 bg-black/30 backdrop-blur-[1px] animate-in fade-in duration-200" 
        onClick={onClose}
    >
      <div 
        className="relative w-64 rounded-2xl overflow-hidden shadow-2xl transform transition-all animate-in slide-in-from-left-8 zoom-in-95 duration-200 ring-1 ring-white/20" 
        onClick={e => e.stopPropagation()} 
        style={{ backgroundColor: theme.bg }}
      >
        {/* Minimal Header */}
        <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <button 
                onClick={onViewDetails} // <--- INFO ICON
                className="absolute top-2 left-2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                title="View Full Details"
            >
                <Info size={14} />
            </button>
            <button 
                onClick={onClose} 
                className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
            >
                <X size={14} />
            </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 relative text-center">
            {/* Centered Avatar */}
            <div className="-mt-10 mb-2 flex justify-center">
                <div className="relative">
                    <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="w-20 h-20 rounded-full border-[4px] object-cover shadow-md" 
                        style={{ borderColor: theme.bg }} 
                    />
                     <span className={`absolute bottom-1 right-0 w-4 h-4 rounded-full border-2 ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} style={{borderColor: theme.bg}}></span>
                </div>
            </div>
            
            {/* Name */}
            <div className="mb-4">
                <h2 className="text-lg font-bold truncate" style={{ color: theme.textMain }}>{contact.name}</h2>
                <p className="text-xs opacity-60" style={{ color: theme.textSec }}>{contact.status}</p>
            </div>

            {/* Functional Buttons */}
            <div className="flex gap-2 justify-center">
                <button 
                    onClick={() => onCall('audio')}
                    className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm"
                    title="Audio Call"
                >
                    <Phone size={18} />
                </button>
                <button 
                    onClick={() => onCall('video')}
                    className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-105 transition-all shadow-sm"
                    title="Video Call"
                >
                    <Video size={18} />
                </button>
                <button 
                    onClick={onMessage}
                    className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg shadow-indigo-200"
                    title="Message"
                >
                    <MessageSquare size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}