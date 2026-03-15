import React from 'react';
import { useAppContext } from '../AppContext';
import { fmtShort } from '../data';

export const Alerts: React.FC = () => {
  const { alerts, alertFilter, setAlertFilter, resolveAlert, resolveAllAlerts, dismissAlert, cfg, updateCfg, addToast } = useAppContext();

  const filters = ['all', 'critical', 'warning', 'info', 'resolved'];
  
  const filtered = alerts.filter(a => {
    if (alertFilter === 'resolved') return a.resolved;
    if (alertFilter === 'all') return !a.resolved;
    return !a.resolved && a.sev === alertFilter;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="stabs mb-0">
          {filters.map(f => (
            <div key={f} className={`stab ${alertFilter === f ? 'active' : ''}`} onClick={() => setAlertFilter(f as any)}>
              {{ all: 'Active', critical: 'Critical', warning: 'Warning', info: 'Info', resolved: 'Resolved' }[f]}
            </div>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          <button className="btn btn-sm" onClick={() => { resolveAllAlerts(); addToast('All alerts resolved', 'success'); }}>Resolve All</button>
          <button className="btn btn-sm btn-p" onClick={() => addToast('Alert rules config opened')}>Alert Rules</button>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-3">
        <div className="card">
          <div className="card-hd"><div className="card-title">Alerts ({filtered.length})</div></div>
          {filtered.length === 0 && <div className="text-center p-7 text-[var(--t3)] text-xs">No alerts in this category</div>}
          {filtered.map(a => (
            <div key={a.id} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--br)] last:border-0">
              <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 mt-px text-[11px]" style={{ background: a.sev === 'critical' ? 'var(--red-bg)' : a.sev === 'warning' ? 'var(--amber-bg)' : 'var(--blue-bg)', color: a.sev === 'critical' ? 'var(--red)' : a.sev === 'warning' ? 'var(--amber)' : 'var(--blue)' }}>
                {a.sev === 'critical' ? '!' : a.sev === 'warning' ? '⚠' : 'i'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium mb-0.5">{a.msg}</div>
                <div className="text-[10px] text-[var(--t3)] font-mono">{fmtShort(a.timestamp)} · {a.type.replace('_', ' ')}</div>
                {a.resolved && <span className="badge bg mt-1 inline-block">Resolved</span>}
              </div>
              {!a.resolved && (
                <div className="flex flex-col gap-1 shrink-0">
                  <button className="btn btn-xs bg" onClick={() => { resolveAlert(a.id); addToast('Alert resolved', 'success'); }}>Resolve</button>
                  <button className="btn btn-xs btn-d" onClick={() => { dismissAlert(a.id); addToast('Alert dismissed'); }}>Dismiss</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="card-hd"><div className="card-title">Alert Summary</div></div>
            {[
              ['Critical (unresolved)', alerts.filter(a => !a.resolved && a.sev === 'critical').length, 'br'],
              ['Warnings (unresolved)', alerts.filter(a => !a.resolved && a.sev === 'warning').length, 'ba'],
              ['Info (unresolved)', alerts.filter(a => !a.resolved && a.sev === 'info').length, 'bi'],
              ['Resolved today', alerts.filter(a => a.resolved).length, 'bg'],
              ['Total today', alerts.length, 'bp']
            ].map(([k, v, c], i) => (
              <div key={i} className="stat-row"><span className="text-[11px] text-[var(--t2)]">{k}</span><span className={`badge ${c}`}>{v}</span></div>
            ))}
          </div>

          <div className="card">
            <div className="card-hd"><div className="card-title">Alert Rules</div></div>
            {[
              ['Unknown face detected', 'Critical', true],
              ['Spoof attempt blocked', 'Critical', true],
              ['Camera offline >5min', 'Critical', true],
              ['Student below 75%', 'Warning', true],
              ['Student absent 3 days', 'Warning', true],
              ['Camera degraded FPS', 'Warning', true],
              ['Daily backup complete', 'Info', true],
              ['SIS sync complete', 'Info', true]
            ].map(([r, sev, st], i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[var(--br)] text-[11px] last:border-0">
                <div className="flex-1">
                  <div>{r}</div>
                  <span className={`badge ${sev === 'Critical' ? 'br' : sev === 'Warning' ? 'ba' : 'bi'} mt-1 inline-block`}>{sev}</span>
                </div>
                <button className={`tog ${st ? 'on' : 'off'}`} onClick={(e) => { e.currentTarget.classList.toggle('on'); e.currentTarget.classList.toggle('off'); addToast('Alert rule updated'); }}></button>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-hd"><div className="card-title">Notification Channels</div></div>
            {[
              ['In-App Alerts', true, 'liveAlert'],
              ['SMS Gateway', cfg.smsAlert, 'smsAlert'],
              ['Email Notifications', cfg.emailAlert, 'emailAlert'],
              ['Push Notifications', true, 'liveAlert']
            ].map(([k, v, key], i) => (
              <div key={i} className="set-row">
                <div className="set-lbl">{k}</div>
                <button className={`tog ${v ? 'on' : 'off'}`} onClick={() => { updateCfg(key as any, !v); addToast('Notification setting saved'); }}></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
