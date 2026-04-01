import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import Team from './pages/Team';
import Transfers from './pages/Transfers';
import Fixtures from './pages/Fixtures';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageNews from './pages/admin/ManageNews';
import ManagePlayers from './pages/admin/ManagePlayers';
import ManageMatches from './pages/admin/ManageMatches';
import ManageGallery from './pages/admin/ManageGallery';
import ManageVideos from './pages/admin/ManageVideos';
import ManageTransfers from './pages/admin/ManageTransfers';
import AdminLayout from './components/admin/AdminLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="news" element={<News />} />
              <Route path="news/:slug" element={<NewsArticle />} />
              <Route path="team" element={<Team />} />
              <Route path="transfers" element={<Transfers />} />
              <Route path="fixtures" element={<Fixtures />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="news" element={<ManageNews />} />
              <Route path="players" element={<ManagePlayers />} />
              <Route path="matches" element={<ManageMatches />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="videos" element={<ManageVideos />} />
              <Route path="transfers" element={<ManageTransfers />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
