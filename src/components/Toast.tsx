import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-950 shadow-lg',
    info: 'border-cyan-300 bg-cyan-50 text-cyan-950 shadow-lg',
    warning: 'border-amber-300 bg-amber-50 text-amber-950 shadow-lg',
    error: 'border-rose-300 bg-rose-50 text-rose-950 shadow-lg',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`p-4 rounded-2xl border backdrop-blur-md flex items-start gap-3 ${
          borders[toast.type]
        }`}
      >
        {icons[toast.type]}
        <div className="flex-1">
          <h4 className="font-bold text-sm tracking-wide">{toast.title}</h4>
          <p className="text-xs mt-1 leading-relaxed font-medium opacity-90">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
