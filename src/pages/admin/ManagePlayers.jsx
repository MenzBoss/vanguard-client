import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Shield } from 'lucide-react';
import api from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';
import toast from 'react-hot-toast';

const EMPTY = { name: '', position: 'Midfielder', number: '', photo: '', nationality: '', age: '', bio: '', goals: 0, assists: 0, appearances: 0 };
const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

export default function ManagePlayers() {
  const { data } = useFetch('/players/admin/all');
  const [players, setPlayers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setPlayers(data); }, [data]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p) => { setEditing(p._id); setForm({ name: p.name, position: p.position, number: p.number, photo: p.photo || '', nationality: p.nationality || '', age: p.age || '', bio: p.bio || '', goals: p.goals, assists: p.assists, appearances: p.appearances }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { data: updated } = await api.put(`/players/${editing}`, form);
        setPlayers((prev) => prev.map((p) => (p._id === editing ? updated : p)));
        toast.success('Player updated');
      } else {
        const { data: created } = await api.post('/players', form);
        setPlayers((prev) => [...prev, created]);
        toast.success('Player added');
      }
      setModal(false);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this player?')) return;
    try {
      await api.delete(`/players/${id}`);
      setPlayers((prev) => prev.filter((p) => p._id !== id));
      toast.success('Player removed');
    } catch (err) { toast.error(err.message); }
  };

  const posColor = { Goalkeeper: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', Defender: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', Midfielder: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', Forward: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-navy-900 dark:text-white uppercase">Manage Players</h1>
          <p className="text-gray-400 text-sm">{players.length} players in squad</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Player</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {players.map((p) => (
          <div key={p._id} className="bg-white dark:bg-navy-900 rounded-xl shadow border border-gray-100 dark:border-navy-700 overflow-hidden group">
            <div className="relative h-40 bg-navy-800">
              {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Shield size={36} className="text-navy-700" /></div>}
              <div className="absolute top-2 right-2 w-7 h-7 bg-navy-900/80 rounded-full flex items-center justify-center">
                <span className="font-heading text-gold-400 text-xs font-bold">{p.number}</span>
              </div>
            </div>
            <div className="p-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${posColor[p.position] || ''}`}>{p.position}</span>
              <p className="font-heading text-navy-900 dark:text-white mt-1 text-sm truncate">{p.name}</p>
              <p className="text-gray-400 text-xs">{p.nationality}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(p)} className="flex-1 py-1 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded flex items-center justify-center gap-1"><Pencil size={12} /> Edit</button>
                <button onClick={() => handleDelete(p._id)} className="flex-1 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center justify-center gap-1"><Trash2 size={12} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {players.length === 0 && <div className="text-center py-20 text-gray-400">No players yet. Add your first player!</div>}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-8 pb-8 px-4 bg-black/70">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-navy-700">
              <h2 className="font-heading text-xl text-navy-900 dark:text-white uppercase">{editing ? 'Edit Player' : 'Add Player'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="admin-input" placeholder="Player name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Jersey #</label>
                  <input type="number" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} required className="admin-input" placeholder="10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Position *</label>
                  <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className="admin-input">
                    {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nationality</label>
                  <input value={form.nationality} onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))} className="admin-input" placeholder="e.g. English" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Photo URL</label>
                <input value={form.photo} onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))} className="admin-input" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['appearances', 'goals', 'assists'].map((stat) => (
                  <div key={stat}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{stat}</label>
                    <input type="number" value={form[stat]} onChange={(e) => setForm((f) => ({ ...f, [stat]: e.target.value }))} className="admin-input" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
