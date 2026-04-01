import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Newspaper, Users, Calendar,
  Image, ArrowRightLeft, LogOut, Menu, X, Trophy, ExternalLink, PlayCircle
} from 'lucide-react';

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/news', icon: Newspaper, label: 'News' },
  { to: '/admin/players', icon: Users, label: 'Players' },
  { to: '/admin/matches', icon: Calendar, label: 'Matches' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/videos', icon: PlayCircle, label: 'Videos' },
  { to: '/admin/transfers', icon: ArrowRightLeft, label: 'Transfers' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = () => (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-900 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
            <Trophy size={14} className="text-navy-900" />
          </div>
          <span className="font-heading text-white text-sm tracking-widest">FC VANGUARD</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {adminLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-gold-500 text-navy-900' : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link to="/" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white text-xs transition-colors">
          <ExternalLink size={14} /> View Site
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex">
      <Sidebar />
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700 flex items-center px-5 gap-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <Menu size={22} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{admin?.name}</p>
              <p className="text-xs text-gray-400">{admin?.email}</p>
            </div>
            <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center font-heading text-navy-900 font-bold text-sm">
              {admin?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
