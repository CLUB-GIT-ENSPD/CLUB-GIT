import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogIn, AlertCircle, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err: any) {
      setError(err.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-4 sm:py-8 space-y-5">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour à l’accueil</span>
      </button>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 space-y-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Connexion au portail Club GIT
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accédez à votre espace membre, chef de projet, censeur ou administrateur.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Adresse email universitaire
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="prenom.nom@enspd-udo.cm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          Pas encore membre ?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Créer un compte
          </button>
        </div>
      </div>

      {/* Compact Demo Accounts for Testing Separated Roles */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
          Comptes de démonstration (mot de passe : password123)
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Membre', email: 'membre@enspd-udo.cm' },
            { label: 'Chef de projet', email: 'chef@enspd-udo.cm' },
            { label: 'Censeur', email: 'censeur@enspd-udo.cm' },
            { label: 'Admin', email: 'admin@enspd-udo.cm' },
          ].map(demo => (
            <button
              key={demo.email}
              type="button"
              disabled={loading}
              onClick={() => handleDemoFill(demo.email)}
              className="min-h-[40px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <div className="text-xs font-semibold text-slate-900 dark:text-white">{demo.label}</div>
              <div className="text-[10px] font-mono text-slate-500 truncate">{demo.email}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
