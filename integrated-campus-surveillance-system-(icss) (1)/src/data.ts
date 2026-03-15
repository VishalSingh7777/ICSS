export const DEPTS = ['CSE', 'ECE', 'ME', 'CE', 'IT'];
export const SUBS: Record<string, string[]> = {
  CSE: ['Data Structures', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Machine Learning'],
  ECE: ['Signals & Systems', 'VLSI Design', 'Electromagnetics', 'Digital Signal Processing', 'Control Systems'],
  ME: ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Manufacturing Proc.', 'Engineering Dynamics'],
  CE: ['Structural Analysis', 'Geotechnical Engg.', 'Fluid Mechanics', 'Surveying', 'RCC Design'],
  IT: ['Web Technologies', 'Cloud Computing', 'Cybersecurity', 'Big Data Analytics', 'Internet of Things']
};
export const NAMES = [
  'Aarav Sharma', 'Priya Patel', 'Rohit Verma', 'Ananya Singh', 'Vikram Rao',
  'Meera Joshi', 'Arjun Nair', 'Sneha Gupta', 'Kavya Reddy', 'Dev Malhotra',
  'Riya Mehta', 'Karan Kumar', 'Pooja Iyer', 'Amit Chauhan', 'Divya Mishra',
  'Raj Saxena', 'Simran Kaur', 'Nikhil Tiwari', 'Shreya Pandey', 'Aditya Shah',
  'Nisha Yadav', 'Rahul Srivastava', 'Preethi Nair', 'Suresh Babu', 'Lakshmi Devi',
  'Mohammed Ali', 'Fatima Khan', 'Siddharth Roy', 'Pallavi Das', 'Tarun Bose',
  'Chandni Sharma', 'Vineet Singh', 'Ankita Jain', 'Deepak Garg', 'Swati Agarwal', 'Harsh Trivedi'
];
export const AVCOLS = ['#D85A30', '#1D9E75', '#378ADD', '#BA7517', '#A32D2D', '#534AB7', '#993556', '#3B6D11', '#0F6E56', '#993C1D', '#854F0B', '#185FA5'];
export const BUILDINGS = [
  { id: 'blk-a', name: 'Block A — CS & IT', floors: 4, rooms: ['101', '102', '103', '104', 'Lab A1', 'Lab A2'] },
  { id: 'blk-b', name: 'Block B — ECE', floors: 3, rooms: ['201', '202', '203', 'Lab B1', 'Seminar B'] },
  { id: 'blk-c', name: 'Block C — ME & CE', floors: 3, rooms: ['301', '302', '303', 'Workshop', 'Lab C1'] },
  { id: 'main', name: 'Main Building', floors: 2, rooms: ['Auditorium', 'Conf Room', 'Admin Block'] },
  { id: 'lib', name: 'Library Complex', floors: 1, rooms: ['Reading Hall', 'Digital Lab'] }
];
export const CAM_TYPES = ['Entry Gate', 'Classroom', 'Corridor', 'Laboratory', 'Seminar Hall', 'Canteen', 'Parking', 'Library'];

export function randInt(a: number, b: number) { return Math.floor(a + Math.random() * (b - a)); }
export function choice<T>(arr: T[]): T { return arr[randInt(0, arr.length)]; }
export function seededRand(seed: number) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

export interface Student {
  id: string;
  name: string;
  dept: string;
  year: number;
  sec: string;
  roll: string;
  email: string;
  phone: string;
  parentPhone: string;
  parentEmail: string;
  col: string;
  photos: number;
  subjects: { name: string; present: number; total: number; pct: number }[];
  overall: number;
  risk: 'high' | 'medium' | 'low';
  lastSeen: Date;
  flagged: boolean;
}

export function genStudents(): Student[] {
  return NAMES.map((name, i) => {
    const dept = DEPTS[i % DEPTS.length];
    const year = Math.floor(i / 9) + 1;
    const secs = ['A', 'B', 'C'];
    const sec = secs[i % 3];
    const r = seededRand(i * 137 + 19);
    const subjects = SUBS[dept].map(s => {
      const present = Math.floor(50 + r() * 40);
      const total = Math.floor(88 + r() * 12);
      return {
        name: s,
        present,
        total,
        pct: Math.round(present / total * 100)
      };
    });
    const overall = Math.round(subjects.reduce((a, s) => a + s.pct, 0) / subjects.length);
    const yr = 2024 - year + 1;
    return {
      id: `${dept.slice(0, 2)}${yr}${String(i + 1).padStart(3, '0')}`,
      name, dept, year, sec,
      roll: `${dept}/${yr}/${String(i + 1).padStart(3, '0')}`,
      email: `${name.split(' ')[0].toLowerCase()}.${year}@college.edu`,
      phone: `+91 ${randInt(7000000000, 9999999999)}`,
      parentPhone: `+91 ${randInt(7000000000, 9999999999)}`,
      parentEmail: `parent.${name.split(' ')[0].toLowerCase()}@gmail.com`,
      col: AVCOLS[i % AVCOLS.length],
      photos: Math.max(2, Math.floor(2 + r() * 4)),
      subjects, overall,
      risk: overall < 65 ? 'high' : overall < 75 ? 'medium' : 'low',
      lastSeen: new Date(Date.now() - r() * 86400000 * 3),
      flagged: overall < 60
    };
  });
}

export interface Camera {
  id: string;
  name: string;
  building: string;
  buildingId: string;
  floor: string;
  room: string;
  type: string;
  status: 'online' | 'offline' | 'degraded';
  fps: number;
  resolution: string;
  uptime: number;
  detectionsToday: number;
  rtsp: string;
  ip: string;
  lastDetection: Date;
  processingNode: string;
}

export function genCameras(): Camera[] {
  const cams: Camera[] = [];
  let id = 1;
  BUILDINGS.forEach(b => {
    const n = b.id === 'main' ? 4 : b.id === 'lib' ? 2 : 6;
    for (let i = 0; i < n; i++) {
      const offline = Math.random() < 0.07;
      const degraded = !offline && Math.random() < 0.1;
      cams.push({
        id: `CAM-${String(id).padStart(3, '0')}`,
        name: `${b.name.split('—')[0].trim()} ${choice(CAM_TYPES)}`,
        building: b.name, buildingId: b.id,
        floor: `Floor ${randInt(1, b.floors + 1)}`,
        room: choice(b.rooms),
        type: choice(CAM_TYPES),
        status: offline ? 'offline' : degraded ? 'degraded' : 'online',
        fps: randInt(12, 31),
        resolution: choice(['1920×1080', '1280×720', '2560×1440']),
        uptime: offline ? 0 : Math.round(95 + Math.random() * 5),
        detectionsToday: offline ? 0 : randInt(20, 180),
        rtsp: `rtsp://192.168.${randInt(1, 5)}.${randInt(10, 250)}/stream1`,
        ip: `192.168.${randInt(1, 5)}.${randInt(10, 250)}`,
        lastDetection: new Date(Date.now() - Math.random() * 3600000),
        processingNode: `edge-node-${randInt(1, 5)}`
      });
      id++;
    }
  });
  return cams;
}

export interface Alert {
  id: number;
  type: string;
  sev: 'critical' | 'warning' | 'info';
  msg: string;
  timestamp: Date;
  resolved: boolean;
}

export function genAlerts(): Alert[] {
  const types: { type: string, sev: 'critical' | 'warning' | 'info', msg: string }[] = [
    { type: 'unknown_face', sev: 'critical', msg: 'Unidentified person detected at Main Entry Gate' },
    { type: 'spoof_attempt', sev: 'critical', msg: 'Spoofing attempt blocked at Block A Entry' },
    { type: 'cam_offline', sev: 'critical', msg: 'CAM-007 (Block B Corridor) has gone offline' },
    { type: 'low_attendance', sev: 'warning', msg: 'Kavya Reddy attendance dropped below 65% threshold' },
    { type: 'low_attendance', sev: 'warning', msg: 'Dev Malhotra marked absent for 5 consecutive days' },
    { type: 'cam_degraded', sev: 'warning', msg: 'CAM-012 running at reduced FPS (8fps) — check lighting' },
    { type: 'low_attendance', sev: 'warning', msg: '3 students from ME/Sec-C below 75% — review required' },
    { type: 'system', sev: 'info', msg: 'Daily backup completed successfully — 2.3 GB synced' },
    { type: 'system', sev: 'info', msg: 'Model accuracy recalibrated: 98.9% on today\'s samples' },
    { type: 'low_light', sev: 'warning', msg: 'Low light detected on Block C Lab cameras — accuracy impacted' },
    { type: 'system', sev: 'info', msg: 'SIS sync completed — attendance exported to ERP system' },
    { type: 'unknown_face', sev: 'critical', msg: 'Unknown face detected at Library entrance for 2nd time today' },
    { type: 'system', sev: 'info', msg: 'SMS alert sent to 7 parents for students below 75% attendance' },
    { type: 'cam_offline', sev: 'warning', msg: 'CAM-019 intermittent connection — packet loss 12%' },
    { type: 'system', sev: 'info', msg: 'Weekly attendance report generated and emailed to all HODs' },
  ];
  return types.map((t, i) => ({
    ...t, id: i,
    timestamp: new Date(Date.now() - (i * 1800000 + Math.random() * 900000)),
    resolved: i > 10
  }));
}

export interface Schedule {
  time: string;
  subject: string;
  room: string;
  dept: string;
  sec: string;
  faculty: string;
  registered: number;
  present: number;
}

export function genSchedule(): Schedule[] {
  const periods: Schedule[] = [
    { time: '09:00–10:00', subject: 'Data Structures', room: 'Block A / 101', dept: 'CSE', sec: 'A', faculty: 'Dr. Rajesh Kumar', registered: 42, present: 0 },
    { time: '10:00–11:00', subject: 'VLSI Design', room: 'Block B / 201', dept: 'ECE', sec: 'B', faculty: 'Prof. Meena Iyer', registered: 38, present: 0 },
    { time: '11:00–12:00', subject: 'Thermodynamics', room: 'Block C / 301', dept: 'ME', sec: 'A', faculty: 'Dr. Suresh Nair', registered: 44, present: 0 },
    { time: '12:00–13:00', subject: 'Machine Learning', room: 'Block A / Lab A1', dept: 'CSE', sec: 'B', faculty: 'Dr. Priya Kapoor', registered: 40, present: 0 },
    { time: '14:00–15:00', subject: 'Fluid Mechanics', room: 'Block C / 302', dept: 'CE', sec: 'A', faculty: 'Prof. Arun Bose', registered: 36, present: 0 },
    { time: '15:00–16:00', subject: 'Cybersecurity', room: 'Block A / Lab A2', dept: 'IT', sec: 'C', faculty: 'Dr. Ritu Sharma', registered: 41, present: 0 },
    { time: '16:00–17:00', subject: 'Control Systems', room: 'Block B / Seminar B', dept: 'ECE', sec: 'A', faculty: 'Prof. Vikash Gupta', registered: 39, present: 0 }
  ];
  periods.forEach(p => { p.present = randInt(Math.floor(p.registered * .6), p.registered + 1) });
  return periods;
}

export interface Log {
  id: number;
  st: Student;
  status: 'present' | 'late' | 'unknown';
  conf: number;
  time: string;
  cam: string;
  room: string;
  fresh?: boolean;
}

export function genLogs(students: Student[], cameras: Camera[]): Log[] {
  const logs: Log[] = [];
  const cams = cameras.filter(c => c.status === 'online');
  for (let i = 0; i < 40; i++) {
    const st = choice(students);
    const pool = ['present', 'present', 'present', 'present', 'late', 'unknown'] as const;
    const status = choice([...pool]);
    const conf = status === 'unknown' ? randInt(20, 45) : randInt(82, 99);
    const cam = cams.length ? choice(cams) : cameras[0];
    if (!cam || !st) continue;
    const t = new Date(Date.now() - (i * 420000 + Math.random() * 300000));
    logs.push({
      id: i, st, status, conf,
      time: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      cam: cam.id, room: cam.room || 'Entry'
    });
  }
  return logs;
}

export function fmtDate() { return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }) }
export function fmtShort(d: Date) { return d instanceof Date ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) : String(d || '') }
export function pct(a: number, b: number) { return Math.round(a / b * 100) }
export function ini(n: string) { return n.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase() }
export function clr(v: number) { return v >= 80 ? 'var(--green)' : v >= 65 ? 'var(--amber)' : 'var(--red)' }
export function bcls(v: number) { return v >= 80 ? 'bg' : v >= 65 ? 'ba' : 'br' }
