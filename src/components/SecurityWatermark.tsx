import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck } from 'lucide-react';



export const SecurityWatermark: React.FC = () => {
  const { currentUser } = useApp();
  const [position, setPosition] = useState({ top: 20, left: 30 });

  // Move watermark around randomly every 8 seconds to prevent cropping by video downloaders
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 60) + 15; // 15% to 75%
      const randomLeft = Math.floor(Math.random() * 60) + 15; // 15% to 75%
      setPosition({ top: randomTop, left: randomLeft });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="pointer-events-none select-none absolute z-40 transition-all duration-1000 ease-in-out opacity-40 hover:opacity-10"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
      }}
    >
      <div className="bg-slate-950/70 border border-slate-700/50 backdrop-blur-xs px-3 py-1.5 rounded-lg text-[10px] font-mono text-emerald-400/90 shadow-lg flex items-center gap-1.5 tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>
          LICENCE EXCELIUM | CLIENT: <strong className="text-white">{currentUser.email}</strong> | IP: 196.200.142.18 | ID: {currentUser.id}
        </span>
      </div>
    </div>
  );
};
