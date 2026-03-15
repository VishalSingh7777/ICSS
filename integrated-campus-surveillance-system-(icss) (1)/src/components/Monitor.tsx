import React, { useEffect, useRef } from 'react';
import { CameraOff } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { randInt, choice, ini } from '../data';

export const Monitor: React.FC = () => {
  const { cameras, camLayout, setCamLayout, paused, setPaused, logs, cfg, students, addToast } = useAppContext();
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const detsRef = useRef<any[][]>([]);

  const displayCams = cameras.slice(0, camLayout);

  useEffect(() => {
    const mkDets = () => {
      detsRef.current = displayCams.map(cam => {
        if (cam.status !== 'online') return [];
        const n = randInt(0, 3);
        const dets = [];
        for (let i = 0; i < n; i++) {
          const st = choice(students);
          dets.push({ st, conf: randInt(83, 99), x: 8 + Math.random() * 55, y: 8 + Math.random() * 48, w: 14 + Math.random() * 10, h: 22 + Math.random() * 10 });
        }
        return dets;
      });
    };

    mkDets();
    const detInterval = setInterval(() => {
      if (!paused && Math.random() < 0.3) mkDets();
    }, 600);

    let animationFrameId: number;
    const renderLoop = () => {
      if (!paused) {
        displayCams.forEach((cam, i) => {
          const c = canvasRefs.current[i];
          if (!c || cam.status === 'offline') return;
          const W = c.offsetWidth, H = c.offsetHeight;
          if (!W || !H) return;
          if (c.width !== W) c.width = W;
          if (c.height !== H) c.height = H;
          
          const ctx = c.getContext('2d');
          if (!ctx) return;
          
          ctx.fillStyle = '#05070A';
          ctx.fillRect(0, 0, W, H);
          ctx.strokeStyle = 'rgba(216,90,48,0.04)';
          ctx.lineWidth = 1;
          
          for (let j = 0; j <= 8; j++) {
            ctx.beginPath(); ctx.moveTo(0, j * H / 8); ctx.lineTo(W, j * H / 8); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(j * W / 8, 0); ctx.lineTo(j * W / 8, H); ctx.stroke();
          }
          
          const dets = detsRef.current[i] || [];
          dets.forEach(d => {
            const x = d.x / 100 * W, y = d.y / 100 * H, w = d.w / 100 * W, h = d.h / 100 * H;
            const col = '#1D9E75'; const cs = 6;
            ctx.strokeStyle = col; ctx.lineWidth = 1.5;
            [[x, y, x + cs, y], [x, y, x, y + cs], [x + w - cs, y, x + w, y], [x + w, y, x + w, y + cs], [x, y + h - cs, x, y + h], [x, y + h, x + cs, y + h], [x + w, y + h - cs, x + w, y + h], [x + w - cs, y + h, x + w, y + h]].forEach(([x1, y1, x2, y2]) => {
              ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            });
            ctx.fillStyle = 'rgba(29,158,117,0.08)'; ctx.fillRect(x, y, w, h);
            ctx.fillStyle = 'rgba(29,158,117,0.85)'; ctx.fillRect(x, y - 13, w, 13);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 8px monospace'; ctx.fillText(`${d.st.id.slice(0, 8)} ${d.conf}%`, x + 3, y - 3);
          });
          
          ctx.fillStyle = 'rgba(216,90,48,0.65)'; ctx.font = '8px monospace';
          ctx.fillText(`${cam.fps}fps D:${dets.length}`, 5, H - 5);
        });
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      clearInterval(detInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [displayCams, paused, students]);

  return (
    <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-3 items-start">
      <div>
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <div className="card-title p-0">Camera Grid</div>
          <div className="flex gap-1 ml-auto">
            {[{ n: 1, l: '1×1' }, { n: 4, l: '2×2' }, { n: 9, l: '3×3' }].map(g => (
              <button key={g.n} className={`btn btn-sm ${camLayout === g.n ? 'btn-p' : ''}`} onClick={() => setCamLayout(g.n)}>{g.l}</button>
            ))}
          </div>
          <button className={`btn btn-sm ${paused ? 'btn-p' : ''}`} onClick={() => { setPaused(!paused); addToast(paused ? 'Feeds resumed' : 'Feeds paused', paused ? 'success' : 'warn'); }}>
            {paused ? 'Resume' : 'Pause All'}
          </button>
          <button className="btn btn-sm" onClick={() => addToast('Snapshot saved: snapshot_' + Date.now() + '.jpg', 'success')}>Snapshot</button>
        </div>
        
        <div className={`grid gap-2 ${camLayout === 1 ? 'grid-cols-1' : camLayout === 9 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {displayCams.map((cam, i) => (
            <div key={cam.id}>
              <div className="rounded-[var(--r6)] overflow-hidden bg-[#06080A] aspect-video relative">
                <canvas ref={el => canvasRefs.current[i] = el} className="w-full h-full block" />
                {cam.status === 'offline' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--t3)] text-[11px] gap-1.5 z-10">
                    <CameraOff className="w-5 h-5" />
                    <span>OFFLINE</span>
                  </div>
                )}
                <div className="absolute top-0 left-0 text-[8.5px] text-[var(--acc)] opacity-90 font-mono p-1.5 pointer-events-none leading-[1.4] z-20">
                  {cam.id} · {cam.type}<br/>{cam.floor} / {cam.room}
                </div>
                <div className="absolute top-0 right-0 text-right text-[8.5px] text-[var(--acc)] opacity-90 font-mono p-1.5 pointer-events-none leading-[1.4] z-20">
                  <div className="flex items-center gap-[3px] justify-end">
                    <div className={`w-[5px] h-[5px] rounded-full ${paused ? 'bg-[var(--amber)]' : 'bg-[var(--red)] blink'}`}></div>
                    {paused ? 'PAUSED' : 'REC'}
                  </div>
                  <div>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</div>
                </div>
                {paused && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30 pointer-events-none">
                    <div className="text-[var(--amber)] font-mono text-xl font-bold tracking-widest bg-black/60 px-4 py-2 rounded border border-[var(--amber)]/30">
                      PAUSED
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 text-[8.5px] text-[var(--acc)] opacity-90 font-mono p-1.5 pointer-events-none leading-[1.4] z-20">
                  {cam.fps}fps · {cam.resolution}
                </div>
              </div>
              <div className="text-[10px] font-medium text-[var(--t1)] mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-[var(--t2)]">{cam.name}</span>
                <span className={`badge ${cam.status === 'online' ? 'bg' : cam.status === 'degraded' ? 'ba' : 'br'}`}>{cam.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="card">
          <div className="card-hd"><div className="card-title">Live Detections</div><div className="card-sub">{logs.length} events</div></div>
          <div className="overflow-y-auto max-h-[360px] pr-1">
            {logs.slice(0, 10).map((l, i) => (
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
        
        <div className="card">
          <div className="card-hd"><div className="card-title">Engine Status</div></div>
          <table className="tbl">
            <tbody>
              <tr><td className="text-[var(--t3)] text-[11px]">Model</td><td className="font-mono text-[10px]">InsightFace buffalo_l</td></tr>
              <tr><td className="text-[var(--t3)] text-[11px]">Anti-spoof</td><td><span className={`badge ${cfg.antiSpoof ? 'bg' : 'ba'}`}>{cfg.antiSpoof ? 'active' : 'off'}</span></td></tr>
              <tr><td className="text-[var(--t3)] text-[11px]">Threshold</td><td className="font-mono text-[10px]">{cfg.thresh}% cosine</td></tr>
              <tr><td className="text-[var(--t3)] text-[11px]">Processing</td><td className="font-mono text-[10px]">{cfg.fps}fps · 38ms/frame</td></tr>
              <tr><td className="text-[var(--t3)] text-[11px]">Edge nodes</td><td className="font-mono text-[10px]">4 active</td></tr>
              <tr><td className="text-[var(--t3)] text-[11px]">Accuracy</td><td className="font-mono text-[10px] text-[var(--green)] font-medium">98.7%</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
