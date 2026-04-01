import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '../hooks/useFetch';
import { Shield, Star } from 'lucide-react';

const POSITIONS = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

function PlayerCard({ player, index }) {
  const posColor = {
    Goalkeeper: 'bg-yellow-500',
    Defender: 'bg-blue-500',
    Midfielder: 'bg-green-500',
    Forward: 'bg-red-500',
  }[player.position] || 'bg-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.06, 0.5) }}
      className="group relative bg-white dark:bg-navy-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Jersey number */}
      <div className="absolute top-3 right-3 z-10 w-9 h-9 bg-navy-900/80 dark:bg-black/60 rounded-full flex items-center justify-center">
        <span className="font-heading text-gold-400 text-sm font-bold">{player.number}</span>
      </div>

      {/* Photo */}
      <div className="relative h-64 bg-gradient-to-b from-navy-800 to-navy-900 overflow-hidden">
        {player.photo ? (
          <img src={player.photo} alt={player.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Shield size={60} className="text-navy-700" />
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-navy-900 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className={`inline-block px-2 py-0.5 rounded text-white text-xs font-bold uppercase tracking-wider mb-1.5 ${posColor}`}>
          {player.position}
        </div>
        <h3 className="font-heading text-lg text-navy-900 dark:text-white truncate">{player.name}</h3>
        {player.nationality && (
          <p className="text-gray-400 text-xs mt-0.5">{player.nationality}</p>
        )}
        {(player.goals > 0 || player.appearances > 0) && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-navy-800 text-xs text-gray-500 dark:text-gray-400">
            <span><strong className="text-navy-900 dark:text-white">{player.appearances}</strong> Apps</span>
            <span><strong className="text-navy-900 dark:text-white">{player.goals}</strong> Goals</span>
            <span><strong className="text-navy-900 dark:text-white">{player.assists}</strong> Assists</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Team() {
  const { data: players, loading } = useFetch('/players');
  const [posFilter, setPosFilter] = useState('All');

  const filtered = posFilter === 'All'
    ? (players || [])
    : (players || []).filter((p) => p.position === posFilter);

  const grouped = {
    Goalkeeper: filtered.filter((p) => p.position === 'Goalkeeper'),
    Defender: filtered.filter((p) => p.position === 'Defender'),
    Midfielder: filtered.filter((p) => p.position === 'Midfielder'),
    Forward: filtered.filter((p) => p.position === 'Forward'),
  };

  return (
    <>
      <div className="relative h-52 md:h-64 bg-navy-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=60')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative text-center">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">Season 2024/25</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide">The Squad</h1>
        </div>
      </div>

      <section className="py-12 bg-white dark:bg-navy-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                onClick={() => setPosFilter(pos)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  posFilter === pos ? 'bg-gold-500 text-navy-900' : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gold-100 dark:hover:bg-navy-700'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <div key={i} className="h-80 rounded-xl bg-gray-100 dark:bg-navy-800 animate-pulse" />)}
            </div>
          ) : (
            <>
              {posFilter === 'All' ? (
                Object.entries(grouped).map(([pos, group]) =>
                  group.length > 0 ? (
                    <div key={pos} className="mb-12">
                      <h2 className="font-heading text-2xl text-navy-900 dark:text-white uppercase mb-5 flex items-center gap-2">
                        <span className="text-gold-500">{pos}s</span>
                        <span className="text-base text-gray-400 font-normal">({group.length})</span>
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {group.map((p, i) => <PlayerCard key={p._id} player={p} index={i} />)}
                      </div>
                    </div>
                  ) : null
                )
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {filtered.map((p, i) => <PlayerCard key={p._id} player={p} index={i} />)}
                </div>
              )}
              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">No players found.</div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
