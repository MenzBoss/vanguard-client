import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { motion } from 'framer-motion';

function TeamBadge({ name }) {
  const isHome = name === 'FC Vanguard';
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading text-xs font-bold ${isHome ? 'bg-gold-500 text-navy-900' : 'bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300'}`}>
        {name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
      </div>
      <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 max-w-[70px] leading-tight">{name}</span>
    </div>
  );
}

export default function FixturesWidget() {
  const { data: upcoming } = useFetch('/matches/upcoming');
  const { data: results } = useFetch('/matches/results');

  return (
    <section className="py-20 bg-white dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-1">Schedule</p>
            <h2 className="font-heading text-3xl md:text-4xl uppercase text-navy-900 dark:text-white">
              Fixtures & <span className="text-gold-500">Results</span>
            </h2>
          </div>
          <Link to="/fixtures" className="hidden sm:flex items-center gap-1.5 text-gold-500 font-semibold text-sm hover:gap-3 transition-all">
            Full Schedule <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming */}
          <div>
            <h3 className="font-heading text-lg text-navy-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={16} className="text-gold-500" /> Upcoming
            </h3>
            <div className="space-y-3">
              {(upcoming || []).slice(0, 3).map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 dark:bg-navy-800/80 border border-gray-200 dark:border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gold-500 font-medium uppercase tracking-wider">{m.competition} · MD{m.matchday}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <TeamBadge name={m.homeTeam} />
                    <div className="text-center">
                      <div className="text-navy-900 dark:text-white font-heading text-xl">VS</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">{new Date(m.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <TeamBadge name={m.awayTeam} />
                  </div>
                </motion.div>
              ))}
              {(!upcoming || upcoming.length === 0) && (
                <p className="text-gray-400 text-sm text-center py-6">No upcoming fixtures</p>
              )}
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="font-heading text-lg text-navy-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-gold-500" /> Recent Results
            </h3>
            <div className="space-y-3">
              {(results || []).slice(0, 3).map((m, i) => {
                const isHome = m.homeTeam === 'FC Vanguard';
                const ourScore = isHome ? m.homeScore : m.awayScore;
                const theirScore = isHome ? m.awayScore : m.homeScore;
                const result = ourScore > theirScore ? 'W' : ourScore === theirScore ? 'D' : 'L';
                const resultColor = result === 'W' ? 'text-green-500' : result === 'D' ? 'text-yellow-500' : 'text-red-500';
                return (
                  <motion.div
                    key={m._id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gray-50 dark:bg-navy-800/80 border border-gray-200 dark:border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gold-500 font-medium uppercase tracking-wider">{m.competition} · MD{m.matchday}</span>
                      <span className={`text-xs font-bold ${resultColor}`}>{result}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <TeamBadge name={m.homeTeam} />
                      <div className="text-center">
                        <div className="font-heading text-2xl text-navy-900 dark:text-white">{m.homeScore} – {m.awayScore}</div>
                      </div>
                      <TeamBadge name={m.awayTeam} />
                    </div>
                  </motion.div>
                );
              })}
              {(!results || results.length === 0) && (
                <p className="text-gray-400 text-sm text-center py-6">No results yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
