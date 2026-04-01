import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';
import toast from 'react-hot-toast';

const EMPTY = { homeTeam: '', awayTeam: '', date: '', matchday: '', competition: 'League', venue: '', status: 'upcoming', homeScore: '', awayScore: '' };

export default function ManageMatches() {
  const { data } = useFetch('/matches');
  const [matches, setMatches] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setMatches(data.sort((a, b) => new Date(b.date) - new Date(a.date))); }, [data]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (m) => {
    setEditing(m._id);
    setForm({ homeTeam: m.homeTeam, awayTeam: m.awayTeam, date: new Date(m.date).toISOString().slice(0, 16), matchday: m.matchday, competition: m.competition, venue: m.venue || '', status: m.status, homeScore: m.homeScore ?? '', awayScore: m.awayScore ?? '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, homeScore: form.homeScore === '' ? null : Number(form.homeScore), awayScore: form.awayScore === '' ? null : Number(form.awayScore) };
      if (editing) {
        const { data: updated } = await api.put(`/matches/${editing}`, payload);
        setMatches((prev) => prev.map((m) => (m._id === editing ? updated : m)));
        toast.success('Match updated');
      } else {
        const { data: created } = await api.post('/matches', payload);
        setMatches((prev) => [created, ...prev]);
        toast.success('Match added');
      }
      setModal(false);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this match?')) return;
    try {
      await api.delete(`/matches/${id}`);
      setMatches((prev) => prev.filter((m) => m._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error(err.message); }
  };

  const statusColor = { upcoming: 'bg-blue-100 text-blue-700', live: 'bg-red-100 text-red-700', completed: 'bg-green-100 text-green-700' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-navy-900 dark:text-white uppercase">Manage Matches</h1>
          <p className="text-gray-400 text-sm">{matches.length} matches</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Match</button>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-xl shadow border border-gray-100 dark:border-navy-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-navy-800">
              <tr>{['MD', 'Home', 'Score', 'Away', 'Date', 'Competition', 'Status', ''].map((h) => <th key={h} className="py-3.5 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
              {matches.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-gold-500">{m.matchday}</td>
                  <td className="py-3 px-3 font-medium text-navy-900 dark:text-white">{m.homeTeam}</td>
                  <td className="py-3 px-3 text-center font-heading text-navy-900 dark:text-white">{m.status === 'completed' ? `${m.homeScore} – ${m.awayScore}` : '–'}</td>
                  <td className="py-3 px-3 font-medium text-navy-900 dark:text-white">{m.awayTeam}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs whitespace-nowrap">{new Date(m.date).toLocaleDateString('en-GB')}</td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{m.competition}</td>
                  <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${statusColor[m.status]}`}>{m.status}</span></td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(m)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(m._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {matches.length === 0 && <p className="text-center py-10 text-gray-400">No matches yet.</p>}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-8 pb-8 px-4 bg-black/70">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-navy-700">
              <h2 className="font-heading text-xl text-navy-900 dark:text-white uppercase">{editing ? 'Edit Match' : 'Add Match'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Home Team *</label>
                  <input value={form.homeTeam} onChange={(e) => setForm((f) => ({ ...f, homeTeam: e.target.value }))} required className="admin-input" placeholder="FC Vanguard" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Away Team *</label>
                  <input value={form.awayTeam} onChange={(e) => setForm((f) => ({ ...f, awayTeam: e.target.value }))} required className="admin-input" placeholder="Rival FC" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date & Time *</label>
                  <input type="datetime-local" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required className="admin-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Matchday *</label>
                  <input type="number" value={form.matchday} onChange={(e) => setForm((f) => ({ ...f, matchday: e.target.value }))} required className="admin-input" placeholder="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Competition</label>
                  <input value={form.competition} onChange={(e) => setForm((f) => ({ ...f, competition: e.target.value }))} className="admin-input" placeholder="League" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="admin-input">
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              {form.status === 'completed' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Home Score</label>
                    <input type="number" value={form.homeScore} onChange={(e) => setForm((f) => ({ ...f, homeScore: e.target.value }))} className="admin-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Away Score</label>
                    <input type="number" value={form.awayScore} onChange={(e) => setForm((f) => ({ ...f, awayScore: e.target.value }))} className="admin-input" />
                  </div>
                </div>
              )}
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
