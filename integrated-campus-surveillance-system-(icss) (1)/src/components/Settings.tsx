import React from 'react';
import { useAppContext } from '../AppContext';
import { AVCOLS, ini } from '../data';

export const Settings: React.FC = () => {
  const { stab, setStab, cfg, updateCfg, addToast, logs, setPage, resetLogs } = useAppContext();

  const [attThresh, setAttThresh] = React.useState(75);
  const [absThresh, setAbsThresh] = React.useState(3);
  const [spoofSens, setSpoofSens] = React.useState(4);

  const renderModel = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="card">
        <div className="card-hd"><div className="card-title">Recognition Engine</div></div>
        {[
          ['Anti-Spoofing (Liveness Detection)', 'Blocks photo and video replay attacks using depth cues and eye-blink analysis', 'antiSpoof'],
          ['Multi-Camera Threading', 'Process all camera streams in parallel across edge nodes', 'multiCam'],
          ['Async Attendance Logging', 'Non-blocking database writes via Redis queue — prevents recognition delay', 'asyncLog'],
          ['Edge Processing (NVIDIA Jetson)', 'Run inference on edge nodes instead of central server for lower latency', 'edgeProc']
        ].map(([lbl, desc, key]) => (
          <div key={key} className="set-row">
            <div><div className="set-lbl">{lbl}</div><div className="set-desc">{desc}</div></div>
            <button className={`tog ${cfg[key as keyof typeof cfg] ? 'on' : 'off'}`} onClick={() => { updateCfg(key as any, !cfg[key as keyof typeof cfg]); addToast(`${lbl}: ${!cfg[key as keyof typeof cfg] ? 'enabled' : 'disabled'}`, !cfg[key as keyof typeof cfg] ? 'success' : 'warn'); }}></button>
          </div>
        ))}
        <div className="set-row">
          <div><div className="set-lbl">Confidence Threshold</div><div className="set-desc">Minimum cosine similarity score required to confirm identity</div></div>
          <div className="sl-row">
            <input type="range" min="60" max="95" step="1" value={cfg.thresh} className="w-[100px]" onChange={e => updateCfg('thresh', +e.target.value)} />
            <div className="sl-val">{cfg.thresh}%</div>
          </div>
        </div>
        <div className="set-row border-b-0">
          <div><div className="set-lbl">Processing FPS</div><div className="set-desc">Frames per second per camera — balance accuracy vs server load</div></div>
          <div className="sl-row">
            <input type="range" min="5" max="30" step="1" value={cfg.fps} className="w-[100px]" onChange={e => updateCfg('fps', +e.target.value)} />
            <div className="sl-val">{cfg.fps} fps</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="card">
          <div className="card-hd"><div className="card-title">Model Information</div></div>
          {[
            ['Model', 'InsightFace buffalo_l'], ['Architecture', 'ResNet-100 ArcFace'], 
            ['Embedding Dim', '512-dimensional'], ['LFW Benchmark', '99.77%'], 
            ['IJB-C Benchmark', '97.3%'], ['License', 'MIT Open Source'], 
            ['Last Updated', 'Oct 2024'], ['Inference Time', '~38ms/frame']
          ].map(([k, v]) => (
            <div key={k} className="stat-row"><span className="text-[11px] text-[var(--t3)]">{k}</span><span className="font-mono text-[10px] font-medium">{v}</span></div>
          ))}
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Data Management</div></div>
          <div className="flex flex-col gap-2">
            <button className="btn btn-p justify-center" onClick={() => addToast('Database backup started...', 'success')}>Backup Database Now</button>
            <button className="btn justify-center" onClick={() => addToast('Rebuilding embeddings in background...', 'warn')}>Rebuild All Embeddings</button>
            <button className="btn justify-center" onClick={() => addToast('Exporting full archive...', 'success')}>Export Full Attendance Archive</button>
            <button className="btn btn-d justify-center" onClick={() => { if(window.confirm("Reset today's records? This cannot be undone.")) { resetLogs(); addToast("Today's records reset", 'warn'); } }}>Reset Today's Records</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="card">
        <div className="card-hd"><div className="card-title">External Integrations</div></div>
        {[
          ['Student Information System (SIS)', cfg.sisEnabled, 'REST API · Auto-sync daily', 'sisEnabled'],
          ['ERP / HRMS', cfg.erpEnabled, 'SAP integration · Manual sync', 'erpEnabled'],
          ['SMS Gateway (Twilio/SNS)', cfg.smsAlert, 'Parent alerts · Defaulter SMS', 'smsAlert'],
          ['Email Server (SMTP)', cfg.emailAlert, 'Reports · Faculty notifications', 'emailAlert'],
          ['Active Directory / LDAP', true, 'Faculty login authentication', ''],
          ['Google Workspace', false, 'Calendar sync · Drive backup', ''],
          ['WhatsApp Business API', false, 'Parent notification channel', '']
        ].map(([k, v, d, key]) => (
          <div key={k} className="set-row">
            <div><div className="set-lbl">{k}</div><div className="set-desc">{d}</div></div>
            <div className="flex items-center gap-2">
              <span className={`badge ${v ? 'bg' : 'bp'}`}>{v ? 'Connected' : 'Inactive'}</span>
              <button className={`tog ${v ? 'on' : 'off'}`} onClick={() => { if(key) { updateCfg(key as any, !v); addToast(`${k.toString().split('(')[0].trim()} ${!v ? 'connected' : 'disconnected'}`, !v ? 'success' : 'warn'); } }}></button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="card">
          <div className="card-hd"><div className="card-title">API Configuration</div></div>
          <div className="mb-2.5"><label className="set-desc block mb-1">SIS Endpoint URL</label><input className="inp w-full text-[11px] font-mono" defaultValue="https://sis.college.edu/api/v2/attendance" /></div>
          <div className="mb-2.5"><label className="set-desc block mb-1">API Key</label><input className="inp w-full text-[11px] font-mono" type="password" defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxx" /></div>
          <div className="mb-3"><label className="set-desc block mb-1">Sync Frequency</label>
            <select className="inp w-full"><option>Every hour</option><option>Daily (11 PM)</option><option>Every class end</option></select>
          </div>
          <button className="btn btn-sm btn-p" onClick={() => addToast('SIS connection OK — ping 24ms', 'success')}>Test Connection</button>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Backup Settings</div></div>
          <div className="set-row"><div className="set-lbl">Backup Frequency</div>
            <select className="inp w-[110px]" value={cfg.backupFreq} onChange={e => updateCfg('backupFreq', e.target.value)}><option value="hourly">Hourly</option><option value="daily">Daily</option><option value="weekly">Weekly</option></select>
          </div>
          <div className="set-row border-b-0"><div className="set-lbl">Last Backup</div><span className="font-mono text-[11px] text-[var(--green)]">2h ago — 2.3 GB</span></div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="card">
        <div className="card-hd"><div className="card-title">Notification Rules</div></div>
        {[
          ['SMS to parents when attendance < 75%', cfg.smsAlert],
          ['Email faculty daily summary at 5 PM', true],
          ['Email HOD weekly report every Monday', true],
          ['Push notification for unknown face detection', cfg.liveAlert],
          ['Alert admin when camera goes offline', true],
          ['Notify faculty when class starts', false],
          ['Daily PDF report to principal', false],
          ['Escalation if critical alert unresolved > 1hr', true]
        ].map(([k, v], i) => (
          <div key={i} className="set-row">
            <div className="set-lbl">{k}</div>
            <button className={`tog ${v ? 'on' : 'off'}`} onClick={(e) => { e.currentTarget.classList.toggle('on'); e.currentTarget.classList.toggle('off'); addToast('Notification setting saved'); }}></button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="card">
          <div className="card-hd"><div className="card-title">Threshold Settings</div></div>
          <div className="set-row">
            <div><div className="set-lbl">Low Attendance Alert</div><div className="set-desc">Trigger when overall falls below</div></div>
            <div className="sl-row">
              <input type="range" min="50" max="85" step="5" value={attThresh} className="w-[90px]" onChange={e => setAttThresh(+e.target.value)} />
              <div className="sl-val">{attThresh}%</div>
            </div>
          </div>
          <div className="set-row">
            <div><div className="set-lbl">Consecutive Absence Alert</div><div className="set-desc">Trigger after N consecutive absences</div></div>
            <div className="sl-row">
              <input type="range" min="2" max="10" step="1" value={absThresh} className="w-[90px]" onChange={e => setAbsThresh(+e.target.value)} />
              <div className="sl-val">{absThresh} days</div>
            </div>
          </div>
          <div className="set-row border-b-0">
            <div><div className="set-lbl">Spoof Alert Sensitivity</div><div className="set-desc">Higher = more false positives, lower = less secure</div></div>
            <div className="sl-row">
              <input type="range" min="1" max="5" step="1" value={spoofSens} className="w-[90px]" onChange={e => setSpoofSens(+e.target.value)} />
              <div className="sl-val">{spoofSens} / 5</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Message Templates</div></div>
          <div className="mb-2.5"><label className="set-desc block mb-1">Parent SMS Template</label>
            <textarea className="inp w-full resize-y text-[11px]" rows={3} defaultValue="Dear Parent, your ward {name} attendance is {pct}% as of {date}. Please ensure regular attendance. Contact: attendance@college.edu"></textarea>
          </div>
          <button className="btn btn-sm btn-p" onClick={() => addToast('SMS template saved successfully', 'success')}>Save Template</button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => {
    const users = [
      { name: 'Dr. Ashok Mehta', role: 'Admin', dept: 'All', last: 'Active now' },
      { name: 'Prof. Sunita Rao', role: 'HOD', dept: 'CSE', last: '2h ago' },
      { name: 'Dr. Rahul Jain', role: 'Faculty', dept: 'ECE', last: '1h ago' },
      { name: 'Prof. Kavitha Nair', role: 'Faculty', dept: 'ME', last: '3h ago' },
      { name: 'Suresh Kumar', role: 'Security', dept: 'Campus', last: '5m ago' },
      { name: 'Anita Sharma', role: 'HOD', dept: 'IT', last: '1h ago' },
    ];
    return (
      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-3">
        <div className="card p-0 overflow-hidden">
          <div className="p-2.5 border-b border-[var(--br)] flex items-center justify-between bg-[var(--s2)]">
            <div className="card-title">System Users & Roles</div>
            <button className="btn btn-sm btn-p" onClick={() => addToast('Add user panel — connect to backend', 'warn')}>+ Add User</button>
          </div>
          <table className="tbl">
            <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Permissions</th><th>Last Active</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="av w-[26px] h-[26px] text-[10px]" style={{ background: `${AVCOLS[i % AVCOLS.length]}18`, color: AVCOLS[i % AVCOLS.length] }}>{ini(u.name)}</div>
                      <span className="text-xs font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${u.role === 'Admin' ? 'bacc' : u.role === 'HOD' ? 'bi' : u.role === 'Security' ? 'ba' : 'bp'}`}>{u.role}</span></td>
                  <td className="text-[11px]">{u.dept}</td>
                  <td className="text-[10px] text-[var(--t3)]">{u.role === 'Admin' ? 'Full access' : u.role === 'HOD' ? 'Dept + Reports' : u.role === 'Security' ? 'Monitor only' : 'Attendance view'}</td>
                  <td className="text-[10px] text-[var(--t3)] font-mono">{u.last}</td>
                  <td><div className="flex gap-1">
                    <button className="btn btn-xs" onClick={() => addToast(`Edit dialog for ${u.name}`)}>Edit</button>
                    <button className="btn btn-xs btn-d" onClick={() => { if(window.confirm(`Remove ${u.name}?`)) addToast(`${u.name} removed`, 'warn'); }}>Remove</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="card-hd"><div className="card-title">Role Permissions</div></div>
            {[
              ['Admin', 'Full system access, user management, all exports'],
              ['HOD', 'Dept analytics, reports, alert management'],
              ['Faculty', 'View class attendance, generate reports'],
              ['Security', 'Live monitor only, raise alerts'],
              ['Student', 'View own attendance only (via portal)']
            ].map(([r, p]) => (
              <div key={r} className="stat-row">
                <div>
                  <div className="text-xs font-medium">{r}</div>
                  <div className="text-[10px] text-[var(--t3)] leading-[1.4]">{p}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-hd"><div className="card-title">Audit Log</div></div>
            {[
              ['Admin login', '2m ago'], ['Config changed', '1h ago'], 
              ['Report exported', '2h ago'], ['Backup triggered', '2h ago'], ['User added', '1d ago']
            ].map(([a, t]) => (
              <div key={a} className="stat-row"><span className="text-[11px] text-[var(--t2)]">{a}</span><span className="text-[10px] font-mono text-[var(--t3)]">{t}</span></div>
            ))}
            <button className="btn btn-sm mt-2" onClick={() => addToast('Loading full audit log...')}>View Full Audit Log</button>
          </div>
        </div>
      </div>
    );
  };

  const renderCompliance = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="card">
        <div className="card-hd"><div className="card-title">Privacy & Data Protection</div></div>
        {[
          ['End-to-End Encryption', 'Encrypt all biometric embeddings at rest and in transit', cfg.encryption, 'encryption'],
          ['GDPR Compliance Mode', 'Anonymize data on export, enforce right-to-erasure', cfg.gdpr, 'gdpr'],
          ['Audit Trail Logging', 'Log all system accesses and data modifications', cfg.auditLog, 'auditLog'],
          ['Anonymize Unknown Faces', 'Do not store biometric data of unidentified persons', true, ''],
          ['Auto-delete after Retention Period', 'Purge records older than retention limit', true, '']
        ].map(([k, d, v, key]) => (
          <div key={k} className="set-row">
            <div><div className="set-lbl">{k}</div><div className="set-desc">{d}</div></div>
            <button className={`tog ${v ? 'on' : 'off'}`} onClick={() => { if(key) { updateCfg(key as any, !v); addToast('Compliance setting updated', 'success'); } }}></button>
          </div>
        ))}
        <div className="set-row">
          <div><div className="set-lbl">Data Retention Period</div><div className="set-desc">Records older than this will be automatically purged</div></div>
          <div className="sl-row">
            <input type="range" min="30" max="365" step="30" value={cfg.retainDays} className="w-[90px]" onChange={e => updateCfg('retainDays', +e.target.value)} />
            <div className="sl-val">{cfg.retainDays}d</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="card">
          <div className="card-hd"><div className="card-title">Compliance Status</div></div>
          {[
            ['GDPR', 'Compliant', 'bg'], ['FERPA (US)', 'N/A', 'bp'], 
            ['IT Act 2000 (India)', 'Compliant', 'bg'], ['ISO 27001', 'In Progress', 'ba'], 
            ['Biometric Data Law', 'Review Required', 'ba'], ['Data Encryption (AES-256)', 'Active', 'bg'], 
            ['TLS 1.3 in Transit', 'Active', 'bg']
          ].map(([k, v, c]) => (
            <div key={k} className="stat-row"><span className="text-[11px] text-[var(--t2)]">{k}</span><span className={`badge ${c}`}>{v}</span></div>
          ))}
        </div>
        <div className="card">
          <div className="card-hd"><div className="card-title">Student Data Rights</div></div>
          <div className="flex flex-col gap-1.5">
            <button className="btn justify-start" onClick={() => addToast('Student GDPR data export started', 'success')}>Export Student Data (GDPR)</button>
            <button className="btn justify-start" onClick={() => addToast('Anonymized export generated', 'success')}>Anonymized Export</button>
            <button className="btn btn-d justify-start" onClick={() => { if(window.confirm(`Purge records older than ${cfg.retainDays} days?`)) addToast('Expired records purged', 'success'); }}>Purge Expired Records</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="stabs">
        {['model', 'integrations', 'notifications', 'users', 'compliance'].map(t => (
          <div key={t} className={`stab ${stab === t ? 'active' : ''}`} onClick={() => setStab(t)}>
            {{ model: 'Model & Engine', integrations: 'Integrations', notifications: 'Notifications', users: 'User Management', compliance: 'Compliance & Privacy' }[t]}
          </div>
        ))}
      </div>
      {stab === 'model' ? renderModel() : stab === 'integrations' ? renderIntegrations() : stab === 'notifications' ? renderNotifications() : stab === 'users' ? renderUsers() : renderCompliance()}
    </div>
  );
};
