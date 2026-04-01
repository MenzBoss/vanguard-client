import { useFetch } from '../../hooks/useFetch';
import { Newspaper, Users, Calendar, Image, ArrowRightLeft, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-navy-900 rounded-xl p-5 shadow flex items-center gap-4 border border-gray-100 dark:border-navy-700">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-heading text-navy-900 dark:text-white font-bold">{value ?? '–'}</div>
        <div className="text-gray-400 text-xs uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: news } = useFetch('/news/admin/all');
  const { data: players } = useFetch('/players/admin/all');
  const { data: matches } = useFetch('/matches');
  const { data: gallery } = useFetch('/gallery');
  const { data: transfers } = useFetch('/transfers');

  const upcomingCount = (matches || []).filter((m) => m.status === 'upcoming').length;
  const recentNews = (news || []).slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-navy-900 dark:text-white uppercase">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome to the FC Vanguard admin panel</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard icon={Newspaper} label="News Articles" value={news?.length} color="bg-blue-500" />
        <StatCard icon={Users} label="Players" value={players?.length} color="bg-green-500" />
        <StatCard icon={Calendar} label="Upcoming" value={upcomingCount} color="bg-gold-500" />
        <StatCard icon={Image} label="Gallery" value={gallery?.length} color="bg-purple-500" />
        <StatCard icon={ArrowRightLeft} label="Transfers" value={transfers?.length} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent news */}
        <div className="bg-white dark:bg-navy-900 rounded-xl p-5 shadow border border-gray-100 dark:border-navy-700">
          <h2 className="font-heading text-lg text-navy-900 dark:text-white uppercase mb-4 flex items-center gap-2">
            <Newspaper size={18} className="text-gold-500" /> Recent Articles
          </h2>
          <div className="space-y-3">
            {recentNews.map((a) => (
              <div key={a._id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-navy-800 last:border-0">
                {a.image && <img src={a.image} alt="" className="w-10 h-10 rounded object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy-900 dark:text-white font-medium truncate">{a.title}</p>
                  <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${a.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {a.published ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
            {(!news || news.length === 0) && <p className="text-gray-400 text-sm">No articles yet.</p>}
          </div>
        </div>

        {/* Upcoming matches */}
        <div className="bg-white dark:bg-navy-900 rounded-xl p-5 shadow border border-gray-100 dark:border-navy-700">
          <h2 className="font-heading text-lg text-navy-900 dark:text-white uppercase mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-gold-500" /> Upcoming Matches
          </h2>
          <div className="space-y-3">
            {(matches || []).filter((m) => m.status === 'upcoming').slice(0, 5).map((m) => (
              <div key={m._id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-navy-800 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">{m.homeTeam} vs {m.awayTeam}</p>
                  <p className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className="text-xs text-gold-500 font-bold">{m.competition}</span>
              </div>
            ))}
            {(!matches || matches.filter((m) => m.status === 'upcoming').length === 0) && <p className="text-gray-400 text-sm">No upcoming matches.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
