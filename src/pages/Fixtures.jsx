import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';

const LEAGUE_TABLE = [
  { pos: 1, club: 'FC Vanguard',  p: 28, w: 18, d: 7, l: 3,  gf: 58, ga: 22, pts: 61, form: ['W','W','D','W','W'] },
  { pos: 2, club: 'Riverside FC', p: 28, w: 17, d: 5, l: 6,  gf: 52, ga: 28, pts: 56, form: ['W','L','W','W','D'] },
  { pos: 3, club: 'North City',   p: 28, w: 15, d: 8, l: 5,  gf: 47, ga: 24, pts: 53, form: ['D','W','W','D','W'] },
  { pos: 4, club: 'Eastford AFC', p: 28, w: 14, d: 6, l: 8,  gf: 44, ga: 35, pts: 48, form: ['L','W','D','W','L'] },
  { pos: 5, club: 'Southern Utd', p: 28, w: 12, d: 9, l: 7,  gf: 40, ga: 33, pts: 45, form: ['D','D','W','L','W'] },
  { pos: 6, club: 'West Park',    p: 28, w: 11, d: 7, l: 10, gf: 35, ga: 40, pts: 40, form: ['L','W','L','D','W'] },
  { pos: 7, club: 'Central Town', p: 28, w: 10, d: 8, l: 10, gf: 38, ga: 42, pts: 38, form: ['W','L','L','W','D'] },
  { pos: 8, club: 'Harbor City',  p: 28, w: 9,  d: 6, l: 13, gf: 32, ga: 48, pts: 33, form: ['L','L','W','L','D'] },
];

function FormBadge({ result }) {
  const colors = { W: 'bg-green-500', D: 'bg-yellow-500', L: 'bg-red-500' };
  return <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-white text-xs font-bold ${colors[result]}`}>{result}</span>;
}

export default function Fixtures() {
  const { data: matches, loading } = useFetch('/matches');
  const [tab, setTab] = useState('fixtures');

  const all = matches || [];
  const upcoming  = all.filter((m) => m.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
  const completed = all.filter((m) => m.status === 'completed').sort((a, b) => new Date(b.date) - new Date(a.date));

  function MatchRow({ match }) {
    const isCompleted = match.status === 'completed';
    const date = new Date(match.date);
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700 hover:border-gold-500/40 transition-colors">
        <div className="text-xs text-gray-400 min-w-[60px] text-center">
          <div className="font-bold text-gray-700 dark:text-gray-200">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
          <div>{date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-gold-500 font-semibold mt-0.5">MD{match.matchday}</div>
        </div>
        <div className="flex-1 flex items-center justify-between gap-3">
          <span className="font-heading text-sm sm:text-base text-navy-900 dark:text-white text-right flex-1">{match.homeTeam}</span>
          {isCompleted ? (
            <span className="px-4 py-1.5 bg-navy-900 dark:bg-navy-950 rounded-lg font-heading text-gold-400 text-lg whitespace-nowrap">
              {match.homeScore} – {match.awayScore}
            </span>
          ) : (
            <span className="px-3 py-1 bg-gold-500/10 border border-gold-500/30 rounded text-gold-600 dark:text-gold-400 text-xs font-bold uppercase">
              vs
            </span>
          )}
          <span className="font-heading text-sm sm:text-base text-navy-900 dark:text-white text-left flex-1">{match.awayTeam}</span>
        </div>
        <div className="text-xs text-gray-400 min-w-[80px] text-center hidden sm:block">
          {match.competition}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-52 md:h-64 bg-navy-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&q=60')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative text-center">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">Season 2024/25</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide">Fixtures & Results</h1>
        </div>
      </div>

      <section className="py-12 bg-white dark:bg-navy-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 mb-8 bg-gray-100 dark:bg-navy-900 rounded-xl p-1 w-fit">
            {[['fixtures', 'Fixtures'], ['results', 'Results'], ['table', 'League Table']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${tab === v ? 'bg-gold-500 text-navy-900 shadow' : 'text-gray-600 dark:text-gray-300 hover:text-navy-900 dark:hover:text-white'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-navy-800 animate-pulse" />)}</div>
          ) : (
            <>
              {tab === 'fixtures' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {upcoming.length > 0 ? upcoming.map((m) => <MatchRow key={m._id} match={m} />) : <p className="text-gray-400 py-10 text-center">No upcoming fixtures.</p>}
                </motion.div>
              )}

              {tab === 'results' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {completed.length > 0 ? completed.map((m) => <MatchRow key={m._id} match={m} />) : <p className="text-gray-400 py-10 text-center">No results yet.</p>}
                </motion.div>
              )}

              {tab === 'table' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto rounded-xl shadow-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy-900 text-white">
                        {['#', 'Club', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'PTS', 'Form'].map((h) => (
                          <th key={h} className="py-4 px-3 text-center font-heading tracking-wider first:text-left first:px-5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {LEAGUE_TABLE.map((row, i) => {
                        const isUs = row.club === 'FC Vanguard';
                        return (
                          <tr key={row.pos} className={`border-b border-gray-200 dark:border-navy-800 ${isUs ? 'bg-gold-500/10' : i % 2 === 0 ? 'bg-white dark:bg-navy-900' : 'bg-gray-50 dark:bg-navy-800/50'}`}>
                            <td className="py-3.5 px-5 font-bold text-gray-500 dark:text-gray-400">{row.pos}</td>
                            <td className="py-3.5 px-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                              {isUs && <span className="inline-block w-2 h-2 rounded-full bg-gold-500 mr-2" />}{row.club}
                            </td>
                            <td className="py-3.5 px-3 text-center text-gray-600 dark:text-gray-300">{row.p}</td>
                            <td className="py-3.5 px-3 text-center text-green-600 dark:text-green-400 font-medium">{row.w}</td>
                            <td className="py-3.5 px-3 text-center text-yellow-600 dark:text-yellow-400 font-medium">{row.d}</td>
                            <td className="py-3.5 px-3 text-center text-red-600 dark:text-red-400 font-medium">{row.l}</td>
                            <td className="py-3.5 px-3 text-center text-gray-600 dark:text-gray-300">{row.gf}</td>
                            <td className="py-3.5 px-3 text-center text-gray-600 dark:text-gray-300">{row.ga}</td>
                            <td className="py-3.5 px-3 text-center text-gray-600 dark:text-gray-300">{row.gf - row.ga > 0 ? `+${row.gf - row.ga}` : row.gf - row.ga}</td>
                            <td className={`py-3.5 px-3 text-center font-bold text-base ${isUs ? 'text-gold-600 dark:text-gold-400' : 'text-gray-900 dark:text-white'}`}>{row.pts}</td>
                            <td className="py-3.5 px-3">
                              <div className="flex gap-1 justify-center">{row.form.map((f, j) => <FormBadge key={j} result={f} />)}</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
