import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OperatorDashboard from './pages/OperatorDashboard';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <PageWrapper key="login">
          <Login onLogin={handleLogin} />
        </PageWrapper>
      ) : (
        <PageWrapper key={user.role}>
          {user.role === 'admin' 
            ? <AdminDashboard user={user} onLogout={handleLogout} /> 
            : <OperatorDashboard user={user} onLogout={handleLogout} />
          }
        </PageWrapper>
      )}
    </AnimatePresence>
  );
}

export default App;
