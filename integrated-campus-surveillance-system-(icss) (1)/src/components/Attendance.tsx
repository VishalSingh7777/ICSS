import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { DEPTS, SUBS, fmtDate, ini } from '../data';

export const Attendance: React.FC = () => {
  const { logs, addToast, attDept, setAttDept, attSection, setAttSection, attStatus, setAttStatus, students } = useAppContext();

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      if (attDept !== 'all' && l.st.dept !== attDept) return false;
      if (attStatus !== 'all' && l.status.toLowerCase() !== attStatus.toLowerCase()) return false;
      if (attSection !== 'all' && l.st.sec !== attSection) return false;
      return true;
    });
  }, [logs, attDept, attStatus, attSection]);

  const presentLogs = filteredLogs.filter(l => l.status === 'present');
  const lateLogs = filteredLogs.filter(l => l.status === 'late');
  const unknownLogs = filteredLogs.filter(l => l.status === 'unknown');

  const totalStudents = useMemo(() => {
    if (attDept === 'all') return students.length;
    return students.filter(s => s.dept === attDept).length;
  }, [students, attDept]);

  const absentCount = Math.max(0, totalStudents - presentLogs.length - lateLogs.length);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <input className="inp w-[148px]" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        <select className="inp w-[110px]" value={attDept} onChange={e => setAttDept(e.target.value)}>
          <option value="all">All Depts</option>
          {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="inp w-[100px]" value={attSection} onChange={e => setAttSection(e.target.value)}>
          <option value="all">All Sections</option>
          {['A', 'B', 'C'].map(s => <option key={s} value={s}>Section {s}</option>)}
        </select>
        <select className="inp w-[120px]" value={attStatus} onChange={e => setAttStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="late">Late</option>
          <option value="unknown">Unknown</option>
        </select>
        {(attDept !== 'all' || attSection !== 'all' || attStatus !== 'all') && (
          <button className="btn btn-sm btn-d" onClick={() => { setAttDept('all'); setAttSection('all'); setAttStatus('all'); }}>
            Clear filters
          </button>
        )}
        <span className="text-[11px] text-[var(--t3)]">{filteredLogs.length} records</span>
        <div className="ml-auto flex gap-1.5">
          <button className="btn btn-sm" onClick={() => addToast('Exporting attendance as CSV...', 'success')}>Export CSV</button>
          <button className="btn btn-sm" onClick={() => addToast('Generating PDF report...', 'success')}>Export PDF</button>
          <button className="btn btn-sm" onClick={() => addToast('Exporting to Excel...', 'success')}>Export Excel</button>
          <button className="btn btn-sm btn-p" onClick={() => addToast('Manual entry panel — connect to backend to enable', 'warn')}>Manual Entry</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3">
        <div className="kpi"><div className="kpi-val text-[var(--green)]">{presentLogs.length}</div><div className="kpi-lbl">Present</div><div className="kpi-bar bg-[var(--green)]"></div></div>
        <div className="kpi"><div className="kpi-val text-[var(--red)]">{absentCount}</div><div className="kpi-lbl">Absent</div><div className="kpi-bar bg-[var(--red)]"></div></div>
        <div className="kpi"><div className="kpi-val text-[var(--amber)]">{lateLogs.length}</div><div className="kpi-lbl">Late</div><div className="kpi-bar bg-[var(--amber)]"></div></div>
        <div className="kpi"><div className="kpi-val text-[var(--blue)]">{unknownLogs.length}</div><div className="kpi-lbl">Unknown</div><div className="kpi-bar bg-[var(--blue)]"></div></div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-3.5 border-b border-[var(--br)] flex items-center justify-between bg-[var(--s2)]">
          <div className="card-title">Attendance Records — {fmtDate()}</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-[11px] cursor-pointer">
              <input type="checkbox" onChange={(e) => {
                document.querySelectorAll('.row-check').forEach((c: any) => c.checked = e.target.checked);
              }} /> Select all
            </label>
            <button className="btn btn-sm" onClick={() => {
              const checked = document.querySelectorAll('.row-check:checked').length;
              addToast(`${checked || 0} records exported`, 'success');
            }}>Export Selected</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr><th><input type="checkbox" /></th><th>#</th><th>Student</th><th>Roll No</th><th>Department</th><th>Status</th><th>Detected At</th><th>Confidence</th><th>Camera</th><th>Subject</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 && (
                <tr><td colSpan={11} className="text-center py-6 text-[var(--t3)] text-xs">No records match the selected filters</td></tr>
              )}
              {filteredLogs.slice(0, 25).map((l, i) => {
                const bc = l.status === 'present' ? 'bg' : l.status === 'late' ? 'ba' : l.status === 'unknown' ? 'bi' : 'br';
                const subjects = SUBS[l.st.dept];
                const subj = subjects[i % subjects.length];
                return (
                  <tr key={l.id}>
                    <td><input type="checkbox" className="row-check" /></td>
                    <td className="text-[var(--t3)] font-mono text-[10px]">{String(i + 1).padStart(2, '0')}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="av w-6 h-6 text-[9px]" style={{ background: `${l.st.col}18`, color: l.st.col }}>{ini(l.st.name)}</div>
                        <span className="text-[11px] font-medium">{l.st.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-[10px] text-[var(--t3)]">{l.st.roll}</td>
                    <td><span className="badge bi">{l.st.dept}</span></td>
                    <td><span className={`badge ${bc}`}>{l.status}</span></td>
                    <td className="font-mono text-[10px]">{l.time}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="prog-mini w-11"><div className="prog-mini-fi" style={{ width: `${l.conf}%`, background: l.conf >= 80 ? 'var(--green)' : 'var(--red)' }}></div></div>
                        <span className="text-[10px] font-mono">{l.conf}%</span>
                      </div>
                    </td>
                    <td className="font-mono text-[10px] text-[var(--t3)]">{l.cam}</td>
                    <td className="text-[10px] text-[var(--t2)]">{subj}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-xs" onClick={(e) => { e.stopPropagation(); addToast('Override recorded for ' + l.st.name, 'success'); }}>Override</button>
                        <button className="btn btn-xs" onClick={(e) => { e.stopPropagation(); addToast('Note added for ' + l.st.name, 'success'); }}>Note</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
