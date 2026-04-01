import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../hooks/useFetch';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ZoomIn, PlayCircle, X } from 'lucide-react';

const CATEGORIES = ['All', 'Match Day', 'Training', 'Events', 'Stadium', 'Community'];
const VIDEO_CATEGORIES = ['All', 'Match Highlights', 'Training', 'Behind the Scenes', 'Interviews', 'Youth Academy'];

const PLACEHOLDER_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', title: 'Match Day Action' },
  { src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', title: 'Stadium View' },
  { src: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80', title: 'Training Session' },
  { src: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=800&q=80', title: 'Goal Celebration' },
  { src: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80', title: 'Night Game' },
  { src: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', title: 'Trophy Lift' },
  { src: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80', title: 'Community Event' },
  { src: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80', title: 'Player Training' },
  { src: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80', title: 'Match Day' },
  { src: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80', title: 'Fans in Stadium' },
  { src: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&q=80', title: 'Club Event' },
  { src: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&q=80', title: 'Youth Academy' },
];

function VideoModal({ video, onClose }) {
  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-white hover:text-gold-500 transition-colors"
            >
              <X size={28} />
            </button>

            {/* Title */}
            <p className="text-white font-heading text-lg uppercase mb-3">{video.title}</p>

            {/* YouTube iframe */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&playsinline=1&modestbranding=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Gallery() {
  const [category, setCategory] = useState('');
  const [videoCategory, setVideoCategory] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [tab, setTab] = useState('photos');

  const { data } = useFetch(`/gallery${category ? `?category=${category}` : ''}`);
  const { data: videosData } = useFetch(`/videos${videoCategory ? `?category=${videoCategory}` : ''}`);

  const items = data && data.length > 0 ? data : PLACEHOLDER_IMAGES.map((p, i) => ({ _id: i, image: p.src, title: p.title }));
  const slides = items.map((item) => ({ src: item.image, title: item.title }));
  const videos = videosData || [];

  return (
    <>
      <div className="relative h-52 md:h-64 bg-navy-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=60')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative text-center">
          <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">FC Vanguard</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wide">Media Gallery</h1>
        </div>
      </div>

      <section className="py-12 bg-white dark:bg-navy-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Photos / Videos tab switcher */}
          <div className="flex gap-2 mb-8 justify-center">
            <button
              onClick={() => setTab('photos')}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${tab === 'photos' ? 'bg-gold-500 text-navy-900' : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gold-100'}`}
            >
              Photos
            </button>
            <button
              onClick={() => setTab('videos')}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${tab === 'videos' ? 'bg-gold-500 text-navy-900' : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gold-100'}`}
            >
              <PlayCircle size={15} /> Videos
            </button>
          </div>

          {tab === 'photos' ? (
            <>
              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat === 'All' ? '' : cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                      (cat === 'All' && !category) || category === cat
                        ? 'bg-gold-500 text-navy-900' : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gold-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Masonry grid */}
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {items.map((item, i) => (
                  <motion.div
                    key={item._id || i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.04, 0.4) }}
                    className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/60 transition-colors flex items-center justify-center">
                      <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Video Category filter */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {VIDEO_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setVideoCategory(cat === 'All' ? '' : cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                      (cat === 'All' && !videoCategory) || videoCategory === cat
                        ? 'bg-gold-500 text-navy-900'
                        : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-gold-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Videos grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, i) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-navy-900"
                    onClick={() => setActiveVideo(video)}
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80'; }}
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-gold-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-navy-900 ml-1">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {/* Duration badge */}
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
                          {video.duration}
                        </span>
                      )}
                      {/* Featured badge */}
                      {video.featured && (
                        <span className="absolute top-2 left-2 bg-gold-500 text-navy-900 text-xs px-2 py-0.5 rounded font-bold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    {/* Title */}
                    <div className="p-4">
                      <h3 className="font-heading text-white text-base line-clamp-2 group-hover:text-gold-400 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-gray-400 text-xs">{video.category}</p>
                        <p className="text-gray-400 text-xs flex items-center gap-1">
                          <PlayCircle size={12} /> Click to play
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty state */}
              {videos.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <PlayCircle size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No videos available in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Image lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />

      {/* Video modal */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}