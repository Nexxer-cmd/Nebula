import { useState, useEffect, useRef } from 'react'; // removed React, 
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import type { User } from '../types';

interface CallOverlayProps { contact: User; type: 'audio' | 'video'; onEnd: () => void; }

export default function CallOverlay({ contact, type, onEnd }: CallOverlayProps) {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startMedia = async () => {
      if (type === 'video') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) { console.error("Camera access denied or error:", err); }
      }
    };
    startMedia();
    return () => { stream?.getTracks().forEach(track => track.stop()); };
  }, [type]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col items-center justify-between py-12 px-4">
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        {type === 'video' && !isVideoOff ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
        ) : (
            <div className="flex flex-col items-center z-10">
                <img src={contact.avatar} className="w-32 h-32 rounded-full border-4 border-white/20 mb-4 animate-pulse" alt="avatar" />
                <h2 className="text-3xl font-bold">{contact.name}</h2>
                <p className="text-white/60 mt-2">{formatTime(duration)}</p>
            </div>
        )}
      </div>
      <div className="z-20 w-full max-w-lg bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 mb-8 border border-white/10">
        <div className="flex items-center justify-evenly">
           <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full ${isMuted ? 'bg-white text-black' : 'bg-white/20'}`}>{isMuted ? <MicOff /> : <Mic />}</button>
           {type === 'video' && <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-4 rounded-full ${isVideoOff ? 'bg-white text-black' : 'bg-white/20'}`}>{isVideoOff ? <VideoOff /> : <Video />}</button>}
           <button onClick={onEnd} className="p-4 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transform active:scale-95 transition-all"><PhoneOff size={32} /></button>
        </div>
      </div>
    </div>
  );
}