import { motion } from 'framer-motion';

const SAMPLE_TABLE = [
  { pos: 1, club: 'FC Vanguard', played: 28, won: 18, drawn: 7, lost: 3, pts: 61 },
  { pos: 2, club: 'Riverside FC', played: 28, won: 17, drawn: 5, lost: 6, pts: 56 },
  { pos: 3, club: 'North City', played: 28, won: 15, drawn: 8, lost: 5, pts: 53 },
  { pos: 4, club: 'Eastford AFC', played: 28, won: 14, drawn: 6, lost: 8, pts: 48 },
  { pos: 5, club: 'Southern Utd', played: 28, won: 12, drawn: 9, lost: 7, pts: 45 },
  { pos: 6, club: 'West Park', played: 28, won: 11, drawn: 7, lost: 10, pts: 40 },
];

export default function LeagueTable() {
  return (
    <section className="py-20 bg-white dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-1">Premier Division</p>
          <h2 className="section-title">League <span className="section-title-accent">Standings</span></h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-xl shadow-lg"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-900 text-white">
                <th className="py-4 px-4 text-left font-heading tracking-wider">#</th>
                <th className="py-4 px-4 text-left font-heading tracking-wider">Club</th>
                <th className="py-4 px-3 text-center font-heading tracking-wider">P</th>
                <th className="py-4 px-3 text-center font-heading tracking-wider">W</th>
                <th className="py-4 px-3 text-center font-heading tracking-wider">D</th>
                <th className="py-4 px-3 text-center font-heading tracking-wider">L</th>
                <th className="py-4 px-4 text-center font-heading tracking-wider text-gold-400">PTS</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_TABLE.map((row, i) => {
                const isOurClub = row.club === 'FC Vanguard';
                return (
                  <tr
                    key={row.pos}
                    className={`border-b border-gray-100 dark:border-navy-800 transition-colors ${
                      isOurClub
                        ? 'bg-gold-500/10 dark:bg-gold-500/10'
                        : i % 2 === 0
                        ? 'bg-white dark:bg-navy-900'
                        : 'bg-gray-50 dark:bg-navy-800/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-gray-500 dark:text-gray-400">{row.pos}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2 whitespace-nowrap">
                      {isOurClub && <span className="w-2 h-2 rounded-full bg-gold-500" />}
                      {row.club}
                    </td>
                    <td className="py-3.5 px-3 text-center text-gray-600 dark:text-gray-300">{row.played}</td>
                    <td className="py-3.5 px-3 text-center text-green-600 dark:text-green-400 font-medium">{row.won}</td>
                    <td className="py-3.5 px-3 text-center text-yellow-600 dark:text-yellow-400 font-medium">{row.drawn}</td>
                    <td className="py-3.5 px-3 text-center text-red-600 dark:text-red-400 font-medium">{row.lost}</td>
                    <td className={`py-3.5 px-4 text-center font-bold ${isOurClub ? 'text-gold-600 dark:text-gold-400' : 'text-gray-900 dark:text-white'}`}>{row.pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
