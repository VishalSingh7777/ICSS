import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { fmtDate, pct } from '../data';

const PAGE_LABELS: Record<string, string> = {
  overview: 'Overview',
  monitor: 'Live Monitor',
  cameras: 'Camera Network',
  students: 'Students',
  attendance: 'Attendance',
  analytics: 'Analytics',
  alerts: 'Alerts',
  settings: 'Settings'
};

export const Topbar: React.FC = () => {
  const { page, setPage, cameras, students, alerts, stats_present, darkMode, setDarkMode } = useAppContext();

  const onlineCams = cameras.filter(c => c.status === 'online').length;
  const offlineCams = cameras.filter(c => c.status === 'offline').length;
  const degradedCams = cameras.filter(c => c.status === 'degraded').length;
  const totalCams = cameras.length;
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;
  const pctPresent = pct(stats_present || 47, 65);

  return (
    <div className="h-[52px] bg-[var(--s1)] border-b border-[var(--br)] flex items-center px-5 gap-2.5 shrink-0">
      <div>
        <div className="text-[14px] font-semibold text-[var(--t1)]">{PAGE_LABELS[page] || 'Overview'}</div>
        <div className="text-[11px] text-[var(--t3)] font-mono">{fmtDate()} · Central Campus — Building Complex</div>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-1.5 bg-[var(--acc-bg)] border border-[var(--acc-br)] rounded-full px-2.5 py-1 text-[11px] text-[var(--acc)] font-mono">
        <div className="dot dg blink"></div>{pctPresent}% present today
      </div>
      <div 
        className="flex items-center gap-1.5 bg-[var(--s2)] border border-[var(--br2)] rounded-full px-2.5 py-1 text-[11px] text-[var(--t2)] font-mono cursor-help"
        title={`Online: ${onlineCams}\nDegraded: ${degradedCams}\nOffline: ${offlineCams}`}
      >
        {totalCams} cameras
      </div>
      <div className="flex items-center gap-1.5 bg-[var(--s2)] border border-[var(--br2)] rounded-full px-2.5 py-1 text-[11px] text-[var(--t2)] font-mono">
        {students.length} students enrolled
      </div>
      
      <div 
        className="w-8 h-8 bg-[var(--s2)] border border-[var(--br2)] rounded-[var(--r6)] flex items-center justify-center cursor-pointer text-[var(--t2)] transition-colors hover:border-[var(--br3)] hover:text-[var(--t1)]"
        onClick={() => setDarkMode(!darkMode)}
        title="Toggle Dark Mode"
      >
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </div>

      <div 
        className="w-8 h-8 bg-[var(--s2)] border border-[var(--br2)] rounded-[var(--r6)] flex items-center justify-center cursor-pointer text-[var(--t2)] relative transition-colors hover:border-[var(--br3)] hover:text-[var(--t1)]"
        onClick={() => setPage('alerts')}
        title="Alerts"
      >
        <Bell className="w-4 h-4" />
        {unresolvedAlerts > 0 && (
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--red)] border-[1.5px] border-white"></div>
        )}
      </div>
    </div>
  );
};
