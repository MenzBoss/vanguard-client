import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Check, ZoomIn, Edit } from 'lucide-react';
import api from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';
import toast from 'react-hot-toast';

const CATEGORIES = ['Match Day', 'Training', 'Events', 'Stadium', 'Community'];
const EMPTY = { title: '', image: '', category: 'Match Day', featured: false };

export default function ManageGallery() {
  const { data } = useFetch('/gallery');
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setItems(data); }, [data]);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentItem(null);
    setForm(EMPTY);
    setModal(true);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setCurrentItem(item);
    setForm({
      title: item.title,
      image: item.image,
      category: item.category,
      featured: item.featured
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMode) {
        const { data: updated } = await api.put(`/gallery/${currentItem._id}`, form);
        setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
        toast.success('Image updated');
      } else {
        const { data: created } = await api.post('/gallery', form);
        setItems((prev) => [created, ...prev]);
        toast.success('Image added');
      }
      setModal(false);
      setForm(EMPTY);
      setCurrentItem(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-navy-900 dark:text-white uppercase">Manage Gallery</h1>
          <p className="text-gray-400 text-sm">{items.length} images</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Image</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.map((item) => (
          <div key={item._id} className="relative group rounded-xl overflow-hidden shadow bg-navy-800 aspect-square">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/70 transition-all flex flex-col items-center justify-center gap-2">
              <p className="text-white text-xs font-medium px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(item)} className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600" title="Edit image">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600" title="Delete image">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="absolute top-2 left-2 text-xs bg-navy-900/80 text-gold-400 px-2 py-0.5 rounded font-bold">{item.category}</div>
            {item.featured && (
              <div className="absolute top-2 right-2 text-xs bg-gold-500 text-navy-900 px-2 py-0.5 rounded font-bold">FEATURED</div>
            )}
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-20 text-gray-400">No images yet.</div>}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-navy-700">
              <h2 className="font-heading text-xl text-navy-900 dark:text-white uppercase">
                {editMode ? 'Edit Image' : 'Add Image'}
              </h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="admin-input" placeholder="Image title" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Image URL *</label>
                <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} required className="admin-input" placeholder="https://..." />
                {form.image && (
                  <div className="mt-2">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80';
                      }}
                    />
                    <p className="text-xs text-green-500 mt-1">✓ Image preview</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="admin-input">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-gold-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Featured on homepage</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                  {editMode ? 'Update' : 'Add'} Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
