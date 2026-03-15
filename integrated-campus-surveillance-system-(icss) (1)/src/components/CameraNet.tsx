import React from 'react';
import { useAppContext } from '../AppContext';
import { BUILDINGS } from '../data';

export const CameraNet: React.FC = () => {
  const { cameras, addToast, camSearch, setCamSearch, camStatusFilter, setCamStatusFilter } = useAppContext();

  const online = cameras.filter(c => c.status === 'online').length;
  const offline = cameras.filter(c => c.status === 'offline').length;
  const degraded = cameras.filter(c => c.status === 'degraded').length;

  const filteredCams = cameras.filter(c => {
    const q = camSearch.toLowerCase();
    if (q && !c.id.toLowerCase().includes(q) && !c.name.toLowerCase().includes(q) && !c.building.toLowerCase().includes(q) && !c.room.toLowerCase().includes(q)) return false;
    if (camStatusFilter !== 'all' && c.status !== camStatusFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-3">
        <div className="kpi"><div className="kpi-val text-[var(--green)]">{online}</div><div className="kpi-lbl">Online</div><div className="kpi-bar bg-[var(--green)]"></div></div>
        <div className="kpi"><div className="kpi-val text-[var(--amber)]">{degraded}</div><div className="kpi-lbl">Degraded</div><div className="kpi-bar bg-[var(--amber)]"></div></div>
        <div className="kpi"><div className="kpi-val text-[var(--red)]">{offline}</div><div className="kpi-lbl">Offline</div><div className="kpi-bar bg-[var(--red)]"></div></div>
        <div className="kpi"><div className="kpi-val text-[var(--acc)]">{cameras.length}</div><div className="kpi-lbl">Total Cameras</div><div className="kpi-bar bg-[var(--acc)]"></div></div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-3 items-start">
        <div className="card p-0 overflow-hidden">
          <div className="p-3.5 border-b border-[var(--br)] flex items-center gap-2 flex-wrap">
            <div className="card-title">Camera Registry</div>
            <input
              className="inp"
              style={{ width: 200 }}
              placeholder="Search ID, name, location..."
              value={camSearch}
              onChange={e => setCamSearch(e.target.value)}
            />
            <select className="inp" style={{ width: 120 }} value={camStatusFilter} onChange={e => setCamStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="degraded">Degraded</option>
              <option value="offline">Offline</option>
            </select>
            <span className="text-[11px] text-[var(--t3)]">{filteredCams.length} cameras</span>
            <div className="ml-auto flex gap-1.5">
              <button className="btn btn-sm" onClick={() => addToast('Testing all camera connections...', 'warn')}>Test All</button>
              <button className="btn btn-sm btn-p" onClick={() => addToast('Add camera form — connect to backend to enable', 'warn')}>+ Add Camera</button>
            </div>
          </div>
          <div className="overflow-auto max-h-[480px]">
            <table className="tbl">
              <thead>
                <tr><th>Camera ID</th><th>Location</th><th>Type</th><th>Status</th><th>Resolution</th><th>FPS</th><th>Detections</th><th>Uptime</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredCams.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-6 text-[var(--t3)] text-xs">No cameras match the current filter</td></tr>
                )}
                {filteredCams.map(c => (
                  <tr key={c.id} title={c.rtsp}>
                    <td className="font-mono text-[10px] font-medium">{c.id}</td>
                    <td>
                      <div className="text-[11px] font-medium">{c.building.split('—')[0].trim()}</div>
                      <div className="text-[10px] text-[var(--t3)]">{c.floor} · {c.room}</div>
                    </td>
                    <td><span className="badge bp">{c.type}</span></td>
                    <td>
                      <div className="inline-flex items-center gap-1 text-[10px] font-mono">
                        <div className={`dot ${c.status === 'online' ? 'dg blink' : c.status === 'degraded' ? 'da' : 'dr'}`}></div>
                        {c.status}
                      </div>
                    </td>
                    <td className="font-mono text-[10px]">{c.resolution}</td>
                    <td className="font-mono text-[10px]">{c.fps}</td>
                    <td className="font-mono text-[10px]">{c.detectionsToday}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="prog-mini w-9"><div className="prog-mini-fi" style={{ width: `${c.uptime}%`, background: c.uptime > 90 ? 'var(--green)' : 'var(--amber)' }}></div></div>
                        <span className="text-[10px] font-mono">{c.uptime}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-xs" onClick={() => addToast(`Restarting ${c.id}...`, 'warn')}>Restart</button>
                        <button className={`btn btn-xs ${c.status === 'offline' ? 'btn-p' : ''}`} onClick={() => addToast(`Testing ${c.id} — ping 12ms, stream OK`, 'success')}>Test</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="card">
            <div className="card-hd"><div className="card-title">By Building</div></div>
            {BUILDINGS.map(b => {
              const bcams = cameras.filter(c => c.buildingId === b.id);
              const bon = bcams.filter(c => c.status === 'online').length;
              return (
                <div key={b.id} className="stat-row">
                  <div>
                    <div className="text-xs font-medium">{b.name.split('—')[0].trim()}</div>
                    <div className="text-[10px] text-[var(--t3)]">{bcams.length} cameras · {b.floors} floors</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-[11px] font-medium ${bon === bcams.length ? 'text-[var(--green)]' : 'text-[var(--amber)]'}`}>{bon}/{bcams.length}</div>
                    <div className="text-[9px] text-[var(--t3)]">online</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="card">
            <div className="card-hd"><div className="card-title">Edge Nodes</div></div>
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="stat-row">
                <div>
                  <div className="text-xs font-medium">Edge Node {n}</div>
                  <div className="text-[10px] text-[var(--t3)]">NVIDIA Jetson · Block {['A', 'B', 'C', 'Main'][n - 1]}</div>
                </div>
                <span className="badge bg">online</span>
              </div>
            ))}
          </div>
          
          <div className="card">
            <div className="card-hd"><div className="card-title">Network Health</div></div>
            {[
              ['Avg Latency', '12ms'], ['Packet Loss', '0.02%'], ['Throughput', '420 Mbps'], 
              ['RTSP Streams', 'Active'], ['Recording', 'Enabled'], ['Storage Used', '1.2 TB / 4 TB']
            ].map(([k, v], i) => (
              <div key={i} className="stat-row">
                <span className="text-[var(--t3)] text-[11px]">{k}</span>
                <span className="font-mono text-[11px] font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
