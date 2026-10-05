import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Lock, ArrowRight, X, KeyRound, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default cabinet admin password: excelium2026 or admin123
    if (password === 'excelium2026' || password === 'admin123' || password === 'admin') {
      setError(false);
      setPassword('');
      showToast('Accès Autorisé', 'Connexion sécurisée à l\'Espace Admin Cabinet effectuée.', 'success');
      onSuccess();
    } else {
      setError(true);
      showToast('Accès Refusé', 'Mot de passe administrateur incorrect.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Espace Administration Cabinet</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Accès réservé exclusivement aux formateurs et administrateurs d'Excelium Consulting Compta.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Mot de passe Secrétariat / Admin :</span>
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
            {error && (
              <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Mot de passe incorrect (Mot de passe démo: excelium2026)</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 font-mono">
            💡 <strong className="text-slate-700">Accès Démo Admin :</strong> Entrez <span className="text-amber-700 font-bold">excelium2026</span> pour débloquer le Studio.
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Déverrouiller le Studio Cabinet</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
