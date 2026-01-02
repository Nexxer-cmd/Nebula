// import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import type { Theme } from '../types';

export const EmptyState = ({ theme }: { theme: Theme }) => (
  <div className="hidden md:flex flex-col items-center justify-center h-full text-center px-10">
    <div className="mb-8 relative"><div className="w-40 h-40 rounded-3xl transform rotate-12 flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary }}><MessageSquarePlus size={64} className="text-white" /></div></div>
    <h1 className="text-4xl font-bold mb-4" style={{ color: theme.textMain }}>Nebula Chat</h1>
    <p className="text-lg max-w-md opacity-70" style={{ color: theme.textMain }}>Select a chat to start messaging. <br/>Fast, secure, and designed for you.</p>
  </div>
);