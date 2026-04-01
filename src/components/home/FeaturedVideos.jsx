import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, X } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { motion, AnimatePresence } from 'framer-motion';

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
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-white hover:text-gold-500 transition-colors"
            >
              <X size={28} />
            </button>

            <p className="text-white font-heading text-lg uppercase mb-3">{video.title}</p>

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

export default function FeaturedVideos() {
  const { data } = useFetch('/videos/featured');
  const videos = data || [];
  const [activeVideo, setActiveVideo] = useState(null);

  if (videos.length === 0) return null;

  return (
    <>
      <section className="py-20 bg-white dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-1">Watch Now</p>
              <h2 className="section-title">Featured <span className="section-title-accent">Videos</span></h2>
            </div>
            <Link to="/gallery" className="hidden sm:flex items-center gap-1.5 text-gold-500 font-semibold text-sm hover:gap-3 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video, i) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80';
                    }}
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

          <div className="mt-8 text-center sm:hidden">
            <Link to="/gallery" className="btn-outline inline-flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
