import React, { useState, useEffect } from 'react'

export default function AdminDashboard({ user, onLogout, API_BASE }) {
  const [medicines, setMedicines] = useState([])
  const [reports, setReports] = useState({ daily: null, monthly: null, top: [] })
  const [editingMed, setEditingMed] = useState(null)
  const [newMed, setNewMed] = useState({ name: '', manufacturer: '', category: '', mrp: '', gst_percent: '12', discount_percent: '0', stock: '100', expiry_date: '' })
  const [activeTab, setActiveTab] = useState('inventory')

  useEffect(() => {
    fetchMedicines()
    fetchReports()
  }, [])

  const fetchMedicines = async () => {
    const res = await fetch(`${API_BASE}/medicines`)
    const data = await res.json()
    setMedicines(data)
  }

  const fetchReports = async () => {
    const today = new Date().toISOString().split('T')[0]
    const curMonth = today.substring(0, 7)
    
    const [dailyRes, monthlyRes, topRes] = await Promise.all([
      fetch(`${API_BASE}/sales/daily?date=${today}`),
      fetch(`${API_BASE}/sales/monthly?month=${curMonth}`),
      fetch(`${API_BASE}/sales/top-medicines?month=${curMonth}`)
    ])
    
    setReports({
      daily: await dailyRes.json(),
      monthly: await monthlyRes.json(),
      top: await topRes.json()
    })
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMed)
    })
    if (res.ok) {
      fetchMedicines()
      setNewMed({ name: '', manufacturer: '', category: '', mrp: '', gst_percent: '12', discount_percent: '0', stock: '100', expiry_date: '' })
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this medicine?')) {
      await fetch(`${API_BASE}/medicines/${id}`, { method: 'DELETE' })
      fetchMedicines()
    }
  }

  return (
    <div className="container animate-fade">
      <header className="flex justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.username}</p>
        </div>
        <button className="btn btn-outline" onClick={onLogout}>Logout</button>
      </header>

      <div className="flex" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        <button 
          className="btn" 
          style={{ background: 'transparent', borderBottom: activeTab === 'inventory' ? '2px solid var(--primary)' : 'none', borderRadius: 0, color: activeTab === 'inventory' ? 'var(--primary)' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('inventory')}
        >Inventory</button>
        <button 
          className="btn" 
          style={{ background: 'transparent', borderBottom: activeTab === 'reports' ? '2px solid var(--primary)' : 'none', borderRadius: 0, color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('reports')}
        >Reports</button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="grid">
          <div className="glass-card">
            <h3>Add New Medicine</h3>
            <form onSubmit={handleAddMedicine} className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '1rem' }}>
              <input className="input" placeholder="Name" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} required />
              <input className="input" placeholder="Manufacturer" value={newMed.manufacturer} onChange={e => setNewMed({...newMed, manufacturer: e.target.value})} />
              <input className="input" placeholder="Category" value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} />
              <input className="input" type="number" step="0.01" placeholder="MRP" value={newMed.mrp} onChange={e => setNewMed({...newMed, mrp: e.target.value})} required />
              <input className="input" type="number" placeholder="GST %" value={newMed.gst_percent} onChange={e => setNewMed({...newMed, gst_percent: e.target.value})} />
              <input className="input" type="number" placeholder="Discount %" value={newMed.discount_percent} onChange={e => setNewMed({...newMed, discount_percent: e.target.value})} />
              <input className="input" type="number" placeholder="Stock" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: e.target.value})} />
              <input className="input" type="date" value={newMed.expiry_date} onChange={e => setNewMed({...newMed, expiry_date: e.target.value})} required />
              <button type="submit" className="btn btn-primary">Add Medicine</button>
            </form>
          </div>

          <div className="glass-card">
            <h3>Active Directory</h3>
            <div className="table-container" style={{ marginTop: '1rem' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>MRP</th>
                    <th>GST %</th>
                    <th>Disc %</th>
                    <th>Net Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(med => (
                    <tr key={med.id}>
                      <td style={{ fontWeight: 600 }}>{med.name}</td>
                      <td>{med.category}</td>
                      <td>₹{med.mrp}</td>
                      <td>{med.gst_percent}%</td>
                      <td>{med.discount_percent}%</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{med.net_price}</td>
                      <td>
                        <span className={`badge ${med.stock < 10 ? 'badge-danger' : 'badge-success'}`}>
                          {med.stock} units
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger)' }} onClick={() => handleDelete(med.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="glass-card">
              <h4>Today's Sales</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>₹{reports.daily?.daily_revenue || 0}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{reports.daily?.total_bills || 0} bills generated</p>
            </div>
            <div className="glass-card">
              <h4>Monthly Revenue</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>₹{reports.monthly?.monthly_revenue || 0}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Avg. Bill: ₹{Math.round(reports.monthly?.avg_bill_value || 0)}</p>
            </div>
          </div>

          <div className="glass-card">
            <h3>Top Selling Medicines</h3>
            <div className="table-container" style={{ marginTop: '1rem' }}>
              <table>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Units Sold</th>
                    <th>Revenue Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.top.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.medicine_name}</td>
                      <td>{item.units_sold}</td>
                      <td style={{ fontWeight: 600 }}>₹{item.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
