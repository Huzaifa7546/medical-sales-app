import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, User, Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm_password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (isRegister) {
      if (formData.password !== formData.confirm_password) {
        setError('Security breach: Passwords do not match the required sequence');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await authService.register(formData);
        setSuccess('Security credentials established for ' + formData.email + '. You may now authenticate.');
        setIsRegister(false);
      } else {
        const res = await authService.login({ 
          username: formData.username, 
          password: formData.password 
        });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data));
        onLogin(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication protocol failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-zinc-900/50 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden ring-1 ring-white/10"
      >
        {/* Left Side: Branding & Visuals */}
        <div className="hidden lg:flex flex-col p-12 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 text-white mb-auto relative z-10"
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Activity size={24} />
            </div>
            <span className="font-black tracking-tighter text-xl uppercase text-white/90">Huzz.Medflow</span>
          </motion.div>

          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-black text-white leading-tight mb-6"
            >
              Excellence in <br />
              <span className="text-blue-200">Pharmaceutical</span> <br />
              Management.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-blue-100/70 text-lg max-w-sm mb-12 font-medium"
            >
              Unified operating system for modern medical stores. Secure, fast, and intelligent.
            </motion.p>
            
            <div className="space-y-4">
              {[
                "End-to-end encryption",
                "Real-time inventory sync",
                "Automated lifecycle alerts"
              ].map((text, i) => (
                <motion.div 
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (i * 0.1) }}
                  className="flex items-center gap-3 text-blue-100/90 text-sm font-bold"
                >
                  <CheckCircle2 size={18} className="text-blue-300" /> {text}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-auto relative z-10 pt-12">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-400 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-900 flex items-center justify-center text-[10px] font-bold text-white">
                +12k
              </div>
            </div>
            <p className="text-blue-200/50 text-[10px] uppercase tracking-widest mt-4 font-bold">Trusted by leading healthcare facilities</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-white tracking-tighter">Medflow <span className="text-blue-300 font-light underline decoration-blue-500/50 underline-offset-8">PRO</span></h1>
              <p className="text-zinc-500 font-medium tracking-tight">
                {isRegister ? 'Register your enterprise node' : 'Enter your security keys to continue'}
              </p>
            </div>

            <AnimatePresence mode='wait'>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold"
                >
                  <AlertCircle size={18} /> {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold"
                >
                  <CheckCircle2 size={18} /> {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Identity UID</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    required
                    className="w-full bg-zinc-950/50 border-zinc-800 text-white rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none border font-bold placeholder:text-zinc-700"
                    placeholder="Username"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Official Gmail</label>
                  <div className="relative group">
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="email"
                      required
                      className="w-full bg-zinc-950/50 border-zinc-800 text-white rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none border font-bold placeholder:text-zinc-700"
                      placeholder="account@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">{isRegister ? 'Set Passcode' : 'Access Credential'}</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full bg-zinc-950/50 border-zinc-800 text-white rounded-2xl p-4 pl-12 pr-12 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none border font-bold placeholder:text-zinc-700"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Confirm Passcode</label>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full bg-zinc-950/50 border-zinc-800 text-white rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none border font-bold placeholder:text-zinc-700"
                      placeholder="••••••••"
                      value={formData.confirm_password}
                      onChange={e => setFormData({...formData, confirm_password: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {isRegister && (
                <div className="space-y-4 pt-4">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Permissions Override</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['admin', 'user'].map(role => (
                      <button 
                        key={role}
                        type="button"
                        onClick={() => setFormData({...formData, role})}
                        className={`py-4 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 ${formData.role === role ? 'bg-white border-white text-zinc-900 shadow-xl shadow-white/10' : 'bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                      >
                        {role === 'admin' ? <Shield size={14}/> : <User size={14}/>}
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 mt-8 flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isRegister ? 'Initialize Access' : 'Authenticate Session'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <button 
                onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
                className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                {isRegister ? 'Back to Secure Login' : 'Provision New Identity'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      <p className="fixed bottom-8 text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em] pointer-events-none">
        Automated by Huzz.Medflow Ledger v2.1
      </p>
    </div>
  );
}
