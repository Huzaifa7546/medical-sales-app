import React, { useState, useEffect } from 'react'

export default function OperatorDashboard({ user, onLogout, API_BASE }) {
  const [medicines, setMedicines] = useState([])
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    const res = await fetch(`${API_BASE}/medicines`)
    const data = await res.json()
    setMedicines(data)
  }

  const addToCart = (med) => {
    const existing = cart.find(item => item.id === med.id)
    if (existing) {
      if (existing.quantity >= med.stock) return alert('Out of stock!')
      setCart(cart.map(item => item.id === med.id ? { ...item, quantity: item.quantity + 1, net_amount: (item.quantity + 1) * item.net_price } : item))
    } else {
      setCart([...cart, { ...med, quantity: 1, net_amount: med.net_price }])
    }
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.net_amount, 0)
  const totalGst = cart.reduce((sum, item) => sum + (item.mrp * (item.gst_percent/100) * (1 - item.discount_percent/100) * item.quantity), 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return
    const res = await fetch(`${API_BASE}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: customerName || 'Walk-in',
        total_amount: totalAmount,
        total_gst: totalGst,
        items: cart,
        bill_date: new Date().toISOString().split('T')[0]
      })
    })
    if (res.ok) {
      alert('Sale recorded successfully!')
      setCart([])
      setCustomerName('')
      fetchMedicines()
    }
  }

  const filteredMedicines = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="container animate-fade">
      <header className="flex justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Operator Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>Logged in as: {user.username}</p>
        </div>
        <button className="btn btn-outline" onClick={onLogout}>Logout</button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <div className="glass-card">
          <div className="flex justify-between" style={{ marginBottom: '1.5rem' }}>
            <h3>Medicine Directory</h3>
            <input 
              className="input" 
              style={{ maxWidth: '300px' }} 
              placeholder="Search medicines..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map(med => (
                  <tr key={med.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{med.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{med.manufacturer}</div>
                    </td>
                    <td>{med.category}</td>
                    <td style={{ fontWeight: 600 }}>₹{med.net_price}</td>
                    <td><span className={`badge ${med.stock < 10 ? 'badge-danger' : 'badge-success'}`}>{med.stock}</span></td>
                    <td>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        onClick={() => addToCart(med)}
                        disabled={med.stock <= 0}
                      >Add</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid" style={{ alignContent: 'start' }}>
          <div className="glass-card">
            <h3>New Bill</h3>
            <div style={{ marginTop: '1rem' }} className="grid">
              <input 
                className="input" 
                placeholder="Customer Name" 
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
              
              <div className="table-container" style={{ border: 'none' }}>
                <table style={{ fontSize: '0.875rem' }}>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>{item.name} x {item.quantity}</td>
                        <td style={{ textAlign: 'right' }}>₹{item.net_amount.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', width: '40px' }}>
                          <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer' }}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {cart.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div className="flex justify-between" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span>Included GST:</span>
                    <span>₹{totalGst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--primary)' }}>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
                    onClick={handleCheckout}
                  >Complete Sale & Print Bill</button>
                </div>
              )}

              {cart.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Cart is empty
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
