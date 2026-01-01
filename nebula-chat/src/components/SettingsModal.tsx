import React, { useState, useRef } from 'react';
import { X, Camera, Save, User, FileText, Mail, RefreshCw } from 'lucide-react'; // Added RefreshCw
import type { Theme } from '../types';
import { generateAvatar } from '../utils'; // Import the generator

interface SettingsModalProps {
  user: any;
  theme: Theme;
  onClose: () => void;
  onUpdate: (updates: { displayName: string; bio: string; avatar: string }) => Promise<boolean>;
}

export default function SettingsModal({ user, theme, onClose, onUpdate }: SettingsModalProps) {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.about || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- NEW: Reset Photo Handler ---
  const handleResetPhoto = () => {
    // Generate a unique avatar based on the current name
    const defaultAvatar = generateAvatar(name || 'User');
    setAvatar(defaultAvatar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onUpdate({ displayName: name, bio, avatar });
    setLoading(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md p-6 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
        style={{ backgroundColor: theme.bg, color: theme.textMain }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-10"
          style={{ color: theme.textSec }}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img 
                src={avatar} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transition-all">
                <Camera className="text-white" size={32} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            {/* Action Buttons for Photo */}
            <div className="flex gap-4 mt-3">
               <button 
                 type="button" 
                 onClick={() => fileInputRef.current?.click()}
                 className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
               >
                 Change Photo
               </button>
               <span className="text-gray-300">|</span>
               <button 
                 type="button" 
                 onClick={handleResetPhoto}
                 className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
               >
                 <RefreshCw size={12} /> Reset to Default
               </button>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Display Name</label>
            <div className="flex items-center px-4 py-3 rounded-xl border-2 transition-colors focus-within:border-indigo-500" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
              <User size={18} className="mr-3 opacity-50" />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-transparent border-none outline-none w-full font-medium"
                style={{ color: theme.textMain }}
                placeholder="Your Name"
              />
            </div>
          </div>

           {/* Email Input (Read Only) */}
           <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Email Address</label>
            <div className="flex items-center px-4 py-3 rounded-xl border-2 transition-colors opacity-60 cursor-not-allowed" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
              <Mail size={18} className="mr-3 opacity-50" />
              <input 
                type="email" 
                value={user.email || ''} 
                readOnly
                className="bg-transparent border-none outline-none w-full font-medium cursor-not-allowed font-mono text-sm"
                style={{ color: theme.textMain }}
              />
            </div>
            <p className="text-[10px] mt-1 opacity-50 ml-1">Email cannot be changed.</p>
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">About / Bio</label>
            <div className="flex items-start px-4 py-3 rounded-xl border-2 transition-colors focus-within:border-indigo-500" style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
              <FileText size={18} className="mr-3 mt-1 opacity-50" />
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                rows={3}
                className="bg-transparent border-none outline-none w-full font-medium resize-none custom-scrollbar"
                style={{ color: theme.textMain }}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}