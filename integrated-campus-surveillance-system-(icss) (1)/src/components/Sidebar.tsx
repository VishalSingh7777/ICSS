import React from 'react';
import { LayoutDashboard, MonitorPlay, Cctv, Users, ClipboardCheck, LineChart, Bell, Settings } from 'lucide-react';
import { useAppContext } from '../AppContext';

const PAGES = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'Dashboard' },
  { id: 'monitor', label: 'Live Monitor', icon: MonitorPlay, section: 'Surveillance' },
  { id: 'cameras', label: 'Camera Network', icon: Cctv, section: 'Surveillance' },
  { id: 'students', label: 'Students', icon: Users, section: 'People' },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, section: 'Records' },
  { id: 'analytics', label: 'Analytics', icon: LineChart, section: 'Insights' },
  { id: 'alerts', label: 'Alerts', icon: Bell, section: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'System' }
];

export const Sidebar: React.FC = () => {
  const { page, setPage, cameras, alerts, cfg } = useAppContext();

  const onlineCams = cameras.filter(c => c.status === 'online').length;
  const totalCams = cameras.length;
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;
  const critAlerts = alerts.filter(a => !a.resolved && a.sev === 'critical').length;

  const sections = PAGES.reduce((acc, p) => {
    if (!acc[p.section]) acc[p.section] = [];
    acc[p.section].push(p);
    return acc;
  }, {} as Record<string, typeof PAGES>);

  return (
    <div className="w-[216px] shrink-0 bg-[var(--s1)] border-r border-[var(--br)] flex flex-col overflow-hidden">
      <div className="p-4 pb-3.5 border-b border-[var(--br)]">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-[var(--r8)] bg-gradient-to-br from-[#D85A30] to-[#993C1D] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 17v.01" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-[var(--t1)] tracking-[-0.2px] leading-[1.2] pr-1">Integrated Campus Surveillance System (ICSS)</div>
            <div className="text-[9px] text-[var(--t3)] font-mono mt-0.5">ArcFace Engine</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {Object.entries(sections).map(([sec, pages]) => (
          <div key={sec}>
            <div className="px-3 pt-3 pb-1 text-[9px] font-semibold tracking-[1.2px] uppercase text-[var(--t4)]">{sec}</div>
            {pages.map(p => {
              const Icon = p.icon;
              const isActive = page === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setPage(p.id)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 mx-2 rounded-[var(--r6)] cursor-pointer text-[12.5px] transition-all select-none border border-transparent ${
                    isActive 
                      ? 'bg-[var(--acc-bg)] border-[var(--acc-br)] text-[var(--acc)] font-medium' 
                      : 'text-[var(--t2)] hover:bg-[var(--s2)] hover:text-[var(--t1)]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-65'}`} />
                  <span>{p.label}</span>
                  {p.id === 'alerts' && unresolvedAlerts > 0 && (
                    <span className={`ml-auto text-white text-[9px] font-semibold px-1.5 py-px rounded-lg font-mono ${critAlerts ? 'bg-[var(--red)]' : 'bg-[var(--amber)]'}`}>
                      {unresolvedAlerts}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-auto p-3 border-t border-[var(--br)]">
        <div className="bg-[var(--s2)] border border-[var(--br)] rounded-[var(--r8)] p-2.5">
          <div className="text-[9px] text-[var(--t3)] tracking-[0.8px] uppercase mb-2">System Status</div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--t2)] mb-1">
            <div className="dot dg blink"></div>ArcFace model — online
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--t2)] mb-1">
            <div className={`dot ${onlineCams < totalCams ? 'da' : 'dg'} blink`} style={{ animationDelay: '.4s' }}></div>
            {onlineCams}/{totalCams} cameras active
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--t2)] mb-1">
            <div className={`dot ${cfg.antiSpoof ? 'dg' : 'da'}`}></div>Anti-spoof {cfg.antiSpoof ? 'enabled' : 'disabled'}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--t2)] mb-1">
            <div className="dot dg"></div>DB synced · API online
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--t2)]">
            <div className={`dot ${cfg.sisEnabled ? 'dg' : 'da'}`}></div>SIS integration {cfg.sisEnabled ? 'active' : 'inactive'}
          </div>
        </div>
      </div>
    </div>
  );
};
