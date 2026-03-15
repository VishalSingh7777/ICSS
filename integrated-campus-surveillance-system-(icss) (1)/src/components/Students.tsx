import React from 'react';
import { useAppContext } from '../AppContext';
import { DEPTS, ini, clr, fmtShort } from '../data';

export const Students: React.FC = () => {
  const { 
    students, searchQ, setSearchQ, searchDept, setSearchDept, 
    searchYear, setSearchYear, searchRisk, setSearchRisk,
    selectedStudent, setSelectedStudent, addToast
  } = useAppContext();

  const filtered = students.filter(s => {
    if (searchQ && !s.name.toLowerCase().includes(searchQ.toLowerCase()) && !s.roll.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (searchDept !== 'all' && s.dept !== searchDept) return false;
    if (searchYear !== 'all' && s.year !== parseInt(searchYear)) return false;
    if (searchRisk !== 'all' && s.risk !== searchRisk) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <input 
          className="inp w-[200px]" 
          placeholder="Search name or roll no..." 
          value={searchQ} 
          onChange={e => setSearchQ(e.target.value)} 
        />
        <select className="inp w-[110px]" value={searchDept} onChange={e => setSearchDept(e.target.value)}>
          <option value="all">All Depts</option>
          {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="inp w-[100px]" value={searchYear} onChange={e => setSearchYear(e.target.value)}>
          <option value="all">All Years</option>
          {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select className="inp w-[110px]" value={searchRisk} onChange={e => setSearchRisk(e.target.value)}>
          <option value="all">All Risk</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
        <div className="ml-auto flex gap-1.5 items-center">
          <span className="text-[11px] text-[var(--t3)]">{filtered.length} students</span>
          <button className="btn btn-sm" onClick={() => addToast('Student directory exported as CSV', 'success')}>Export CSV</button>
          <button className="btn btn-sm btn-p" onClick={() => addToast('Navigate to student portal to enroll', 'warn')}>+ Enroll Student</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr><th>Student</th><th>Roll No.</th><th>Dept</th><th>Year / Sec</th><th>Attendance</th><th>Risk</th><th>Last Seen</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-6 text-[var(--t3)] text-xs">No students match the current filters</td></tr>
              )}
              {filtered.map(s => (
                <tr 
                  key={s.id} 
                  className={selectedStudent?.id === s.id ? 'sel' : ''} 
                  onClick={() => setSelectedStudent(selectedStudent?.id === s.id ? null : s)}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="av w-7 h-7 text-[10px]" style={{ background: `${s.col}18`, color: s.col }}>{ini(s.name)}</div>
                      <div>
                        <div className="text-xs font-medium">{s.name}</div>
                        <div className="text-[10px] text-[var(--t3)]">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-[10px] text-[var(--t2)]">{s.roll}</td>
                  <td><span className="badge bi">{s.dept}</span></td>
                  <td className="text-[11px]">Year {s.year} / {s.sec}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="prog-mini w-[52px]"><div className="prog-mini-fi" style={{ width: `${s.overall}%`, background: clr(s.overall) }}></div></div>
                      <span className="font-mono text-[10px] font-medium" style={{ color: clr(s.overall) }}>{s.overall}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${s.risk === 'high' ? 'br' : s.risk === 'medium' ? 'ba' : 'bg'}`}>{s.risk}</span></td>
                  <td className="text-[10px] text-[var(--t3)] font-mono">{fmtShort(s.lastSeen)}</td>
                  <td>{s.flagged ? <span className="badge br">Flagged</span> : <span className="badge bg">Active</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
