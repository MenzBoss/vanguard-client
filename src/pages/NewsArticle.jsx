import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { motion } from 'framer-motion';

export default function NewsArticle() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(`/news/${slug}`, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
      <p>Article not found.</p>
      <Link to="/news" className="btn-primary">Back to News</Link>
    </div>
  );

  const { article, related } = data;
  const date = new Date(article.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="py-10 bg-white dark:bg-navy-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-gold-500 text-sm font-semibold mb-8 hover:-translate-x-1 transition-transform">
          <ArrowLeft size={16} /> Back to News
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-6">
            <span className="inline-block bg-gold-500 text-navy-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-4">
              {article.category}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-navy-900 dark:text-white leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Calendar size={14} />
              <span>{date}</span>
            </div>
          </div>

          {/* Featured image */}
          {article.image && (
            <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
              <img src={article.image} alt={article.title} className="w-full h-72 sm:h-96 object-cover" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-gold-500 prose-strong:text-navy-900 dark:prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </motion.div>

        {/* Related */}
        {related && related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-navy-800">
            <h3 className="font-heading text-2xl text-navy-900 dark:text-white uppercase mb-6">Related <span className="text-gold-500">Articles</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r._id} to={`/news/${r.slug}`} className="card group">
                  <div className="overflow-hidden h-36">
                    <img src={r.image || ''} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-heading text-sm text-navy-900 dark:text-white group-hover:text-gold-500 transition-colors line-clamp-2">{r.title}</h4>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                      <Calendar size={11} />
                      <span>{new Date(r.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
