import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Check, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../../utils/api';
import { useFetch } from '../../hooks/useFetch';
import toast from 'react-hot-toast';

const EMPTY = { playerName: '', type: 'IN', fromClub: '', toClub: '', fee: 'Undisclosed', position: '', nationality: '', date: '', season: '2024/25', photo: '' };

export default function ManageTransfers() {
  const { data } = useFetch('/transfers');
  const [transfers, setTransfers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setTransfers(data); }, [data]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: created } = await api.post('/transfers', form);
      setTransfers((prev) => [created, ...prev]);
      toast.success('Transfer added');
      setModal(false);
      setForm(EMPTY);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transfer?')) return;
    try {
      await api.delete(`/transfers/${id}`);
      setTransfers((prev) => prev.filter((t) => t._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error(err.message); }
  };

  const typeConfig = { IN: { color: 'bg-green-100 text-green-700', icon: TrendingUp }, OUT: { color: 'bg-red-100 text-red-700', icon: TrendingDown }, 'LOAN IN': { color: 'bg-blue-100 text-blue-700', icon: TrendingUp }, 'LOAN OUT': { color: 'bg-orange-100 text-orange-700', icon: TrendingDown } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl text-navy-900 dark:text-white uppercase">Manage Transfers</h1>
          <p className="text-gray-400 text-sm">{transfers.length} transfers</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Transfer</button>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-xl shadow border border-gray-100 dark:border-navy-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-navy-800">
              <tr>{['Photo', 'Player', 'Type', 'From', 'To', 'Fee', 'Date', ''].map((h) => <th key={h} className="py-3.5 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
              {transfers.map((t) => {
                const cfg = typeConfig[t.type] || typeConfig.IN;
                const Icon = cfg.icon;
                return (
                  <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-navy-800">
                        {t.photo ? (
                          <img src={t.photo} alt={t.playerName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No photo</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-navy-900 dark:text-white">{t.playerName}</td>
                    <td className="py-3 px-4"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${cfg.color}`}><Icon size={12} />{t.type}</span></td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{t.fromClub || '–'}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{t.toClub || '–'}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{t.fee}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(t._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transfers.length === 0 && <p className="text-center py-10 text-gray-400">No transfers yet.</p>}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-8 pb-8 px-4 bg-black/70">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-navy-700">
              <h2 className="font-heading text-xl text-navy-900 dark:text-white uppercase">Add Transfer</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Player Name *</label>
                  <input value={form.playerName} onChange={(e) => setForm((f) => ({ ...f, playerName: e.target.value }))} required className="admin-input" placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type *</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="admin-input">
                    <option>IN</option><option>OUT</option><option>LOAN IN</option><option>LOAN OUT</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">From Club</label>
                  <input value={form.fromClub} onChange={(e) => setForm((f) => ({ ...f, fromClub: e.target.value }))} className="admin-input" placeholder="Previous club" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">To Club</label>
                  <input value={form.toClub} onChange={(e) => setForm((f) => ({ ...f, toClub: e.target.value }))} className="admin-input" placeholder="Destination club" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fee</label>
                  <input value={form.fee} onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))} className="admin-input" placeholder="£5M / Free / Undisclosed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required className="admin-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Position</label>
                  <input value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className="admin-input" placeholder="Midfielder" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nationality</label>
                  <input value={form.nationality} onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))} className="admin-input" placeholder="English" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Player Photo URL</label>
                <input value={form.photo} onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))} className="admin-input" placeholder="https://..." />
                {form.photo && (
                  <div className="mt-2 rounded-lg overflow-hidden w-32 h-32 border-2 border-gray-200 dark:border-navy-700">
                    <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
