import React from 'react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function Chat() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-20 h-20 bg-neon-purple/10 rounded-full flex items-center justify-center border border-neon-purple/30 mb-8 shadow-[0_0_20px_rgba(189,0,255,0.2)]">
        <ShieldAlert className="text-neon-purple w-10 h-10" />
      </div>
      <h2 className="text-2xl font-mono font-bold text-white mb-4 uppercase tracking-[0.2em]">Secure Node Engaged</h2>
      <p className="text-gray-500 font-mono text-sm max-w-md mx-auto">
        End-to-end encrypted real-time communication channel is being initialized. 
        <br/><span className="text-neon-purple">ESTABLISHING PEER CONNECTION...</span>
      </p>
      
      <div className="mt-12 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-neon-purple animate-ping" />
        <div className="w-3 h-3 rounded-full bg-neon-purple animate-ping [animation-delay:0.2s]" />
        <div className="w-3 h-3 rounded-full bg-neon-purple animate-ping [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
