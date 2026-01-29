
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


import { Sparkles } from "lucide-react";
// [FIX] Import the shared BASE_URL so the login link is dynamic
import { BASE_URL } from "../lib/axios";

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

export default function LoginScreen({}: LoginScreenProps) {
  
  // [FIX] Use BASE_URL to define where the user goes for Google Auth
  const handleGoogleLogin = () => {
    window.open(`${BASE_URL}/auth/google`, "_self");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 text-center p-8 max-w-md w-full">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-500">
            <Sparkles size={48} className="text-white animate-bounce" />
          </div>
        </div>

        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 tracking-tight">
          Nebula
        </h1>
        <p className="text-gray-400 text-lg mb-10 font-medium">
          Experience chat beyond limits.
          <br />
          Fast. Secure. Beautiful.
        </p>

        {/* Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="group relative w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/20"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
            alt="Google"
          />
          <span>Continue with Google</span>
          
          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine"></div>
          </div>
        </button>

        <p className="mt-8 text-xs text-gray-600">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}