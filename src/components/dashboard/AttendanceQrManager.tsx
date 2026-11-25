import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { Scan, Camera, Download, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

interface AttendanceQrManagerProps {
  mode?: 'scanner' | 'censeur';
}

export const AttendanceQrManager: React.FC<AttendanceQrManagerProps> = ({ mode }) => {
  const {
    currentUser,
    sessions,
    attendances,
    createSession,
    toggleSessionState,
    recordAttendanceScan,
  } = useApp();

  const [newTitle, setNewTitle] = useState('Séance hebdomadaire · Labo 304');
  const [newLocation, setNewLocation] = useState('Labo Info 304 · ENSPD');
  const [newPoints, setNewPoints] = useState(20);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scanInput, setScanInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  const isCenseurOrAdmin =
    mode === 'censeur' ||
    (mode !== 'scanner' && (currentUser?.role === 'censeur' || currentUser?.role === 'admin'));

  const activeSession = sessions.find(s => s.active) || sessions[0];
  const currentDisplayedSession = sessions.find(s => s.id === selectedSessionId) || activeSession;

  useEffect(() => {
    if (!selectedSessionId && sessions[0]?.id) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  useEffect(() => {
    if (canvasRef.current && currentDisplayedSession && isCenseurOrAdmin) {
      QRCode.toCanvas(
        canvasRef.current,
        currentDisplayedSession.qrCodeValue,
        {
          width: 200,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [currentDisplayedSession, isCenseurOrAdmin]);

  if (!currentUser) return null;

  const handleMemberScan = async (tokenToUse?: string) => {
    setIsScanningSimulated(true);
    setScanFeedback(null);
    const res = await recordAttendanceScan(tokenToUse || scanInput || activeSession?.qrCodeValue || '');
    setIsScanningSimulated(false);
    setScanFeedback(res);
    setScanInput('');
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const s = await createSession({
      title: newTitle,
      location: newLocation,
      pointsAwarded: newPoints,
    });
    if (s) setSelectedSessionId(s.id);
  };

  const exportCsv = () => {
    const records = attendances.filter(a => a.sessionId === currentDisplayedSession?.id);
    const headers = 'ID,Nom,Matricule,Horodatage,Statut,Points\n';
    const rows = records.map(r =>
      `"${r.id}","${r.userName}","${r.userMatricule}","${r.timestamp}","${r.status}","${r.pointsEarned}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `emargement_${currentDisplayedSession?.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sessionRecords = attendances.filter(a => a.sessionId === currentDisplayedSession?.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isCenseurOrAdmin ? 'Contrôle des présences (Censeur)' : 'Pointage de présence QR'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isCenseurOrAdmin
              ? 'Générez le QR code de séance et exportez la feuille d’émargement.'
              : 'Validez votre présence au laboratoire à partir du code projeté par le censeur.'}
          </p>
        </div>

        {activeSession && (
          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between sm:justify-start gap-3">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                {activeSession.title}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {activeSession.location} · +{activeSession.pointsAwarded} pts
              </div>
            </div>
            <span className={`text-[11px] font-mono font-semibold ${activeSession.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {activeSession.active ? 'Ouverte' : 'Fermée'}
            </span>
          </div>
        )}
      </div>

      {isCenseurOrAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-xs font-medium text-slate-500 mb-3">
                QR Code de séance
              </div>
              <div className="inline-block p-3 rounded-xl bg-white border border-slate-200 mx-auto">
                <canvas ref={canvasRef} className="mx-auto" />
              </div>
              <div className="mt-2.5 text-[11px] font-mono text-slate-500 truncate">
                {currentDisplayedSession?.qrCodeValue}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => currentDisplayedSession && toggleSessionState(currentDisplayedSession.id)}
                  className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    currentDisplayedSession?.active
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {currentDisplayedSession?.active ? 'Clôturer' : 'Rouvrir'}
                </button>
                <button
                  onClick={exportCsv}
                  className="min-h-[44px] px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-slate-500" />
                <span>Nouvelle séance</span>
              </h3>
              <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Intitulé</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Lieu</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Points</label>
                    <input
                      type="number"
                      value={newPoints}
                      onChange={(e) => setNewPoints(Number(e.target.value))}
                      className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[44px] py-2 text-xs font-semibold text-white dark:text-slate-950 bg-slate-900 dark:bg-white rounded-xl hover:opacity-90"
                >
                  Ouvrir la séance
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Émargements ({sessionRecords.length})
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{currentDisplayedSession?.title}</p>
                </div>

                <select
                  aria-label="Choisir une séance"
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="min-h-[38px] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>{s.date} · {s.title}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Membre</th>
                      <th className="py-2.5 px-3">Matricule</th>
                      <th className="py-2.5 px-3">Heure</th>
                      <th className="py-2.5 px-3">Statut</th>
                      <th className="py-2.5 px-3 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sessionRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          Aucun émargement enregistré pour cette séance.
                        </td>
                      </tr>
                    ) : (
                      sessionRecords.map(rec => (
                        <tr key={rec.id}>
                          <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">{rec.userName}</td>
                          <td className="py-3 px-3 font-mono text-slate-500">{rec.userMatricule}</td>
                          <td className="py-3 px-3 font-mono text-slate-500 tabular-nums">
                            {new Date(rec.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px]">
                            <span className={rec.status === 'Présent' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}>
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                            +{rec.pointsEarned} pts
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="relative aspect-[16/10] max-w-md mx-auto rounded-xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border border-slate-800 text-white p-6">
                <div className="absolute inset-8 border border-dashed border-slate-600 rounded-lg pointer-events-none" />
                {isScanningSimulated ? (
                  <div className="text-center space-y-2 z-10">
                    <Camera className="w-8 h-8 text-indigo-400 mx-auto" />
                    <div className="text-xs font-mono text-slate-300">Lecture du QR code...</div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 z-10">
                    <Scan className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs text-slate-400">Zone de scan prête</div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleMemberScan(activeSession?.qrCodeValue)}
                disabled={isScanningSimulated || !activeSession?.active}
                className="w-full min-h-[48px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Scan className="w-4 h-4" />
                <span>
                  {activeSession?.active
                    ? `Valider ma présence (+${activeSession.pointsAwarded} pts)`
                    : 'Aucune séance ouverte'}
                </span>
              </button>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                  Saisie manuelle du code de séance
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="CLUBGIT_ENSPD_..."
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    className="flex-1 min-h-[44px] px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleMemberScan()}
                    className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Valider
                  </button>
                </div>
              </div>

              {scanFeedback && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  scanFeedback.success
                    ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : 'border-amber-200 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                }`}>
                  {scanFeedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{scanFeedback.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Mes présences
                </h3>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  Assiduité : {currentUser.attendanceRate}%
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendances
                  .filter(a => a.userId === currentUser.id)
                  .map(record => (
                    <div key={record.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-3">
                        <div className="font-medium text-slate-900 dark:text-white truncate">
                          {record.sessionTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {new Date(record.timestamp).toLocaleDateString()} · {new Date(record.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          +{record.pointsEarned} pts
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{record.status}</div>
                      </div>
                    </div>
                  ))}
                {attendances.filter(a => a.userId === currentUser.id).length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Aucune présence enregistrée récemment.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
