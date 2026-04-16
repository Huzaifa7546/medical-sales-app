import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { medicineService, salesService } from '../services/api';
import Sidebar from '../components/Sidebar';
import { TrendingUp, ShoppingBag, Calendar, User, ChevronRight, Zap } from 'lucide-react';

export default function OperatorDashboard({ user, onLogout }) {
  const [medicines, setMedicines] = useState([]);
  const [activePage, setActivePage] = useState('sales');
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMedicines();
    fetchReports();
  }, [activePage, saleDate]);

  const fetchMedicines = async () => {
    const res = await medicineService.getAll();
    setMedicines(res.data);
  };

  const fetchReports = async () => {
    if (activePage === 'reports') {
      const dailyRes = await salesService.getDaily(saleDate);
      setDailySales(dailyRes.data);
      const monthlyRes = await salesService.getMonthly();
      setMonthlySales(monthlyRes.data);
    }
  };

  const submitSale = async (e) => {
    e.preventDefault();
    try {
      await salesService.add({
        medicine_id: parseInt(selectedMedId),
        quantity: parseInt(quantity),
        sale_date: saleDate
      });
      setMessage('Transaction processed successfully');
      setTimeout(() => setMessage(''), 3000);
      setSelectedMedId('');
      setQuantity(1);
    } catch (err) {
      alert(err.response?.data?.detail || 'Transaction failed');
    }
  };

  // Professional Chart Data Preparation
  const chartData = monthlySales.map(s => ({
    name: s.month,
    sales: s.total_sales
  })).reverse();

  return (
    <div className="flex flex-col md:flex-row bg-[#fcfdfe] min-h-screen pb-20 md:pb-0">
      <Sidebar role="user" activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
      
      <main className="flex-1 p-4 md:p-10 overflow-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Point of Sale</h2>
            <p className="text-slate-400 font-medium text-sm md:text-base">System Terminal • ID: {user.username.toUpperCase()}</p>
          </motion.div>
          
          <div className="flex w-full md:w-auto justify-between md:justify-end items-center gap-6">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Session Authority</span>
              <span className="text-sm font-bold text-slate-800">{user.username}</span>
            </div>
            <div className="h-12 w-12 shrink-0 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <User size={20} />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activePage === 'sales' ? (
            <motion.div 
              key="sales"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-12 gap-10"
            >
              <div className="col-span-12 lg:col-span-7">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                     <Zap className="text-yellow-400/20" size={120} />
                  </div>
                  
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <span className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30"><ShoppingBag size={20}/></span>
                    New Transaction
                  </h3>

                  {message && (
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-emerald-500/10 text-emerald-600 p-4 rounded-2xl border border-emerald-500/20 mb-8 font-bold text-sm">
                      ✓ {message}
                    </motion.div>
                  )}
                  
                  <form onSubmit={submitSale} className="space-y-8 flex-1">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Nomenclature</label>
                      <select 
                        required 
                        className="w-full bg-slate-50 border-transparent rounded-2xl p-5 border outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 font-bold appearance-none transition-all cursor-pointer"
                        value={selectedMedId}
                        onChange={e => setSelectedMedId(e.target.value)}
                      >
                        <option value="">-- Select from Database --</option>
                        {medicines.map(m => (
                          <option key={m.id} value={m.id}>{m.name} • INR {m.price}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Volume/Quantity</label>
                        <input 
                          type="number" 
                          min="1" 
                          required 
                          className="w-full bg-slate-50 border-transparent rounded-2xl p-5 border outline-none focus:bg-white focus:border-blue-500 transition-all font-bold"
                          value={quantity}
                          onChange={e => setQuantity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timestamp</label>
                        <input 
                          type="date" 
                          required 
                          className="w-full bg-slate-50 border-transparent rounded-2xl p-5 border outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-600"
                          value={saleDate}
                          onChange={e => setSaleDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-auto pt-8">
                      <div className="bg-slate-900 p-6 rounded-[2rem] flex justify-between items-center text-white mb-6 shadow-xl shadow-slate-900/30">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aggregate Total</span>
                          <span className="text-3xl font-black">₹{(medicines.find(m => m.id == selectedMedId)?.price || 0) * (quantity || 0)}</span>
                        </div>
                        <ChevronRight className="text-slate-700" size={32} />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] py-6 rounded-[2rem] transition-all active:scale-[0.98] shadow-2xl shadow-blue-500/40">
                        Finalize & Commit
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Inventory Ledger</h3>
                   <div className="space-y-4 max-h-[500px] overflow-auto pr-2 custom-scrollbar">
                     {medicines.map(m => (
                       <button 
                         key={m.id} 
                         onClick={() => { setSelectedMedId(m.id); setQuantity(1); }}
                         className={`w-full flex justify-between items-center p-5 rounded-2xl border transition-all text-left group ${selectedMedId == m.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-50 hover:border-slate-200'}`}
                       >
                         <div>
                           <div className="font-bold text-slate-800">{m.name}</div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase">Exp: {m.expiry_date}</div>
                         </div>
                         <div className="text-right">
                           <div className="font-black text-slate-700">₹{m.price}</div>
                           <div className={`text-[10px] font-black uppercase ${selectedMedId == m.id ? 'text-blue-600' : 'text-slate-300'}`}>Select</div>
                         </div>
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
                <div className="h-20 w-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner">
                  <TrendingUp size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Performance Analytics</h3>
                  <p className="text-slate-400 font-medium italic">Monthly distribution of revenue and transaction volume</p>
                </div>
                <div className="h-32 w-full md:w-96 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 pb-4 flex justify-between items-center">
                    <h3 className="font-black text-lg flex items-center gap-2"><Calendar className="text-blue-600" size={18}/> Daily Ledger</h3>
                    <input type="date" className="bg-slate-50 border-transparent rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={saleDate} onChange={e => setSaleDate(e.target.value)} />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {dailySales.map((s, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-6 font-bold text-slate-700">{s.medicine_name}</td>
                            <td className="p-6 text-center font-black">{s.quantity}</td>
                            <td className="p-6 text-right font-black text-slate-900">₹{s.total_amount.toFixed(2)}</td>
                          </tr>
                        ))}
                        {dailySales.length === 0 && <tr><td colSpan="3" className="p-12 text-center text-slate-300 font-bold italic underline decoration-slate-100">Zero entries found for this timestamp</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 pb-4">
                    <h3 className="font-black text-lg flex items-center gap-2"><TrendingUp className="text-indigo-600" size={18}/> Historical Aggregates</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch Size</th>
                          <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {monthlySales.map((s, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-6 font-black text-slate-700 uppercase tracking-tighter">{s.month}</td>
                            <td className="p-6 text-center font-bold text-slate-400">{s.total_quantity}</td>
                            <td className="p-6 text-right font-black text-blue-600">₹{s.total_sales.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
