import React from 'react';
import { Users, Bell, Cctv, LineChart } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { pct, bcls, ini, fmtShort, BUILDINGS } from '../data';

export const Overview: React.FC = () => {
  const { cameras, alerts, schedule, logs, students, setPage, setAnalytab } = useAppContext();

  const total = 65, present = 47, absent = 11, late = 7;
  const onCams = cameras.filter(c => c.status === 'online').length;
  const offCams = cameras.filter(c => c.status === 'offline').length;
  const unresolved = alerts.filter(a => !a.resolved).length;
  const critAlerts = alerts.filter(a => !a.resolved && a.sev === 'critical').length;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-6 gap-2.5">
        <div className="kpi">
          <div className="kpi-top">
            <div><div className="kpi-val text-[var(--green)]">{present}</div><div className="kpi-lbl">Present Today</div><div className="kpi-delta">{pct(present, total)}% of enrolled</div></div>
            <div className="kpi-icon bg-[var(--green-bg)]"><Users className="w-3.5 h-3.5 text-[var(--green)]" /></div>
          </div>
          <div className="kpi-bar bg-[var(--green)]"></div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div><div className="kpi-val text-[var(--red)]">{absent}</div><div className="kpi-lbl">Absent</div><div className="kpi-delta">{pct(absent, total)}% absent</div></div>
            <div className="kpi-icon bg-[var(--red-bg)]"><Users className="w-3.5 h-3.5 text-[var(--red)]" /></div>
          </div>
          <div className="kpi-bar bg-[var(--red)]"></div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div><div className="kpi-val text-[var(--amber)]">{late}</div><div className="kpi-lbl">Late Arrival</div><div className="kpi-delta">After 9:15 AM</div></div>
            <div className="kpi-icon bg-[var(--amber-bg)]"><Bell className="w-3.5 h-3.5 text-[var(--amber)]" /></div>
          </div>
          <div className="kpi-bar bg-[var(--amber)]"></div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div><div className="kpi-val text-[var(--blue)]">{onCams}</div><div className="kpi-lbl">Cameras Online</div><div className="kpi-delta">{offCams} offline today</div></div>
            <div className="kpi-icon bg-[var(--blue-bg)]"><Cctv className="w-3.5 h-3.5 text-[var(--blue)]" /></div>
          </div>
          <div className="kpi-bar bg-[var(--blue)]"></div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div><div className={`kpi-val ${unresolved > 3 ? 'text-[var(--red)]' : 'text-[var(--amber)]'}`}>{unresolved}</div><div className="kpi-lbl">Active Alerts</div><div className="kpi-delta">{critAlerts} critical</div></div>
            <div className="kpi-icon bg-[var(--red-bg)]"><Bell className="w-3.5 h-3.5 text-[var(--red)]" /></div>
          </div>
          <div className="kpi-bar bg-[var(--red)]"></div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <div><div className="kpi-val text-[var(--acc)]">98.7%</div><div className="kpi-lbl">Recognition Accuracy</div><div className="kpi-delta">ArcFace buffalo_l</div></div>
            <div className="kpi-icon bg-[var(--acc-bg)]"><LineChart className="w-3.5 h-3.5 text-[var(--acc)]" /></div>
          </div>
          <div className="kpi-bar bg-[var(--acc)]"></div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-3">
        <div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="card">
              <div className="card-hd"><div className="card-title">Today's Class Schedule</div><button className="btn btn-sm" onClick={() => setPage('attendance')}>Full Schedule</button></div>
              <div className="overflow-x-auto">
                <table className="tbl">
                  <thead><tr><th>Time</th><th>Subject</th><th>Faculty</th><th>Room</th><th>Attendance</th></tr></thead>
                  <tbody>
                    {schedule.slice(0, 4).map((s, i) => (
                      <tr key={i}>
                        <td className="font-mono text-[10px] text-[var(--t3)]">{s.time}</td>
                        <td>
                          <div className="text-xs font-medium">{s.subject}</div>
                        </td>
                        <td className="text-[10px] text-[var(--t3)]">{s.faculty}</td>
                        <td><span className="bg-[var(--s2)] border border-[var(--br2)] rounded px-1.5 py-0.5 text-[10px] font-mono text-[var(--t2)]">{s.room.split('/').pop()?.trim()}</span></td>
                        <td><span className={`badge ${bcls(pct(s.present, s.registered))}`}>{pct(s.present, s.registered)}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-hd"><div className="card-title">Campus Attendance by Building</div></div>
              {BUILDINGS.slice(0, 4).map((b, i) => {
                const v = [91, 83, 76, 88][i];
                return (
                  <div key={i} className="grid grid-cols-[80px_1fr_42px] items-center gap-2.5 text-[11px] mb-2">
                    <div className="text-[11px] text-[var(--t2)] whitespace-nowrap overflow-hidden text-ellipsis">{b.name.split('—')[0].trim()}</div>
                    <div className="prog-tr"><div className="prog-fi" style={{ width: `${v}%`, background: v >= 80 ? 'var(--green)' : v >= 70 ? 'var(--amber)' : 'var(--red)' }}></div></div>
                    <div className="text-[11px] font-mono text-[var(--t2)] text-right">{v}%</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Live Recognition Feed</div><div className="card-sub">{logs.length} events today</div></div>
            <div className="overflow-y-auto max-h-[360px] pr-1">
              {logs.slice(0, 8).map((l, i) => (
                <div key={l.id} className={`fi ${l.fresh ? 'fi-new' : ''}`}>
                  <div className="av w-[26px] h-[26px] text-[9px]" style={{ background: `${l.st.col}18`, color: l.st.col }}>{ini(l.st.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="fi-name">{l.st.name}</div>
                    <div className="fi-meta">{l.st.roll} · {l.cam}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`badge ${l.status === 'present' ? 'bg' : l.status === 'late' ? 'ba' : l.status === 'unknown' ? 'bi' : 'br'}`}>{l.status}</span>
                    <div className="text-[9px] text-[var(--t3)] font-mono mt-0.5">{l.conf}% · {l.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="card-hd"><div className="card-title">System Health</div></div>
            {[
              ['ArcFace Model', 'online'], ['Redis Cache', 'online'], ['PostgreSQL DB', 'online'], 
              ['REST API / SIS', 'online'], ['SMS Gateway', 'online'], ['Email Server', 'online'], 
              ['Edge Nodes (4/4)', 'online'], ['Last Backup', '2h ago']
            ].map(([k, v], i) => (
              <div key={i} className="stat-row">
                <div className="text-[11px] text-[var(--t2)]">{k}</div>
                <span className={`badge ${v === 'online' ? 'bg' : v === '2h ago' ? 'bp' : 'br'}`}>{v}</span>
              </div>
            ))}
          </div>
          
          <div className="card">
            <div className="card-hd">
              <div className="card-title">High-Risk Students</div>
              <span className="badge br">{students.filter(s => s.risk === 'high').length}</span>
            </div>
            {students.filter(s => s.risk === 'high').slice(0, 4).map((s, i) => (
              <div key={i} className="fi">
                <div className="av w-[28px] h-[28px] text-[10px]" style={{ background: `${s.col}18`, color: s.col }}>{ini(s.name)}</div>
                <div className="flex-1 min-w-0">
                  <div className="fi-name text-[11px]">{s.name}</div>
                  <div className="fi-meta">{s.roll}</div>
                </div>
                <span className="badge br">{s.overall}%</span>
              </div>
            ))}
            <button className="btn btn-sm mt-2 w-full justify-center" onClick={() => { setPage('analytics'); setAnalytab('risk'); }}>View All Defaulters</button>
          </div>
          
          <div className="card">
            <div className="card-hd"><div className="card-title">Recent Alerts</div><button className="btn btn-sm" onClick={() => setPage('alerts')}>View All</button></div>
            {alerts.filter(a => !a.resolved).slice(0, 3).map((a, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-[var(--br)] text-[11px] last:border-0">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 mt-px" style={{ background: a.sev === 'critical' ? 'var(--red-bg)' : a.sev === 'warning' ? 'var(--amber-bg)' : 'var(--blue-bg)', color: a.sev === 'critical' ? 'var(--red)' : a.sev === 'warning' ? 'var(--amber)' : 'var(--blue)' }}>
                  {a.sev === 'critical' ? '!' : a.sev === 'warning' ? '⚠' : 'i'}
                </div>
                <div className="flex-1 text-[var(--t2)] leading-[1.4]">{a.msg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
