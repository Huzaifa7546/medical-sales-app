import React from 'react';
import { Package, PlusCircle, ShoppingCart, BarChart3, LogOut, Activity } from 'lucide-react';

export default function Sidebar({ role, onLogout, setActivePage, activePage }) {
  const menuItems = role === 'admin' 
    ? [
        { id: 'inventory', label: 'Medicine Directory', icon: <Package size={20} /> },
        { id: 'add', label: 'Add Medicine', icon: <PlusCircle size={20} /> }
      ]
    : [
        { id: 'sales', label: 'Direct Sale', icon: <ShoppingCart size={20} /> },
        { id: 'reports', label: 'Analytical Reports', icon: <BarChart3 size={20} /> }
      ];

  return (
    <div className="w-full md:w-72 bg-slate-900 text-white border-t md:border-r border-slate-800 p-3 md:p-8 flex flex-row md:flex-col justify-between md:justify-start fixed md:sticky bottom-0 md:top-0 z-50 md:min-h-screen">
      <div className="hidden md:flex mb-12 items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
          <Activity size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter">Huzz.Medflow</h1>
          <p className="text-[10px] text-blue-500 uppercase tracking-[0.2em] font-black">Enterprise OS</p>
        </div>
      </div>
      
      <div className="hidden md:block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6">Main Terminal</div>
      
      <nav className="flex-1 flex flex-row md:flex-col items-center justify-around md:justify-start gap-2 md:gap-0 md:space-y-1.5 w-full">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex-1 md:w-full group flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:p-3.5 rounded-xl transition-all duration-300 font-medium ${activePage === item.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 md:shadow-blue-500/25' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <span className={`${activePage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
              {item.icon}
            </span>
            <span className="text-[10px] md:text-base hidden sm:block md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden md:block mt-auto pt-8 border-t border-slate-800 w-full">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-300 font-medium"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      {/* Mobile Logout (Icon Only) */}
      <button 
        onClick={onLogout}
        className="md:hidden flex items-center justify-center p-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}
