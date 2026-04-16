import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineService } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Trash2, Edit3, Filter, MoreHorizontal, Database, AlertTriangle } from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  const [medicines, setMedicines] = useState([]);
  const [activePage, setActivePage] = useState('inventory');
  const [formData, setFormData] = useState({ name: '', price: '', gst_percent: '12', discount_percent: '0', expiry_date: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await medicineService.getAll();
      setMedicines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await medicineService.update(editingId, formData);
        setMessage({ text: 'Record synchronized successfully', type: 'success' });
      } else {
        await medicineService.add(formData);
        setMessage({ text: 'New medicine integrated into inventory', type: 'success' });
      }
      setFormData({ name: '', price: '', gst_percent: '12', discount_percent: '0', expiry_date: '' });
      setEditingId(null);
      fetchMedicines();
      setActivePage('inventory');
    } catch (err) {
      setMessage({ text: err.response?.data?.detail || 'Operation failed', type: 'error' });
    }
  };

  const deleteMed = async (id) => {
    if (window.confirm('Confirm permanent deletion of this record?')) {
      await medicineService.delete(id);
      fetchMedicines();
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row bg-[#f8fafc] min-h-screen font-sans pb-20 md:pb-0">
      <Sidebar role="admin" activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
      
      <main className="flex-1 p-4 md:p-10 overflow-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Huzz.Medflow</h1>
            <p className="text-slate-500 mt-1 font-medium italic text-sm md:text-base">Master Data Management Console</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
            <div className="flex flex-col items-start md:items-end mr-0 md:mr-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Active Database</span>
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                <Database size={14} className="text-blue-500" /> med_store.db
              </span>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-3 md:gap-4">
              <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Plus size={20} />
              </div>
              <div>
                <span className="text-[10px] md:text-xs text-slate-400 block font-bold uppercase tracking-tighter">Total SKU</span>
                <span className="text-lg md:text-xl font-black text-slate-800">{medicines.length}</span>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`p-4 rounded-2xl mb-8 flex justify-between items-center overflow-hidden ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}
            >
              <div className="flex items-center gap-3 text-sm font-bold">
                {message.type === 'success' ? '✓' : <AlertTriangle size={18}/>}
                {message.text}
              </div>
              <button onClick={() => setMessage({ text: '', type: '' })} className="hover:rotate-90 transition-transform">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {activePage === 'inventory' ? (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Query medicine name..."
                  className="w-full bg-white border-slate-200/60 rounded-2xl p-4 pl-12 border shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-white border-slate-200/60 p-4 rounded-2xl border shadow-sm hover:bg-slate-50 transition-colors">
                <Filter size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap min-w-[800px]">
                  <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="p-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                    <th className="p-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Taxation</th>
                    <th className="p-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Market Disc.</th>
                    <th className="p-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Expiration</th>
                    <th className="p-6 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMedicines.map(med => (
                    <tr key={med.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="p-6">
                        <div className="font-bold text-slate-800">{med.name}</div>
                        <div className="text-[10px] text-blue-500 font-bold uppercase">SKU-{med.id.toString().padStart(5, '0')}</div>
                      </td>
                      <td className="p-6 font-mono font-bold text-slate-600">₹{med.price.toFixed(2)}</td>
                      <td className="p-6"><span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black">{med.gst_percent}% GST</span></td>
                      <td className="p-6 font-bold text-emerald-600">-{med.discount_percent}%</td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${new Date(med.expiry_date) < new Date() ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                          {med.expiry_date}
                        </span>
                      </td>
                      <td className="p-6 flex justify-center gap-2">
                        <button onClick={() => { setFormData({...med}); setEditingId(med.id); setActivePage('add'); }} className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"><Edit3 size={16}/></button>
                        <button onClick={() => deleteMed(med.id)} className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <header className="mb-10">
              <h3 className="text-2xl font-black text-slate-900">{editingId ? 'Modify Resource' : 'Provision New Resource'}</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Data will be encrypted and synchronized across network nodes.</p>
            </header>

            <form onSubmit={handleAction} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-10">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Medicine Nomenclature</label>
                <input required className="w-full bg-slate-50 border-transparent rounded-2xl p-4 border focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Paracetamol Enterprise Edition" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Market Price (INR)</label>
                <input type="number" step="0.01" required className="w-full bg-slate-50 border-transparent rounded-2xl p-4 border focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Lifecycle Expiration</label>
                <input type="date" required className="w-full bg-slate-50 border-transparent rounded-2xl p-4 border focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-600" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Constitutional Tax (%)</label>
                <input type="number" required className="w-full bg-slate-50 border-transparent rounded-2xl p-4 border focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" value={formData.gst_percent} onChange={e => setFormData({...formData, gst_percent: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Client Discount (%)</label>
                <input type="number" required className="w-full bg-slate-50 border-transparent rounded-2xl p-4 border focus:bg-white focus:border-blue-500 outline-none transition-all font-bold" value={formData.discount_percent} onChange={e => setFormData({...formData, discount_percent: e.target.value})} />
              </div>
              <div className="col-span-2 pt-6 flex gap-4">
                <button type="submit" className="flex-1 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98]">
                  {editingId ? 'Update Mainframe' : 'Deploy Record'}
                </button>
                <button type="button" onClick={() => { setActivePage('inventory'); setEditingId(null); }} className="px-10 border-2 border-slate-100 hover:bg-slate-50 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400">Abort</button>
              </div>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
}
