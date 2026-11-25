import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        aria-label="Installer l’application sur votre appareil"
        className={
          compact
            ? 'inline-flex items-center justify-center gap-1.5 min-h-[36px] min-w-[36px] px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0'
            : 'w-full flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap'
        }
        title="Installer l'application sur votre appareil"
      >
        <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span className={compact ? 'hidden min-[380px]:inline' : ''}>
          {compact ? 'Installer' : 'Installer l’app (PWA)'}
        </span>
      </button>

      {showGuideModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
            onClick={() => setShowGuideModal(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    GIT
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Installer Club GIT ENSPD
                    </h3>
                    <p className="text-xs text-slate-500">Accès direct hors-ligne sur votre appareil</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  aria-label="Fermer"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isIOS ? (
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <Share className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      1. Appuyez sur le bouton <strong>Partager</strong> dans la barre de navigation Safari.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <PlusSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      2. Faites défiler et sélectionnez <strong>Sur l’écran d’accueil</strong>.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      Ouvrez le menu de votre navigateur (Chrome, Edge ou Brave) puis sélectionnez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowGuideModal(false)}
                className="mt-5 w-full min-h-[44px] rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Compris
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
