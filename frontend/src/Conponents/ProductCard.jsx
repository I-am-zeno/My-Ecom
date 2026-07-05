import { useState } from 'react'
import { ShoppingCart, Check, Package } from 'lucide-react'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false)
  const { refreshCart } = useCart()

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', { productId: product._id })
      setAdded(true)
      refreshCart()
      setTimeout(() => setAdded(false), 2000)
    } catch {
      // silently fail
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-card-border overflow-hidden hover:shadow-sm transition-shadow flex flex-col">
      <div className="w-full h-44 bg-element flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <Package size={40} className="text-text-muted opacity-30" />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-text-main mb-1 line-clamp-2">{product.title}</h3>
        <p className="text-xs text-text-muted mb-1">{product.category}</p>
        {product.description && (
          <p className="text-xs text-text-muted/70 mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto mb-3">
          <span className="text-base font-bold text-text-main">${product.price.toFixed(2)}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            product.stockCount > 0
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-danger-bg text-danger'
          }`}>
            {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stockCount === 0}
          className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
            added
              ? 'bg-emerald-500 text-white'
              : 'bg-primary text-text-on-primary hover:bg-primary-hover disabled:opacity-40 disabled:pointer-events-none'
          }`}
        >
          {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          {added ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
