import React from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { ini, clr } from '../data';

export const DetailPanel: React.FC = () => {
  const { selectedStudent: s, setSelectedStudent, addToast, flagStudent, logs } = useAppContext();
  
  if (!s) return null;

  const qmap: Record<number, string> = { 5: 'Excellent', 4: 'Good', 3: 'Fair', 2: 'Low', 1: 'Poor' };

  return (
    <div className="w-[300px] shrink-0 border-l border-[var(--br)] overflow-y-auto bg-[var(--s1)] flex flex-col">
      <div className="p-3.5 border-b border-[var(--br)] sticky top-0 bg-[var(--s1)] z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-semibold tracking-[0.8px] uppercase text-[var(--t3)]">Student Profile</div>
          <button className="btn btn-xs" onClick={() => setSelectedStudent(null)}>
            <X className="w-3 h-3 mr-1" /> Close
          </button>
        </div>
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="av w-11 h-11 text-[15px]" style={{ background: `${s.col}18`, color: s.col }}>{ini(s.name)}</div>
          <div>
            <div className="text-sm font-semibold">{s.name}</div>
            <div className="text-[10px] text-[var(--t3)] font-mono">{s.roll}</div>
            <div className="flex gap-1 mt-1">
              <span className="badge bi">{s.dept}</span>
              <span className="badge bp">Year {s.year} / {s.sec}</span>
              {s.flagged && <span className="badge br">Flagged</span>}
            </div>
          </div>
        </div>
        <div className="bg-[var(--s2)] rounded-[var(--r8)] p-2.5 text-center border border-[var(--br)]">
          <div className="text-[28px] font-semibold font-mono" style={{ color: clr(s.overall) }}>{s.overall}%</div>
          <div className="text-[10px] text-[var(--t3)]">Overall Attendance</div>
          <span className={`badge ${s.risk === 'high' ? 'br' : s.risk === 'medium' ? 'ba' : 'bg'} mt-1.5 inline-block`}>{s.risk} risk</span>
        </div>
      </div>

      <div className="p-3.5 border-b border-[var(--br)]">
        <div className="text-[10px] font-semibold tracking-[0.7px] uppercase text-[var(--t3)] mb-2">Contact Information</div>
        {[
          ['Email', s.email], ['Phone', s.phone], ['Parent Email', s.parentEmail], ['Parent Phone', s.parentPhone]
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1 text-[11px] border-b border-[var(--br)] last:border-0">
            <span className="text-[var(--t3)]">{k}</span>
            <span className="font-mono text-[10px] text-[var(--t1)]">{v}</span>
          </div>
        ))}
      </div>

      <div className="p-3.5 border-b border-[var(--br)]">
        <div className="text-[10px] font-semibold tracking-[0.7px] uppercase text-[var(--t3)] mb-2">Attendance by Subject</div>
        {s.subjects.map(sub => (
          <div key={sub.name} className="flex items-center gap-2 mb-1.5 text-[11px]">
            <div className="flex-1 min-w-0">
              <div className="font-normal whitespace-nowrap overflow-hidden text-ellipsis">{sub.name}</div>
              <div className="prog-mini mt-1"><div className="prog-mini-fi" style={{ width: `${sub.pct}%`, background: clr(sub.pct) }}></div></div>
            </div>
            <div className="font-mono text-[10px] font-medium shrink-0 ml-1.5" style={{ color: clr(sub.pct) }}>{sub.pct}%</div>
          </div>
        ))}
      </div>

      <div className="p-3.5 border-b border-[var(--br)]">
        <div className="text-[10px] font-semibold tracking-[0.7px] uppercase text-[var(--t3)] mb-2">Attendance Heatmap — Last 5 Weeks</div>
        <div className="flex gap-0.5 mb-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} className="flex-1 text-center text-[8px] text-[var(--t4)]">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array(35).fill(0).map((_, i) => {
            if (i % 7 >= 5) return <div key={i} className="aspect-square rounded-[2px] bg-[var(--s2)] border border-[var(--br)]"></div>;
            const r2 = (i * 13 + s.id.charCodeAt(0)) % 100;
            const pval = s.overall;
            const col = r2 < pval ? 'var(--green)' : r2 < pval + 15 ? 'var(--amber)' : 'var(--red)';
            return <div key={i} className="aspect-square rounded-[2px]" style={{ background: col, opacity: r2 < pval ? 1 : 0.6 }} title={r2 < pval ? 'Present' : r2 < pval + 15 ? 'Late' : 'Absent'}></div>;
          })}
        </div>
        <div className="flex gap-2 mt-1.5 text-[9px] text-[var(--t3)]">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-[var(--green)]"></div>Present</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-[var(--amber)] opacity-60"></div>Late</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-[2px] bg-[var(--red)] opacity-60"></div>Absent</div>
        </div>
      </div>

      <div className="p-3.5 border-b border-[var(--br)]">
        <div className="text-[10px] font-semibold tracking-[0.7px] uppercase text-[var(--t3)] mb-2">Enrollment Quality</div>
        <div className="flex items-center justify-between text-[11px]">
          <div>
            <div className="font-medium">{s.photos} photos enrolled</div>
            <div className="text-[10px] text-[var(--t3)]">ArcFace embedding quality</div>
          </div>
          <span className={`badge ${s.photos >= 4 ? 'bg' : s.photos >= 3 ? 'ba' : 'br'}`}>{qmap[s.photos] || 'Poor'}</span>
        </div>
        <div className="flex gap-1 mt-1.5">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-[2px]" style={{ background: i < s.photos ? 'var(--green)' : 'var(--s3)' }}></div>
          ))}
        </div>
      </div>

      <div className="p-3.5 border-b border-[var(--br)]">
        <div className="text-[10px] font-semibold tracking-[0.7px] uppercase text-[var(--t3)] mb-2">Recent Detections</div>
        {logs.filter(l => l.st.id === s.id).slice(0, 4).map((l, i) => (
          <div key={i} className="flex items-center gap-2 py-1 border-b border-[var(--br)] last:border-0 text-[11px]">
            <span className={`badge ${l.status === 'present' ? 'bg' : l.status === 'late' ? 'ba' : 'bi'} text-[8px]`}>{l.status}</span>
            <span className="font-mono text-[10px] text-[var(--t3)]">{l.time}</span>
            <span className="text-[10px] text-[var(--t2)] ml-auto">{l.cam} · {l.conf}%</span>
          </div>
        ))}
        {logs.filter(l => l.st.id === s.id).length === 0 && (
          <div className="text-[11px] text-[var(--t3)]">No detections recorded yet</div>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex flex-col gap-1.5">
          <button className="btn btn-p justify-center w-full" onClick={() => addToast(`Generating attendance report for ${s.name}...`, 'success')}>Generate Attendance Report</button>
          <button className="btn justify-center w-full" onClick={() => addToast(`Alert sent to ${s.name}`, 'success')}>Send Alert to Student</button>
          <button className="btn justify-center w-full" onClick={() => addToast(`SMS sent to parent of ${s.name}`, 'success')}>Notify Parent</button>
          <button className={`btn ${s.flagged ? 'btn-p' : 'btn-d'} justify-center w-full`} onClick={() => {
            flagStudent(s.id);
            addToast(`${s.name} ${s.flagged ? 'unflagged' : 'flagged'}`, 'warn');
          }}>{s.flagged ? 'Remove Flag' : 'Flag Student'}</button>
        </div>
      </div>
    </div>
  );
};
