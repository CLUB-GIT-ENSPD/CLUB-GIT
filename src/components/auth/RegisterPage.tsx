import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pole } from '../../types';
import { UserPlus, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, navigate } = useApp();

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    matricule: '',
    level: 'GIT 3',
    pole: 'Dev & Cloud' as Pole,
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const msg = await register({
        ...form,
        matricule: form.matricule.toUpperCase(),
      });
      setSuccessMsg(msg);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-4 sm:py-6 space-y-5">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour à l’accueil</span>
      </button>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7">
        {successMsg ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Demande d’adhésion enregistrée
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {successMsg}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="min-h-[42px] px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold"
              >
                Aller à la connexion
              </button>
              <button
                onClick={() => navigate('/')}
                className="min-h-[42px] px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Accueil visiteur
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Demande d’adhésion · Club GIT ENSPD
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Votre compte sera activé après validation de votre inscription par l’administrateur du club.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Jean-Paul"
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mba"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email universitaire *</label>
                  <input
                    type="email"
                    required
                    placeholder="nom@enspd-udo.cm"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+237 6XX XX XX XX"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Matricule *</label>
                  <input
                    type="text"
                    required
                    placeholder="25P402"
                    value={form.matricule}
                    onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 font-mono uppercase rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Niveau</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="GIT 1">GIT 1</option>
                    <option value="GIT 2">GIT 2</option>
                    <option value="GIT 3">GIT 3</option>
                    <option value="GIT 4">GIT 4</option>
                    <option value="GIT 5">GIT 5</option>
                    <option value="Télécoms 4">Télécoms 4</option>
                    <option value="Télécoms 5">Télécoms 5</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pôle</label>
                  <select
                    value={form.pole}
                    onChange={(e) => setForm({ ...form, pole: e.target.value as Pole })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="Dev & Cloud">Dev & Cloud</option>
                    <option value="IA & Data Science">IA & Data Science</option>
                    <option value="Réseaux & Télécoms">Réseaux & Télécoms</option>
                    <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                    <option value="Cybersécurité">Cybersécurité</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mot de passe *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min. 6 caractères"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirmation *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Répéter le mot de passe"
                    value={form.password_confirmation}
                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px] mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Envoi en cours...' : 'Soumettre ma demande'}</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
              Déjà inscrit et validé ?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
