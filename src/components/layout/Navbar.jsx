import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Trophy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/news', label: 'News' },
  { to: '/team', label: 'Team' },
  { to: '/transfers', label: 'Transfers' },
  { to: '/fixtures', label: 'Fixtures' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-navy-900 shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gold-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-navy-900" />
            </div>
            <div className="leading-none">
              <span className="block font-heading text-white text-lg md:text-xl tracking-widest">FC</span>
              <span className="block font-heading text-gold-400 text-lg md:text-xl tracking-widest -mt-1">VANGUARD</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded text-sm font-medium uppercase tracking-wider transition-colors duration-200 ${
                    isActive ? 'text-gold-400' : 'text-gray-300 hover:text-gold-400'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-full text-gray-300 hover:text-gold-400 hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden p-2 rounded-full text-gray-300 hover:text-gold-400 hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-900 border-t border-white/10"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `py-2.5 px-3 rounded text-sm font-medium uppercase tracking-wider transition-colors ${
                      isActive ? 'text-gold-400 bg-white/5' : 'text-gray-300 hover:text-gold-400 hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
