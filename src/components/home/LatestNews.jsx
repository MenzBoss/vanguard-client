import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';

function NewsCard({ article, index }) {
  const date = new Date(article.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
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
          <span>{date}</span>
        </div>
        <h3 className="font-heading text-lg text-navy-900 dark:text-white mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors">
          <Link to={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
        <Link
          to={`/news/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-gold-500 text-sm font-semibold hover:gap-3 transition-all"
        >
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}

export default function LatestNews() {
  const { data, loading } = useFetch('/news/featured');

  return (
    <section className="py-20 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-1">Stay Updated</p>
            <h2 className="section-title">Latest <span className="section-title-accent">News</span></h2>
          </div>
          <Link to="/news" className="hidden sm:flex items-center gap-1.5 text-gold-500 font-semibold text-sm hover:gap-3 transition-all">
            All News <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-80 animate-pulse bg-gray-200 dark:bg-navy-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data || []).slice(0, 6).map((article, i) => (
              <NewsCard key={article._id} article={article} index={i} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/news" className="btn-outline inline-flex items-center gap-2">
            All News <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
