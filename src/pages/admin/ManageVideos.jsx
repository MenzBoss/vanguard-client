import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, X, Check, PlayCircle } from 'lucide-react';
import api from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';
import toast from 'react-hot-toast';

const CATEGORIES = ['Match Highlights', 'Training', 'Behind the Scenes', 'Interviews', 'Youth Academy'];
const EMPTY_FORM = {
  title: '',
  youtubeId: '',
  duration: '',
  category: 'Match Highlights',
  featured: false
};

export default function ManageVideos() {
  const { data } = useFetch('/videos');
  const [videos, setVideos] = useState([]);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setVideos(data);
  }, [data]);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentVideo(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEditModal = (video) => {
    setEditMode(true);
    setCurrentVideo(video);
    setForm({
      title: video.title,
      youtubeId: video.youtubeId,
      duration: video.duration,
      category: video.category,
      featured: video.featured
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editMode) {
        const { data: updated } = await api.put(`/videos/${currentVideo._id}`, form);
        setVideos((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
        toast.success('Video updated');
      } else {
        const { data: created } = await api.post('/videos', form);
        setVideos((prev) => [created, ...prev]);
        toast.success('Video added');
      }

      setModal(false);
      setForm(EMPTY_FORM);
      setCurrentVideo(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this video? This action cannot be undone.')) return;

    try {
      await api.delete(`/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      toast.success('Video deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const extractYouTubeId = (input) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    return input;
  };

  const handleYouTubeIdChange = (value) => {
    const extractedId = extractYouTubeId(value);
    setForm((f) => ({ ...f, youtubeId: extractedId }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-navy-900 dark:text-white uppercase">
            Manage Videos
          </h1>
          <p className="text-gray-400 text-sm">{videos.length} videos</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div
            key={video._id}
            className="group rounded-xl overflow-hidden shadow-md bg-navy-900 hover:shadow-xl transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEditModal(video)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  title="Edit video"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Delete video"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Duration badge */}
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
                {video.duration}
              </span>

              {/* Featured badge */}
              {video.featured && (
                <span className="absolute top-2 left-2 bg-gold-500 text-navy-900 text-xs px-2 py-0.5 rounded font-bold">
                  FEATURED
                </span>
              )}
            </div>

            {/* Video Info */}
            <div className="p-3">
              <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
                {video.title}
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gold-400">{video.category}</span>
                <span className="text-gray-400 flex items-center gap-1">
                  <PlayCircle size={11} /> {video.youtubeId}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {videos.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <PlayCircle size={48} className="mx-auto mb-3 opacity-30" />
          <p>No videos yet. Add your first video to get started.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-navy-700">
              <h2 className="font-heading text-xl text-navy-900 dark:text-white uppercase">
                {editMode ? 'Edit Video' : 'Add Video'}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Video Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="admin-input"
                  placeholder="e.g., Best Goals of the Season"
                />
              </div>

              {/* YouTube ID/URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  YouTube Video ID or URL *
                </label>
                <input
                  value={form.youtubeId}
                  onChange={(e) => handleYouTubeIdChange(e.target.value)}
                  required
                  pattern="[a-zA-Z0-9_-]{11}"
                  className="admin-input"
                  placeholder="dQw4w9WgXcQ or full YouTube URL"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Paste YouTube URL or 11-character video ID
                </p>
                {form.youtubeId.length === 11 && (
                  <div className="mt-2">
                    <img
                      src={`https://img.youtube.com/vi/${form.youtubeId}/maxresdefault.jpg`}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80';
                      }}
                    />
                    <p className="text-xs text-green-500 mt-1">✓ Thumbnail preview</p>
                  </div>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Duration
                </label>
                <input
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g., 5:23"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: MM:SS or H:MM:SS
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="admin-input"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Featured Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-gold-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Featured video (display on homepage)
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  {editMode ? 'Update' : 'Add'} Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
