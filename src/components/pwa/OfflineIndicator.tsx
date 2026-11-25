import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/90 px-3 py-2 text-xs font-medium text-amber-900 dark:text-amber-200 shadow-sm">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>Mode hors ligne — Données en cache affichées</span>
    </div>
  );
};
