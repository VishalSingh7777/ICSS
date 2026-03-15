import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Overview } from './components/Overview';
import { Monitor } from './components/Monitor';
import { CameraNet } from './components/CameraNet';
import { Students } from './components/Students';
import { Attendance } from './components/Attendance';
import { Analytics } from './components/Analytics';
import { Alerts } from './components/Alerts';
import { Settings } from './components/Settings';
import { DetailPanel } from './components/DetailPanel';

const MainContent: React.FC = () => {
  const { page, selectedStudent } = useAppContext();

  const renderPage = () => {
    switch (page) {
      case 'overview': return <Overview />;
      case 'monitor': return <Monitor />;
      case 'cameras': return <CameraNet />;
      case 'students': return <Students />;
      case 'attendance': return <Attendance />;
      case 'analytics': return <Analytics />;
      case 'alerts': return <Alerts />;
      case 'settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--t1)] font-sans text-[13px] leading-[1.5]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col min-w-0">
            {renderPage()}
          </div>
          {page === 'students' && selectedStudent && <DetailPanel />}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
