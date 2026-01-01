// --- THEME INTERFACE ---
export interface Theme {
  id: string;
  bg: string;
  textMain: string;
  textSec: string;
  sidebar: string;
  header: string;
  inputBg: string;
  border: string;
  iconColor: string;
  accent: string;       // Required by your current constants
  
  // Optional: Advanced Styling (from your optimization request)
  name?: string;
  primary?: string;
  sentBubble?: string;
  sentText?: string;
  receivedBubble?: string;
  receivedText?: string;
  activeChat?: string;
}

// --- USER INTERFACE ---
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;       // Kept required for UI consistency
  
  // Identity & Auth
  email?: string;
  shareId?: string;     // Added for the "Add Friend" feature
  phone?: string;
  about?: string;
  
  // App State
  lastSeen?: string;
  isAI?: boolean;
  unread?: number;
  muted?: boolean;
  blocked?: boolean;
}

// --- MESSAGE INTERFACE ---
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  
  status: 'sent' | 'delivered' | 'read';
  // 1. ADD 'call' to this list
  type: 'text' | 'image' | 'audio' | 'video' | 'file' | 'call';
  
  // 2. ADD callDetails (Optional)
  callDetails?: {
    status: 'missed' | 'ended';
    duration: string;
  };

  fileName?: string;
  fileSize?: string;
  duration?: string;
  
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
}