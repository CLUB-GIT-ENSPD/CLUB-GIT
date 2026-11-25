import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, Users, Clock, Check } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { events, registeredEventIds, registerEvent } = useApp();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Événements & Ateliers
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ateliers pratiques, conférences techniques et hackathon annuel du club.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {events.map(event => {
          const isRegistered = registeredEventIds.includes(event.id);
          const isFull = event.registeredCount >= event.capacity;

          return (
            <div
              key={event.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mb-2">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{event.type}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.time}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    {event.speaker && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Animation : {event.speaker}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Participants</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    {event.registeredCount} / {event.capacity}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                  />
                </div>

                <button
                  onClick={() => registerEvent(event.id)}
                  disabled={isRegistered || isFull}
                  className={`w-full min-h-[44px] px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isRegistered
                      ? 'bg-emerald-600 text-white cursor-default'
                      : isFull
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Inscription confirmée</span>
                    </>
                  ) : isFull ? (
                    <span>Complet</span>
                  ) : (
                    <span>Réserver ma place</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
