import { useState, useEffect } from 'react'
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, Package, CreditCard, CheckCircle, Loader2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const { refreshCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) { navigate('/login'); return }
      const { cart } = await api.get('/cart')
      setCart(cart)
    } catch {
      setCart({ items: [] })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return
    try {
      const { cart } = await api.put(`/cart/item/${productId}`, { quantity: newQty })
      setCart(cart)
      refreshCart()
    } catch {
      // silently fail
    }
  }

  const removeItem = async productId => {
    try {
      const { cart } = await api.delete(`/cart/item/${productId}`)
      setCart(cart)
      refreshCart()
    } catch {
      // silently fail
    }
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    setError('')
    try {
      const res = await api.post('/cart/checkout')
      setDone(true)
      refreshCart()
      setCart({ items: [] })
      setCheckingOut(false)
    } catch (err) {
      setError(err.message)
      setCheckingOut(false)
    }
  }

  const items = cart?.items || []
  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading cart...</p>
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
            <ShoppingCart size={18} />
          </div>
          <h1 className="text-lg font-semibold text-text-main">Shopping Cart</h1>
          {items.length > 0 && (
            <span className="text-xs text-text-muted">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          )}
        </div>

        {items.length === 0 && !done ? (
          <div className="bg-surface rounded-xl border border-card-border p-12 text-center">
            <Package size={48} className="mx-auto text-text-muted/30 mb-4" />
            <h2 className="text-base font-semibold text-text-main mb-1">Your cart is empty</h2>
            <p className="text-sm text-text-muted mb-6">Looks like you haven't added anything yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : done ? null : (
          <>
            <div className="space-y-3">
              {items.map(item => {
                const p = item.product
                if (!p) return null
                return (
                  <div key={p._id} className="bg-surface rounded-xl border border-card-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-element flex items-center justify-center overflow-hidden shrink-0">
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={24} className="text-text-muted/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-text-main truncate">{p.title}</h3>
                        <p className="text-xs text-text-muted mt-0.5">${p.price.toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(p._id)}
                        className="p-2 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(p._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-md border border-card-border text-text-muted hover:text-text-main hover:bg-element transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-text-main">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(p._id, item.quantity + 1)}
                          disabled={item.quantity >= p.stockCount}
                          className="p-1 rounded-md border border-card-border text-text-muted hover:text-text-main hover:bg-element transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title={item.quantity >= p.stockCount ? 'Max stock reached' : ''}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-text-main">${(p.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 bg-surface rounded-xl border border-card-border p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-text-muted">Total</p>
                  <p className="text-xl font-bold text-text-main">${total.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    to="/shop"
                    className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-text-main transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 flex"
                  >
                    {checkingOut ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CreditCard size={16} />
                    )}
                    {checkingOut ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 bg-danger-bg border border-danger/20 rounded-xl p-4 flex items-center gap-3">
            <span className="text-sm text-danger font-medium">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-danger/60 hover:text-danger text-lg leading-none">&times;</button>
          </div>
        )}

        {/* Success overlay */}
        {done && (
          <div className="bg-surface rounded-xl border border-emerald-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-text-main mb-1">Order Placed Successfully!</h2>
            <p className="text-sm text-text-muted mb-6">Your order was placed successfully. Thank you for shopping!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
