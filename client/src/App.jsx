import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/booking/BookingPage';
import LoginPage from './pages/admin/LoginPage';
import AgendaPage from './pages/admin/AgendaPage';
import PrivateRoute from './components/admin/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AgendaPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
