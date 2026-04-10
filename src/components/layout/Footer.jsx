import { Link } from 'react-router-dom';
import { Trophy, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = [
  { section: 'Club', links: [{ to: '/team', label: 'Squad' }, { to: '/transfers', label: 'Transfers' }, { to: '/fixtures', label: 'Fixtures' }] },
  { section: 'Media', links: [{ to: '/news', label: 'News' }, { to: '/gallery', label: 'Gallery' }] },
//   { section: 'Info', links: [{ to: '/contact', label: 'Contact Us' }, { to: '/admin', label: 'Admin' }] },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300">
      {/* Top bar */}
      <div className="bg-gold-500 h-1 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-navy-900" />
              </div>
              <div className="leading-none">
                <span className="block font-heading text-white text-xl tracking-widest">FC</span>
                <span className="block font-heading text-gold-400 text-xl tracking-widest -mt-1">VANGUARD</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              FC Vanguard — where passion meets excellence. Proudly serving our community since 1987.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Youtube, href: 'https://www.youtube.com/@GilbertFrimpong' }
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-colors text-gray-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map(({ section, links }) => (
            <div key={section}>
              <h4 className="font-heading text-white uppercase tracking-wider mb-4 text-sm border-b border-white/10 pb-2">{section}</h4>
              <ul className="space-y-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-heading text-white uppercase tracking-wider mb-4 text-sm border-b border-white/10 pb-2">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 text-gold-500 shrink-0" /><span>Vanguard Stadium, 1 Club Road, FC City, FC 12345</span></li>
              <li className="flex items-center gap-2"><Phone size={15} className="text-gold-500 shrink-0" />+1 (555) 000-1234</li>
              <li className="flex items-center gap-2"><Mail size={15} className="text-gold-500 shrink-0" />info@fcvanguard.com</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} FC Vanguard. All Rights Reserved.</span>
          <span>Built with passion for the beautiful game</span>
        </div>
      </div>
    </footer>
  );
}
