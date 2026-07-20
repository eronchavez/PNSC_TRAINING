import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import CarparkListPage from './CarparkListPage';
import CarparkDetailPage from './CarparkDetailPage';
import SettingsPage from './SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/carparks" replace />} />
        <Route path="carparks" element={<CarparkListPage />} />
        <Route path="carparks/:carparkId" element={<CarparkDetailPage />} />
        <Route path="events" element={<p className="state-message">Events — Coming soon</p>} />
        <Route path="weather" element={<p className="state-message">Weather — Coming soon</p>} />
        <Route path="travel" element={<p className="state-message">Travel — Coming soon</p>} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
