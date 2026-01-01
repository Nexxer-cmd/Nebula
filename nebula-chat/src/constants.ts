import type { User, Message, Theme } from './types';

export const CURRENT_USER_ID = 'me';

// --- CLEANED UP CONTACTS LIST ---
// Only Nebula AI remains. No fake users.
export const INITIAL_CONTACTS: User[] = [
  {
    id: 'nebula-ai',
    name: 'Nebula AI',
    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png',
    lastSeen: 'Always active',
    status: 'online',
    isAI: true,
    about: 'I am your personal AI assistant powered by Gemini. Ask me anything!',
    phone: 'N/A'
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'nebula-ai': [
    { id: 'm1', senderId: 'nebula-ai', text: 'Hello! I am Nebula AI ✨.', timestamp: 'Now', status: 'read', type: 'text' }
  ]
};

export const THEMES: Record<string, Theme> = {
  light: {
    id: 'light',
    bg: '#ffffff',
    textMain: '#111827',
    textSec: '#6b7280',
    sidebar: '#f3f4f6',
    header: '#ffffff',
    inputBg: '#f3f4f6',
    accent: '#4f46e5',
    border: '#e5e7eb',
    iconColor: '#4b5563'
  },
  dark: {
    id: 'dark',
    bg: '#111827', // Gray 900
    textMain: '#f9fafb', // Gray 50
    textSec: '#9ca3af', // Gray 400
    sidebar: '#1f2937', // Gray 800
    header: '#1f2937',
    inputBg: '#374151', // Gray 700
    accent: '#6366f1', // Indigo 500
    border: '#374151',
    iconColor: '#d1d5db'
  }
};

export const EMOJIS = ['😀','😂','😍','🥺','😎','👍','🔥','✨','❤️','🎉','md','👀','wso','🤔','😭','😤'];
export const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';