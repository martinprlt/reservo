import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './store/themeContext';
import { LanguageProvider } from './store/languageContext';
import { ToastProvider } from './store/toastContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import PrivateRoute from './components/admin/PrivateRoute';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const BookingPage = lazy(() => import('./pages/booking/BookingPage'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const RegisterPage = lazy(() => import('./pages/admin/RegisterPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const SuperAdminLayout = lazy(() => import('./pages/superadmin/SuperAdminLayout'));
const NotFound = lazy(() => import('./pages/NotFound'));

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-on-surface-variant text-sm font-body">Cargando...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/booking/confirmacion" element={<BookingPage />} />
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route path="/registro" element={<RegisterPage />} />
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
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
