import React, { useState } from 'react'

export default function Login({ onLogin, API_BASE }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok) {
        onLogin(data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Connection error')
    }
  }

  return (
    <div className="container flex" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <div className="glass-card animate-fade" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Medical Sales</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Sign in to your account</p>
        
        {error && <div className="badge-danger" style={{ padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="grid">
          <div className="grid" style={{ gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Username</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. admin or operator"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid" style={{ gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign In</button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tip: use <b>admin/admin</b> or <b>operator/operator</b>
        </div>
      </div>
    </div>
  )
}
