import { useState, useEffect, useCallback } from 'react'
import { ShoppingCart, ShoppingBag, Package, SlidersHorizontal, X } from 'lucide-react'
import ProductFilters from '../Conponents/ProductFilters'
import ProductGrid from '../Conponents/ProductGrid'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'

const Shop = () => {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    search: '',
    category: [],
    minPrice: '',
    maxPrice: '',
    showOutOfStock: false,
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.category.length) params.set('category', filters.category.join(','))
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.showOutOfStock) params.set('showOutOfStock', 'true')

      const qs = params.toString()
      const { products } = await api.get(`/products${qs ? `?${qs}` : ''}`)
      setProducts(products)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  return (
    <div className="flex min-h-screen bg-main">
      {/* Mobile filter overlay */}
      {filtersOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setFiltersOpen(false)} />
      )}
      <div className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-300 md:sticky md:translate-x-0 ${
        filtersOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <ProductFilters filters={filters} onChange={setFilters} onClose={() => setFiltersOpen(false)} />
      </div>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-text-on-primary">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-main">Products</h1>
              <p className="text-xs text-text-muted mt-0.5">Browse our catalog</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFiltersOpen(true)} className="md:hidden p-2.5 rounded-lg bg-surface border border-card-border hover:bg-element transition-colors" title="Filters">
              <SlidersHorizontal size={20} className="text-text-main" />
            </button>
            <button onClick={() => navigate('/orders')} className="p-2.5 rounded-lg bg-surface border border-card-border hover:bg-element transition-colors" title="My Orders">
              <Package size={20} className="text-text-main" />
            </button>
            <button onClick={() => navigate('/cart')} className="relative p-2.5 rounded-lg bg-surface border border-card-border hover:bg-element transition-colors">
              <ShoppingBag size={20} className="text-text-main" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-text-on-primary text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  )
}

export default Shop
