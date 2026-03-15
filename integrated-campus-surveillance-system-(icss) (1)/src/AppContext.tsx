import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Camera, Alert, Schedule, Log, genStudents, genCameras, genAlerts, genSchedule, genLogs, choice, randInt } from './data';

interface AppState {
  page: string;
  stab: string;
  analytab: string;
  camLayout: number;
  selectedStudent: Student | null;
  searchQ: string;
  searchDept: string;
  searchYear: string;
  searchRisk: string;
  alertFilter: string;
  paused: boolean;
  darkMode: boolean;
  attDept: string;
  attSection: string;
  attStatus: string;
  camSearch: string;
  camStatusFilter: string;
  stats_present: number;
  students: Student[];
  cameras: Camera[];
  logs: Log[];
  alerts: Alert[];
  schedule: Schedule[];
  cfg: {
    thresh: number; fps: number; antiSpoof: boolean; multiCam: boolean; asyncLog: boolean;
    liveAlert: boolean; smsAlert: boolean; emailAlert: boolean; edgeProc: boolean;
    encryption: boolean; gdpr: boolean; auditLog: boolean; retainDays: number;
    sisEnabled: boolean; erpEnabled: boolean; backupFreq: string;
  };
}

interface AppContextType extends AppState {
  setPage: (page: string) => void;
  setStab: (stab: string) => void;
  setAnalytab: (tab: string) => void;
  setCamLayout: (layout: number) => void;
  setSelectedStudent: (student: Student | null) => void;
  setSearchQ: (q: string) => void;
  setSearchDept: (dept: string) => void;
  setSearchYear: (year: string) => void;
  setSearchRisk: (risk: string) => void;
  setAlertFilter: (filter: string) => void;
  setPaused: (paused: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  flagStudent: (id: string) => void;
  resetLogs: () => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  setAttDept: (v: string) => void;
  setAttSection: (v: string) => void;
  setAttStatus: (v: string) => void;
  setCamSearch: (v: string) => void;
  setCamStatusFilter: (v: string) => void;
  updateCfg: (key: keyof AppState['cfg'], value: any) => void;
  resolveAlert: (id: number) => void;
  resolveAllAlerts: () => void;
  dismissAlert: (id: number) => void;
  addToast: (msg: string, type?: 'info' | 'success' | 'warn' | 'danger') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pausedRef = React.useRef(false);

  const [state, setState] = useState<AppState>(() => {
    const students = genStudents();
    const cameras = genCameras();
    return {
      page: 'overview',
      stab: 'model',
      analytab: 'trends',
      camLayout: 4,
      selectedStudent: null,
      searchQ: '',
      searchDept: 'all',
      searchYear: 'all',
      searchRisk: 'all',
      alertFilter: 'all',
      paused: false,
      darkMode: false,
      attDept: 'all',
      attSection: 'all',
      attStatus: 'all',
      camSearch: '',
      camStatusFilter: 'all',
      stats_present: 47,
      students,
      cameras,
      logs: genLogs(students, cameras),
      alerts: genAlerts(),
      schedule: genSchedule(),
      cfg: {
        thresh: 78, fps: 15, antiSpoof: true, multiCam: true, asyncLog: true,
        liveAlert: true, smsAlert: true, emailAlert: true, edgeProc: true,
        encryption: true, gdpr: true, auditLog: true, retainDays: 90,
        sisEnabled: true, erpEnabled: false, backupFreq: 'daily'
      }
    };
  });

  const [toast, setToast] = useState<{ msg: string; type: string; id: number } | null>(null);

  const addToast = (msg: string, type: 'info' | 'success' | 'warn' | 'danger' = 'info') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1 && !pausedRef.current) {
        setState(prev => {
          if (!prev.students.length) return prev;
          const st: Student = choice(prev.students);
          if (!st) return prev;
          const pool = ['present', 'present', 'present', 'late', 'unknown'] as const;
          const status = choice([...pool]);
          const conf = status === 'unknown' ? randInt(20, 40) : randInt(82, 98);
          const cams = prev.cameras.filter(c => c.status === 'online');
          const cam = cams.length ? choice(cams) : prev.cameras[0];
          
          if (!cam) return prev;

          const newLog: Log = {
            id: Date.now(), st, status, conf,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
            cam: cam.id, room: cam.room || 'Entry', fresh: true
          };

          const newLogs = [newLog, ...prev.logs].slice(0, 80);
          return {
            ...prev,
            logs: newLogs,
            stats_present: status === 'present' ? prev.stats_present + 1 : prev.stats_present
          };
        });
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const updateState = (updates: Partial<AppState>) => setState(prev => ({ ...prev, ...updates }));

  const value: AppContextType = {
    ...state,
    setPage: (page) => updateState({ page, selectedStudent: null }),
    setStab: (stab) => updateState({ stab }),
    setAnalytab: (analytab) => updateState({ analytab }),
    setCamLayout: (camLayout) => updateState({ camLayout }),
    setSelectedStudent: (selectedStudent) => updateState({ selectedStudent }),
    setSearchQ: (searchQ) => updateState({ searchQ }),
    setSearchDept: (searchDept) => updateState({ searchDept }),
    setSearchYear: (searchYear) => updateState({ searchYear }),
    setSearchRisk: (searchRisk) => updateState({ searchRisk }),
    setAlertFilter: (alertFilter) => updateState({ alertFilter }),
    setPaused: (paused) => { pausedRef.current = paused; updateState({ paused }); },
    setDarkMode: (darkMode) => updateState({ darkMode }),
    flagStudent: (id) => setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, flagged: !s.flagged } : s),
      selectedStudent: prev.selectedStudent?.id === id
        ? { ...prev.selectedStudent, flagged: !prev.selectedStudent.flagged }
        : prev.selectedStudent
    })),
    resetLogs: () => setState(prev => ({ ...prev, logs: [] })),
    updateStudent: (id, updates) => setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, ...updates } : s),
      selectedStudent: prev.selectedStudent?.id === id
        ? { ...prev.selectedStudent, ...updates }
        : prev.selectedStudent
    })),
    setAttDept: (attDept) => updateState({ attDept }),
    setAttSection: (attSection) => updateState({ attSection }),
    setAttStatus: (attStatus) => updateState({ attStatus }),
    setCamSearch: (camSearch) => updateState({ camSearch }),
    setCamStatusFilter: (camStatusFilter) => updateState({ camStatusFilter }),
    updateCfg: (key, val) => setState(prev => ({ ...prev, cfg: { ...prev.cfg, [key]: val } })),
    resolveAlert: (id) => setState(prev => ({ ...prev, alerts: prev.alerts.map(a => a.id === id ? { ...a, resolved: true } : a) })),
    resolveAllAlerts: () => setState(prev => ({ ...prev, alerts: prev.alerts.map(a => ({ ...a, resolved: true })) })),
    dismissAlert: (id) => setState(prev => ({ ...prev, alerts: prev.alerts.map(a => a.id === id ? { ...a, resolved: true } : a) })),
    addToast
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-[var(--s1)] text-[var(--t1)] border rounded-lg p-3 text-xs z-[9999] shadow-lg animate-in slide-in-from-bottom-5"
             style={{ borderColor: toast.type === 'success' ? 'var(--green)' : toast.type === 'warn' ? 'var(--amber)' : toast.type === 'danger' ? 'var(--red)' : 'var(--br)' }}>
          {toast.msg}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
