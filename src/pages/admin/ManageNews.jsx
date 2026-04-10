import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/admin/ImageUpload';

const EMPTY = { title: '', excerpt: '', content: '', category: 'Club News', image: '', featured: false, published: true };
const CATEGORIES = ['Club News', 'Match Report', 'Transfer', 'Youth', 'Community'];

export default function ManageNews() {
  const { data, loading, error } = useFetch('/news/admin/all');
  const [articles, setArticles] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setArticles(data); }, [data]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (a) => { setEditing(a._id); setForm({ title: a.title, excerpt: a.excerpt || '', content: a.content, category: a.category, image: a.image || '', featured: a.featured, published: a.published }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { data: updated } = await api.put(`/news/${editing}`, form);
        setArticles((prev) => prev.map((a) => (a._id === editing ? updated : a)));
        toast.success('Article updated');
      } else {
        const { data: created } = await api.post('/news', form);
        setArticles((prev) => [created, ...prev]);
        toast.success('Article created');
      }
      setModal(false);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.delete(`/news/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-navy-900 dark:text-white uppercase">Manage News</h1>
          <p className="text-gray-400 text-sm">{articles.length} articles</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Article</button>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-xl shadow border border-gray-100 dark:border-navy-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-navy-800">
              <tr>
                {['Image', 'Title', 'Category', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-3 px-4"><div className="h-8 bg-gray-100 dark:bg-navy-700 rounded animate-pulse" /></td></tr>
                ))
              ) : articles.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                  <td className="py-3 px-4">
                    {a.image ? <img src={a.image} alt="" className="w-12 h-10 object-cover rounded" /> : <div className="w-12 h-10 bg-gray-100 dark:bg-navy-700 rounded" />}
                  </td>
                  <td className="py-3 px-4 font-medium text-navy-900 dark:text-white max-w-xs truncate">{a.title}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{a.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${a.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(a)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(a._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && articles.length === 0 && <p className="text-center py-10 text-gray-400">No articles yet.</p>}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-8 pb-8 px-4 bg-black/70">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-2xl relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-navy-700">
              <h2 className="font-heading text-xl text-navy-900 dark:text-white uppercase">{editing ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className="admin-input" placeholder="Article title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="admin-input">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                label="Article Image"
              />
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Excerpt</label>
                <input value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className="admin-input" placeholder="Short description..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Content *</label>
                <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} required rows={8} className="admin-input resize-none" placeholder="Full article content (HTML supported)..." />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-gold-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-gold-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Published</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
