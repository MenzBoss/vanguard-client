import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, TrendingUp, TrendingDown, UserX } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';

const TYPE_CONFIG = {
  IN:       { label: 'Signed',   bg: 'bg-green-500/10',  text: 'text-green-600 dark:text-green-400', border: 'border-green-500/30', icon: TrendingUp },
  OUT:      { label: 'Departed', bg: 'bg-red-500/10',    text: 'text-red-600 dark:text-red-400',     border: 'border-red-500/30',   icon: TrendingDown },
  'LOAN IN':  { label: 'Loan In',  bg: 'bg-blue-500/10',  text: 'text-blue-600 dark:text-blue-400',   border: 'border-blue-500/30',  icon: TrendingUp },
  'LOAN OUT': { label: 'Loan Out', bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30', icon: TrendingDown },
};

export default function Transfers() {
  const [filterType, setFilterType] = useState('');
  const url = `/transfers${filterType ? `?type=${filterType}` : ''}`;
  const { data: transfers, loading } = useFetch(url, [filterType]);

  function TransferCard({ transfer, i }) {
    const cfg = TYPE_CONFIG[transfer.type] || TYPE_CONFIG.IN;
    const Icon = cfg.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.07 }}
        className="card group flex flex-col overflow-hidden"
      >
        {/* Player Image */}
        <div className="relative overflow-hidden h-64 bg-navy-200 dark:bg-navy-800">
          {transfer.photo ? (
            <img
              src={transfer.photo}
              alt={transfer.playerName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-200 to-navy-300 dark:from-navy-800 dark:to-navy-900">
              <UserX size={48} className="text-gray-400" />
            </div>
          )}
          {/* Transfer Type Badge */}
          <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded ${cfg.text} ${cfg.bg} border ${cfg.border} backdrop-blur-sm`}>
            <Icon size={14} /> {cfg.label}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Player Info */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-heading text-xl text-navy-900 dark:text-white mb-2">
            {transfer.playerName}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span className="font-semibold">{transfer.position}</span> · {transfer.nationality}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {transfer.type === 'IN' || transfer.type === 'LOAN IN' ? (
              <span>From <strong className="text-navy-900 dark:text-white">{transfer.fromClub || 'Unknown'}</strong></span>
            ) : (
              <span>To <strong className="text-navy-900 dark:text-white">{transfer.toClub || 'Unknown'}</strong></span>
            )}
          </div>
          <div className="mt-auto pt-3 border-t border-gray-200 dark:border-navy-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Transfer Fee</span>
              <span className="text-sm font-bold text-gold-500">{transfer.fee}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="relative h-52 md:h-64 bg-navy-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=60')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative text-center">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">Season 2024/25</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide flex items-center gap-3 justify-center">
            <ArrowRightLeft size={32} className="text-gold-400" /> Transfers
          </h1>
        </div>
      </div>

      <section className="py-12 bg-white dark:bg-navy-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filter */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {[{ v: '', l: 'All' }, { v: 'IN', l: 'Arrivals' }, { v: 'OUT', l: 'Departures' }, { v: 'LOAN IN', l: 'Loan In' }, { v: 'LOAN OUT', l: 'Loan Out' }].map(({ v, l }) => (
              <button key={v} onClick={() => setFilterType(v)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${filterType === v ? 'bg-gold-500 text-navy-900' : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gold-100'}`}>
                {l}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="h-96 rounded-xl bg-gray-100 dark:bg-navy-800 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(transfers || []).map((t, i) => <TransferCard key={t._id} transfer={t} i={i} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
