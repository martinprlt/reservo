import { Routes, Route, Navigate } from 'react-router-dom';
import AgendaPage from './AgendaPage';

export default function AdminLayout() {
  return (
    <Routes>
      <Route path="/" element={<AgendaPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
