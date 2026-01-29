
// import { MessageSquare, Heart } from 'lucide-react';

// // --- CONFIGURATION ---
// // FIX: Define API URL dynamically so it works in Production and Localhost
// // Make sure to set VITE_API_URL in your .env file for production
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// interface LoginScreenProps {
//   onLogin: (user: any) => void;
// }

// export default function LoginScreen({ }: LoginScreenProps) {
  
//   const handleGoogleLogin = () => {
//     // FIX: Use the dynamic API_URL for the redirect
//     window.open(`${API_URL}/auth/google`, "_self");
//   };

//   return (
//     <div className="flex h-screen w-full items-center justify-center bg-gray-900 relative overflow-hidden font-sans">
//       {/* Background decoration */}
//       <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
//       <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>

//       <div className="relative z-10 w-full max-w-md p-8">
//         <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-center">
           
//            {/* Logo Section */}
//            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
//               <MessageSquare size={40} className="text-white" />
//            </div>

//            <h1 className="text-3xl font-bold text-white mb-2">Nebula Chat</h1>
//            <p className="text-gray-400 mb-8">Fast, secure, and intelligent messaging designed for you.</p>

//            {/* Login Button */}
//            <button 
//              onClick={handleGoogleLogin}
//              className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl"
//            >
//               <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
//               <span>Continue with Google</span>
//            </button>

//            {/* Footer */}
//            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest animate-pulse">
//               <span>Made with</span>
//               <Heart size={14} className="text-red-500 fill-current" />
//               <span>Love</span>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { MessageSquare, Heart } from 'lucide-react';
// [OPTIMIZATION] Import the shared BASE_URL for consistent API connections
import { BASE_URL } from "../lib/axios";

interface LoginScreenProps {
  onLogin?: (user: any) => void;
}

export default function LoginScreen({}: LoginScreenProps) {
  
  const handleGoogleLogin = () => {
    // [FIX] Use the dynamic BASE_URL for the redirect
    // This ensures it goes to https://nebula-ui.onrender.com in production
    // and http://localhost:5000 in development.
    window.open(`${BASE_URL}/auth/google`, "_self");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 relative overflow-hidden font-sans">
      
      {/* Background Decoration (Optimized for performance) */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-center">
           
           {/* Logo Section */}
           <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300">
              <MessageSquare size={40} className="text-white" />
           </div>

           <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Nebula Chat</h1>
           <p className="text-gray-400 mb-8">Fast, secure, and intelligent messaging designed for you.</p>

           {/* Login Button */}
           <button 
             onClick={handleGoogleLogin}
             className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl"
           >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
           </button>

           {/* Footer */}
           <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest animate-pulse">
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-current" />
              <span>Love</span>
           </div>
        </div>
      </div>
    </div>
  );
}