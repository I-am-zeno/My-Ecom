import { useState, useEffect } from 'react'
import { Package, XCircle, Clock, CheckCircle, ArrowLeft, Truck, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

const statusConfig = {
  Pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  Completed: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Completed' },
  Cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
}

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) { navigate('/login'); return }
      const { orders } = await api.get('/orders/my')
      setOrders(orders)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async id => {
    if (!confirm('Cancel this order?')) return
    try {
      await api.put(`/orders/${id}/cancel`)
      fetchOrders()
    } catch {
      // silently fail
    }
  }

  const removeOrder = async id => {
    if (!confirm('Remove this order from your history?')) return
    try {
      await api.delete(`/orders/${id}`)
      fetchOrders()
    } catch {
      // silently fail
    }
  }

  const clearAll = async () => {
    const done = orders.filter(o => o.status !== 'Pending')
    if (done.length === 0) return
    if (!confirm(`Remove all ${done.length} completed/cancelled orders?`)) return
    try {
      await api.delete('/orders/my/completed-cancelled')
      fetchOrders()
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-main">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/shop')} className="p-2 rounded-lg hover:bg-element transition-colors">
            <ArrowLeft size={20} className="text-text-main" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-text-on-primary">
            <Package size={18} />
          </div>
          <h1 className="text-lg font-semibold text-text-main">My Orders</h1>
          {orders.some(o => o.status !== 'Pending') && (
            <button
              onClick={clearAll}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface rounded-xl border border-card-border p-12 text-center">
            <Package size={48} className="mx-auto text-text-muted/30 mb-4" />
            <h2 className="text-base font-semibold text-text-main mb-1">No orders yet</h2>
            <p className="text-sm text-text-muted mb-6">You haven't placed any orders.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => {
              const cfg = statusConfig[o.status]
              const StatusIcon = cfg.icon
              return (
                  <div key={o._id} className="bg-surface rounded-xl border border-card-border p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-xs text-text-muted">Order #{o._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-text-muted mt-0.5">Placed {new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {o.deliveryDate && (
                          <div className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Truck size={14} />
                            <span>Del by {new Date(o.deliveryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color} ${cfg.bg} px-2.5 py-1 rounded-full`}>
                          <StatusIcon size={14} />
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-3">
                    {o.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-text-main">{item.title} <span className="text-text-muted">x{item.quantity}</span></span>
                        <span className="text-text-main font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-card-border">
                    <span className="text-sm font-bold text-text-main">Total: ${o.total.toFixed(2)}</span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {o.status === 'Pending' ? (
                        <button
                          onClick={() => cancelOrder(o._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => removeOrder(o._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders
