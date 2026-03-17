import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import GeneratePlanPage from './pages/GeneratePlanPage';
import ChatbotPage from './pages/ChatbotPage';
import LocatePage from './pages/LocatePage';
import EventsPage from './pages/EventsPage';
import DemosPage from './pages/DemosPage';

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <Routes>
            {/* Landing page – full width, no sidebar */}
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                  <Navbar />
                  <LandingPage />
                </div>
              }
            />

            {/* App pages – with sidebar layout */}
            <Route
              path="/dashboard"
              element={<AppLayout><DashboardPage /></AppLayout>}
            />
            <Route
              path="/generate"
              element={<AppLayout><GeneratePlanPage /></AppLayout>}
            />
            <Route
              path="/chat"
              element={<AppLayout><ChatbotPage /></AppLayout>}
            />
            <Route
              path="/locate"
              element={<AppLayout><LocatePage /></AppLayout>}
            />
            <Route
              path="/events"
              element={<AppLayout><EventsPage /></AppLayout>}
            />
            <Route
              path="/demos"
              element={<AppLayout><DemosPage /></AppLayout>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

