import { Link } from 'react-router-dom';
import { ArrowRight, Image } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { motion } from 'framer-motion';

export default function GalleryPreview() {
  const { data } = useFetch('/gallery/featured');
  const images = data || [];

  const placeholders = [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
    'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80',
    'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=600&q=80',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80',
  ];

  const displayImages = images.length > 0
    ? images.slice(0, 6).map((img) => ({ src: img.image, title: img.title }))
    : placeholders.map((src, i) => ({ src, title: `Gallery ${i + 1}` }));

  return (
    <section className="py-20 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-1">Photos & Videos</p>
            <h2 className="section-title">Club <span className="section-title-accent">Gallery</span></h2>
          </div>
          <Link to="/gallery" className="hidden sm:flex items-center gap-1.5 text-gold-500 font-semibold text-sm hover:gap-3 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {displayImages.map(({ src, title }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2 h-72 sm:h-auto' : 'h-36 sm:h-44'}`}
            >
              <img src={src} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/50 transition-colors flex items-center justify-center">
                <Image size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/gallery" className="btn-outline inline-flex items-center gap-2">
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
