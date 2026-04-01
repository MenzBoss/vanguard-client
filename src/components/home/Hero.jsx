import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 hero-gradient" />

      {/* Decorative stripes */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-y-0 left-1/4 w-px bg-gold-500" />
        <div className="absolute inset-y-0 right-1/4 w-px bg-gold-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/40 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-gold-300 text-sm font-medium uppercase tracking-widest">Season 2024/25</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-5xl sm:text-7xl md:text-8xl text-white leading-none mb-4 uppercase"
        >
          FC <span className="text-gold-400">Vanguard</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-300 text-lg sm:text-xl mb-10 max-w-xl mx-auto"
        >
          Where passion meets excellence. Hear the roar of the crowd. Feel the beautiful game.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/fixtures" className="btn-primary flex items-center justify-center gap-2">
            <span>Next Match</span>
          </Link>
          <Link to="/news" className="btn-outline flex items-center justify-center gap-2">
            <Play size={16} />
            <span>Latest News</span>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          {[{ value: '37', label: 'Years of History' }, { value: '12', label: 'Trophies Won' }, { value: '5K+', label: 'Fan Members' }].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-heading text-3xl text-gold-400">{value}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400"
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}
