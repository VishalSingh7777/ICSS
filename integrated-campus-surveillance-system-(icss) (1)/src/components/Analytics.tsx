import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../AppContext';
import { pct, clr, bcls, ini } from '../data';

export const Analytics: React.FC = () => {
  const { analytab, setAnalytab, students, addToast } = useAppContext();

  const renderTrends = () => {
    const days7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const vals = [91, 87, 95, 78, 88, 82, 90];
    const trendData = days7.map((d, i) => ({ name: d, value: vals[i] }));
    
    const semVals = [82, 79, 85, 88, 91, 84, 87, 80, 83, 90, 88, 85, 79, 82, 87];
    const semData = semVals.map((v, i) => ({ name: `W${i+1}`, value: v }));

    return (
      <>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="card">
            <div className="card-hd">
              <div className="card-title">7-Day Attendance Trend</div>
              <select className="inp w-[120px] text-[11px]"><option>Last 7 days</option><option>Last 30 days</option><option>This Semester</option></select>
            </div>
            <div className="h-[160px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--s3)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--t3)' }} />
                  <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--t3)' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid var(--br)', backgroundColor: 'var(--s1)', color: 'var(--t1)' }} />
                  <Line type="monotone" dataKey="value" stroke="var(--acc)" strokeWidth={2} dot={{ r: 3, fill: 'var(--acc)' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Semester Trend (Weekly)</div></div>
            <div className="h-[160px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={semData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--s3)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--t3)' }} />
                  <YAxis domain={[70, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--t3)' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid var(--br)', backgroundColor: 'var(--s1)', color: 'var(--t1)' }} />
                  <Line type="monotone" dataKey="value" stroke="var(--green)" strokeWidth={2} dot={{ r: 3, fill: 'var(--green)' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="card">
            <div className="card-hd"><div className="card-title">Best Performing Day</div></div>
            {days7.map((d, i) => (
              <div key={d} className="flex items-center gap-2 mb-1.5 text-[11px]">
                <div className="w-7 text-[var(--t3)] shrink-0">{d}</div>
                <div className="prog-tr flex-1"><div className="prog-fi" style={{ width: `${vals[i]}%`, background: vals[i] >= 85 ? 'var(--green)' : vals[i] >= 75 ? 'var(--amber)' : 'var(--red)' }}></div></div>
                <div className="font-mono text-[10px] min-w-[30px] text-right font-medium" style={{ color: vals[i] >= 85 ? 'var(--green)' : vals[i] >= 75 ? 'var(--amber)' : 'var(--red)' }}>{vals[i]}%</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Hour-wise Arrivals</div></div>
            {[
              ['8:30–9:00', 'Early', '12%'], ['9:00–9:15', 'On Time', '61%'], 
              ['9:15–9:30', 'Slightly Late', '18%'], ['9:30–10:00', 'Late', '7%'], ['10:00+', 'Very Late', '2%']
            ].map(([t, l, v]) => (
              <div key={t} className="flex items-center gap-2 mb-1.5 text-[11px]">
                <div className="w-[72px] font-mono text-[9px] text-[var(--t3)] shrink-0">{t}</div>
                <div className="prog-tr flex-1"><div className="prog-fi" style={{ width: v, background: 'var(--acc)' }}></div></div>
                <div className="font-mono text-[10px] min-w-[30px] text-right">{v}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Key Stats</div></div>
            {[
              ['Avg this week', '87.3%'], ['Best day (Wed)', '95%'], ['Worst day (Thu)', '78%'], 
              ['Semester avg', '84.2%'], ['Recognition accuracy', '98.7%'], ['Spoof attempts blocked', '14'], 
              ['Unknown faces today', '4'], ['Parent alerts sent', '7']
            ].map(([k, v]) => (
              <div key={k} className="stat-row"><span className="text-[var(--t3)] text-[11px]">{k}</span><span className="font-mono text-[11px] font-medium">{v}</span></div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderComparison = () => {
    const deptStats = [
      { dept: 'CSE', att: 91, students: 72, defaulters: 4 },
      { dept: 'ECE', att: 85, students: 61, defaulters: 7 },
      { dept: 'ME', att: 79, students: 58, defaulters: 10 },
      { dept: 'CE', att: 76, students: 44, defaulters: 9 },
      { dept: 'IT', att: 88, students: 55, defaulters: 5 }
    ];

    return (
      <>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="card">
            <div className="card-hd"><div className="card-title">Department-wise Attendance</div></div>
            <div className="h-[160px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptStats} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--s3)" />
                  <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--t3)' }} />
                  <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--t3)' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid var(--br)', backgroundColor: 'var(--s1)', color: 'var(--t1)' }} cursor={{ fill: 'var(--acc-bg)' }} />
                  <Bar dataKey="att" fill="var(--acc)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Department Breakdown</div></div>
            <table className="tbl">
              <thead><tr><th>Department</th><th>Enrolled</th><th>Present</th><th>Defaulters</th><th>Avg Att.</th></tr></thead>
              <tbody>
                {deptStats.map(d => (
                  <tr key={d.dept}>
                    <td><span className="badge bi">{d.dept}</span></td>
                    <td className="font-mono text-[11px]">{d.students}</td>
                    <td className="font-mono text-[11px] text-[var(--green)]">{Math.round(d.students * d.att / 100)}</td>
                    <td className="font-mono text-[11px] text-[var(--red)]">{d.defaulters}</td>
                    <td><span className={`badge ${bcls(d.att)}`}>{d.att}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="card">
            <div className="card-hd"><div className="card-title">Section Comparison</div></div>
            {['A', 'B', 'C'].map((sec, i) => {
              const v = [89, 84, 78][i];
              return (
                <div key={sec} className="grid grid-cols-[80px_1fr_42px] items-center gap-2.5 text-[11px] mb-2">
                  <div className="text-[11px] text-[var(--t2)]">Section {sec}</div>
                  <div className="prog-tr"><div className="prog-fi" style={{ width: `${v}%`, background: clr(v) }}></div></div>
                  <div className="font-mono text-[10px] text-right font-medium" style={{ color: clr(v) }}>{v}%</div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Year-wise Performance</div></div>
            {[1, 2, 3, 4].map((yr, i) => {
              const v = [88, 85, 80, 83][i];
              return (
                <div key={yr} className="grid grid-cols-[80px_1fr_42px] items-center gap-2.5 text-[11px] mb-2">
                  <div className="text-[11px] text-[var(--t2)]">Year {yr}</div>
                  <div className="prog-tr"><div className="prog-fi" style={{ width: `${v}%`, background: clr(v) }}></div></div>
                  <div className="font-mono text-[10px] text-right font-medium" style={{ color: clr(v) }}>{v}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const renderRisk = () => {
    const defaulters = [...students].filter(s => s.overall < 75).sort((a, b) => a.overall - b.overall);
    const highRisk = students.filter(s => s.risk === 'high');

    return (
      <>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="kpi"><div className="kpi-val text-[var(--red)]">{defaulters.length}</div><div className="kpi-lbl">Defaulters (&lt;75%)</div><div className="kpi-delta">SMS sent to all parents</div><div className="kpi-bar bg-[var(--red)]"></div></div>
          <div className="kpi"><div className="kpi-val text-[var(--amber)]">{highRisk.length}</div><div className="kpi-lbl">High Risk Students</div><div className="kpi-delta">Immediate intervention needed</div><div className="kpi-bar bg-[var(--amber)]"></div></div>
          <div className="kpi"><div className="kpi-val text-[var(--blue)]">{students.filter(s => s.risk === 'medium').length}</div><div className="kpi-lbl">Medium Risk</div><div className="kpi-delta">Under monitoring</div><div className="kpi-bar bg-[var(--blue)]"></div></div>
        </div>
        <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-3">
          <div className="card p-0 overflow-hidden">
            <div className="p-2.5 border-b border-[var(--br)] flex items-center justify-between bg-[var(--s2)]">
              <div className="card-title">Defaulters List — Attendance &lt; 75%</div>
              <button className="btn btn-sm" onClick={() => addToast('Bulk SMS sent to all defaulters\' parents', 'success')}>Send Bulk SMS</button>
            </div>
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead><tr><th>Student</th><th>Dept</th><th>Overall</th><th>Worst Subject</th><th>Risk</th><th>Actions</th></tr></thead>
                <tbody>
                  {defaulters.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-6 text-[var(--t3)] text-xs">No defaulters found</td></tr>
                  )}
                  {defaulters.map(s => {
                    const worst = s.subjects.reduce((a, b) => a.pct < b.pct ? a : b);
                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="av w-6 h-6 text-[9px]" style={{ background: `${s.col}18`, color: s.col }}>{ini(s.name)}</div>
                            <div>
                              <div className="text-[11px] font-medium">{s.name}</div>
                              <div className="text-[9px] text-[var(--t3)]">{s.roll}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge bi">{s.dept}</span></td>
                        <td><span className="badge br">{s.overall}%</span></td>
                        <td><div className="text-[10px]">{worst.name}<br/><span className="text-[var(--red)] font-mono">{worst.pct}%</span></div></td>
                        <td><span className={`badge ${s.risk === 'high' ? 'br' : 'ba'}`}>{s.risk}</span></td>
                        <td>
                          <div className="flex gap-1">
                            <button className="btn btn-xs" onClick={() => addToast('Alert sent', 'success')}>Alert</button>
                            <button className="btn btn-xs" onClick={() => addToast('Parent SMS sent', 'success')}>Parent SMS</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="card">
              <div className="card-hd"><div className="card-title">Risk Distribution</div></div>
              {[
                ['High Risk (<65%)', 'br', highRisk.length], 
                ['Medium Risk (65–74%)', 'ba', students.filter(s => s.risk === 'medium').length], 
                ['Low Risk (≥75%)', 'bg', students.filter(s => s.risk === 'low').length]
              ].map(([l, cls, n], i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--br)] text-xs last:border-0">
                  <span className="text-[var(--t2)]">{l}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`badge ${cls}`}>{n}</span>
                    <span className="text-[10px] text-[var(--t3)]">{pct(n as number, students.length)}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-hd"><div className="card-title">Predictive Alerts</div></div>
              <div className="bg-[var(--s2)] border border-[var(--br)] rounded-[var(--r6)] p-2 text-[11px] text-[var(--t2)] leading-[1.6] mb-2">
                <strong>AI Insight:</strong> 3 students showing declining trend over last 2 weeks. At current rate, they will fall below 75% threshold within 5 days.
              </div>
              {students.slice(14, 17).map(s => (
                <div key={s.id} className="fi">
                  <div className="av w-[26px] h-[26px] text-[9px]" style={{ background: `${s.col}18`, color: s.col }}>{ini(s.name)}</div>
                  <div className="flex-1">
                    <div className="text-[11px] font-medium">{s.name}</div>
                    <div className="text-[10px] text-[var(--t3)]">{s.overall}% → projected 70% in 5d</div>
                  </div>
                  <button className="btn btn-xs btn-d" onClick={() => addToast('Warning sent', 'success')}>Warn</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="stabs">
        {['trends', 'comparison', 'risk'].map(t => (
          <div key={t} className={`stab ${analytab === t ? 'active' : ''}`} onClick={() => setAnalytab(t)}>
            {{ trends: 'Attendance Trends', comparison: 'Department Analysis', risk: 'Risk & Defaulters' }[t]}
          </div>
        ))}
      </div>
      {analytab === 'trends' ? renderTrends() : analytab === 'comparison' ? renderComparison() : renderRisk()}
    </div>
  );
};
