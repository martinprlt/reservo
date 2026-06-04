import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './store/themeContext';
import { LanguageProvider } from './store/languageContext';
import { ToastProvider } from './store/toastContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/booking/BookingPage';
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/admin/PrivateRoute';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/booking/confirmacion" element={<BookingPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/superadmin/*"
                  element={
                    <PrivateRoute requiredRole="SUPER_ADMIN">
                      <SuperAdminLayout />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
