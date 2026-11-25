import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  LogIn,
  UserPlus,
  Code2,
  Cpu,
  Wifi,
  ShieldCheck,
  Database,
  Calendar,
  MapPin,
} from 'lucide-react';

export const VisitorHomePage: React.FC = () => {
  const { publicProjects, publicEvents, navigate, setSelectedProject, isAuthenticated } = useApp();

  const poles = [
    { name: 'Dev & Cloud', icon: <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />, desc: 'Applications web, mobiles PWA, APIs et déploiement Linux/k3s.' },
    { name: 'IA & Data Science', icon: <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />, desc: 'Vision par ordinateur, inférence locale et analyse de données.' },
    { name: 'Réseaux & Télécoms', icon: <Wifi className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />, desc: 'Planification fibre, faisceaux hertziens et architecture IP.' },
    { name: 'Systèmes Embarqués', icon: <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />, desc: 'Microcontrôleurs ESP32, capteurs LoRaWAN et robotique.' },
    { name: 'Cybersécurité', icon: <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />, desc: 'Audit réseau, sondes IDS et bonnes pratiques applicatives.' },
  ];

  return (
    <div className="space-y-8">
      {/* Sober Hero Card */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
            <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
              École Nationale Supérieure Polytechnique de Douala
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Club Génie Informatique & Télécommunications
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Espace d’ingénierie étudiante dédié aux projets techniques, aux ateliers hebdomadaires en laboratoire et au suivi rigoureux des compétences.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span>Accéder à mon espace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Espace connexion</span>
                  </button>

                  <button
                    onClick={() => navigate('/register')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-slate-500" />
                    <span>Demander l’adhésion</span>
                  </button>
                </>
              )}

              <button
                onClick={() => navigate('/vitrine')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/30 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Consulter la vitrine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 aspect-[16/10] lg:aspect-auto bg-slate-100 dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
            <img
              src="/src/assets/images/hero_enspd_tech_hub_1794513911161.jpg"
              alt="Laboratoire technique Club GIT ENSPD"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* 5 Pôles Techniques */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Pôles techniques
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cinq équipes spécialisées ouvertes aux étudiants de l’ENSPD.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {poles.map(pole => (
            <div
              key={pole.name}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                {pole.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {pole.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {pole.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Public Projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Projets récents ({publicProjects.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aperçu public des réalisations en cours au laboratoire.
            </p>
          </div>
          <button
            onClick={() => navigate('/vitrine')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Tout voir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {publicProjects.slice(0, 3).map(proj => (
            <article
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[11px] font-mono text-slate-500 mb-1">
                    {proj.pole} · {proj.status}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {proj.shortDesc}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Lead : {proj.leadName}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {proj.progress}%
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Public Events Preview */}
      {publicEvents.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Prochains événements
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connectez-vous à votre compte membre pour réserver une place.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publicEvents.map(evt => (
              <div
                key={evt.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {evt.type} · {evt.date}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{evt.location}</span>
                  </span>
                  <span className="flex items-center gap-1 tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.registeredCount} / {evt.capacity} places</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
