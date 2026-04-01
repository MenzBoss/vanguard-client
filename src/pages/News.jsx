import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Club News', 'Match Report', 'Transfer', 'Youth', 'Community'];

function PageBanner() {
  return (
    <div className="relative h-52 md:h-64 bg-navy-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=60')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="relative text-center">
        <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">FC Vanguard</p>
        <h1 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide">Latest News</h1>
      </div>
    </div>
  );
}

export default function News() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const url = `/news?page=${page}&limit=9${category ? `&category=${category}` : ''}`;
  const { data, loading } = useFetch(url, [page, category]);

  const articles = data?.news || [];
  const pages = data?.pages || 1;

  const filtered = search
    ? articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
    : articles;

  return (
    <>
      <PageBanner />
      <section className="py-12 bg-white dark:bg-navy-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    (cat === 'All' && !category) || category === cat
                      ? 'bg-gold-500 text-navy-900'
                      : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gold-100 dark:hover:bg-navy-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search news..."
                className="pl-9 pr-4 py-2 rounded-full bg-gray-100 dark:bg-navy-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 w-full sm:w-56"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-gray-100 dark:bg-navy-800 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No articles found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <motion.article
                  key={article._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card group flex flex-col"
                >
                  <Link to={`/news/${article.slug}`} className="relative overflow-hidden h-52 block">
                    <img
                      src={article.image || `https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=600&q=80`}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-gold-500 text-navy-900 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {article.category}
                    </span>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
                      <Calendar size={12} />
                      <span>{new Date(article.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h3 className="font-heading text-lg text-navy-900 dark:text-white mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors">
                      <Link to={`/news/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
                    <Link to={`/news/${article.slug}`} className="inline-flex items-center gap-1.5 text-gold-500 text-sm font-semibold hover:gap-3 transition-all">
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && !search && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-full bg-gray-100 dark:bg-navy-800 disabled:opacity-40 hover:bg-gold-500 hover:text-navy-900 transition-colors">
                <ChevronLeft size={18} />
              </button>
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${page === i + 1 ? 'bg-gold-500 text-navy-900' : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gold-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="p-2 rounded-full bg-gray-100 dark:bg-navy-800 disabled:opacity-40 hover:bg-gold-500 hover:text-navy-900 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
