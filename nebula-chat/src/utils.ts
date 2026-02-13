// const apiKey = "AIzaSyBOR-znD0b3bLISIlHsF98Taw5Yp2AWe5E";

// export const formatTime = () => {
//   return new Date().toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// export const callGemini = async (
//   prompt: string,
//   systemInstruction = "",
//   useSearch = false
// ) => {
//   if (!apiKey) return "Please configure an API Key in utils.ts";
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
//   const payload: any = {
//     contents: [{ parts: [{ text: prompt }] }],
//     systemInstruction: { parts: [{ text: systemInstruction }] },
//   };
//   if (useSearch) {
//     payload.tools = [{ google_search: {} }];
//   }
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     const data = await response.json();
//     return (
//       data.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No response generated."
//     );
//   } catch (error) {
//     return "Error connecting to AI.";
//   }
// };

// export const formatRelativeTime = (
//   dateInput: string | Date | undefined | null
// ): string => {
//   if (!dateInput) return "";
//   const date = new Date(dateInput);
//   if (isNaN(date.getTime())) return "";
//   const now = new Date();
//   const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//   if (seconds < 60) return "Just now";
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;
//   return date.toLocaleDateString([], { month: "short", day: "numeric" });
// };

// export const formatLastSeen = (
//   dateInput: string | Date | undefined | null
// ): string => {
//   if (!dateInput) return "offline";
//   const date = new Date(dateInput);
//   if (isNaN(date.getTime())) return "offline";
//   const now = new Date();
//   const isToday = now.toDateString() === date.toDateString();
//   const yesterday = new Date(now);
//   yesterday.setDate(now.getDate() - 1);
//   const isYesterday = yesterday.toDateString() === date.toDateString();
//   const time = date.toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
//   if (isToday) return `today at ${time}`;
//   if (isYesterday) return `yesterday at ${time}`;
//   return `on ${date.toLocaleDateString([], {
//     month: "short",
//     day: "numeric",
//   })} at ${time}`;
// };

// // --- NEW: Generate Unique Avatar URL (WhatsApp Style) ---
// export const generateAvatar = (name: string): string => {
//   // A palette of nice, "flat" colors similar to messaging apps
//   const colors = [
//     "F44336",
//     "E91E63",
//     "9C27B0",
//     "673AB7",
//     "3F51B5",
//     "2196F3",
//     "03A9F4",
//     "00BCD4",
//     "009688",
//     "4CAF50",
//     "8BC34A",
//     "FFC107",
//     "FF9800",
//     "FF5722",
//     "795548",
//     "607D8B",
//   ];

//   // Generate a deterministic hash from the name
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   // Pick a color based on the hash
//   const color = colors[Math.abs(hash) % colors.length];

//   // Return UI Avatars URL
//   return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//     name
//   )}&background=${color}&color=fff&rounded=true&bold=true&size=128`;
// };



//UPDATED AT 13 FEB


const apiKey = "AIzaSyBOR-znD0b3bLISIlHsF98Taw5Yp2AWe5E";

export const formatTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const callGemini = async (
  prompt: string,
  systemInstruction = "",
  useSearch = false
) => {
  if (!apiKey) return "Please configure an API Key in utils.ts";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload: any = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };
  if (useSearch) {
    payload.tools = [{ google_search: {} }];
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated."
    );
  } catch (error) {
    return "Error connecting to AI.";
  }
};

export const formatRelativeTime = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

// --- UPDATED: Better Last Seen Formatting ---
export const formatLastSeen = (
  dateInput: string | Date | undefined | null
): string => {
  // Return "recently" instead of "offline" if data is missing
  // This reads as "last seen recently" in the UI
  if (!dateInput) return "recently";
  
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "recently";

  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // If today: returns "7:00 PM" -> UI: "last seen 7:00 PM"
  if (isToday) return time;
  
  // If yesterday: returns "yesterday at 7:00 PM" -> UI: "last seen yesterday at 7:00 PM"
  if (isYesterday) return `yesterday at ${time}`;
  
  // Older: returns "on Jan 12 at 7:00 PM" -> UI: "last seen on Jan 12 at 7:00 PM"
  return `on ${date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} at ${time}`;
};

export const generateAvatar = (name: string): string => {
  const colors = [
    "F44336",
    "E91E63",
    "9C27B0",
    "673AB7",
    "3F51B5",
    "2196F3",
    "03A9F4",
    "00BCD4",
    "009688",
    "4CAF50",
    "8BC34A",
    "FFC107",
    "FF9800",
    "FF5722",
    "795548",
    "607D8B",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = colors[Math.abs(hash) % colors.length];

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=${color}&color=fff&rounded=true&bold=true&size=128`;
};