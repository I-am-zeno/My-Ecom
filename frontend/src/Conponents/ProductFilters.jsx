import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, SlidersHorizontal, X, LogOut, RotateCcw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useCallback, useEffect } from 'react'

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports']
const MAX_PRICE = 500

const ProductFilters = ({ filters, onChange, onClose }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [dragging, setDragging] = useState(null)
  const trackRef = useRef(null)
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  const minVal = parseFloat(filters.minPrice) || 0
  const maxVal = parseFloat(filters.maxPrice) || MAX_PRICE

  const getValueFromPosition = useCallback(clientX => {
    if (!trackRef.current) return 0
    const rect = trackRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round((pct * MAX_PRICE) / 5) * 5
  }, [])

  const applyValue = useCallback((thumb, val) => {
    const f = filtersRef.current
    const min = thumb === 'min' ? (val === 0 ? '' : String(val)) : f.minPrice
    const max = thumb === 'max' ? (val === MAX_PRICE ? '' : String(val)) : f.maxPrice
    if (
      (thumb === 'min' && val <= (parseFloat(f.maxPrice) || MAX_PRICE)) ||
      (thumb === 'max' && val >= (parseFloat(f.minPrice) || 0))
    ) {
      onChange({ ...f, minPrice: min, maxPrice: max })
    }
  }, [onChange])

  const handlePointerDown = useCallback((thumb, clientX) => {
    setDragging(thumb)
    applyValue(thumb, getValueFromPosition(clientX))
  }, [applyValue, getValueFromPosition])

  const handlePointerMove = useCallback(e => {
    if (!dragging) return
    applyValue(dragging, getValueFromPosition(e.clientX))
  }, [dragging, applyValue, getValueFromPosition])

  const handlePointerUp = useCallback(() => {
    setDragging(null)
  }, [])

  useEffect(() => {
    if (!dragging) return
    const onMove = e => handlePointerMove(e)
    const onUp = () => handlePointerUp()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, handlePointerMove, handlePointerUp])

  const toggleCategory = cat => {
    const updated = filters.category.includes(cat)
      ? filters.category.filter(c => c !== cat)
      : [...filters.category, cat]
    onChange({ ...filters, category: updated })
  }

  const clearAll = () => {
    onChange({ search: '', category: [], minPrice: '', maxPrice: '', showOutOfStock: false })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const hasFilters = filters.search || filters.category.length || filters.minPrice || filters.maxPrice || filters.showOutOfStock
  const activeCount = [filters.search && 1, filters.category.length && filters.category.length, (filters.minPrice || filters.maxPrice) && 1, filters.showOutOfStock && 1].filter(Boolean).length

  const minLeft = `${(minVal / MAX_PRICE) * 100}%`
  const maxLeft = `${(maxVal / MAX_PRICE) * 100}%`
  const barWidth = `${((maxVal - minVal) / MAX_PRICE) * 100}%`

  return (
    <aside className="sticky top-0 left-0 flex flex-col h-screen w-72 bg-surface border-r border-card-border shrink-0">
      <div className="flex items-center justify-between px-5 py-6 border-b border-card-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-text-on-primary">
            <ShoppingCart size={18} />
          </div>
          <span className="text-lg font-bold text-text-main">My E-com</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-element transition-colors">
            <X size={18} className="text-text-muted" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <SlidersHorizontal size={14} className="text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-text-main">Filters</h2>
              {activeCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary text-text-on-primary text-[10px] font-bold leading-none">
                  {activeCount}
                </span>
              )}
            </div>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-[11px] text-primary hover:text-primary-hover font-medium transition-colors"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={e => onChange({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-element text-text-main text-sm placeholder:text-text-muted/60 border border-card-border outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            {filters.search && (
              <button
                onClick={() => onChange({ ...filters, search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Category</h3>
            <div className="space-y-1">
              {categories.map(cat => {
                const isChecked = filters.category.includes(cat)
                return (
                  <label
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all group ${
                      isChecked ? 'bg-primary/5' : 'hover:bg-element'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-primary border-primary'
                        : 'border-card-border group-hover:border-text-muted'
                    }`}>
                      {isChecked && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4.5 7.5L8 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${
                      isChecked ? 'text-primary font-medium' : 'text-text-main group-hover:text-text-main'
                    }`}>
                      {cat}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Out of Stock */}
          <div className="mb-6">
            <label
              onClick={() => onChange({ ...filters, showOutOfStock: !filters.showOutOfStock })}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all group ${
                filters.showOutOfStock ? 'bg-primary/5' : 'hover:bg-element'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                filters.showOutOfStock
                  ? 'bg-primary border-primary'
                  : 'border-card-border group-hover:border-text-muted'
              }`}>
                {filters.showOutOfStock && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4.5 7.5L8 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={`text-sm transition-colors ${
                filters.showOutOfStock ? 'text-primary font-medium' : 'text-text-main group-hover:text-text-main'
              }`}>
                Show Out of Stock
              </span>
            </label>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Price Range</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-text-muted">Min</span>
                <span className="text-sm font-bold text-text-main">${minVal}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-text-muted">Max</span>
                <span className="text-sm font-bold text-text-main">${maxVal === MAX_PRICE ? `${MAX_PRICE}+` : maxVal}</span>
              </div>
            </div>
            <div
              ref={trackRef}
              className="relative h-7 cursor-pointer select-none"
              onPointerDown={e => {
                const val = getValueFromPosition(e.clientX)
                const distToMin = Math.abs(val - minVal)
                const distToMax = Math.abs(val - maxVal)
                handlePointerDown(distToMin <= distToMax ? 'min' : 'max', e.clientX)
              }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 rounded-full bg-element pointer-events-none" />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-primary pointer-events-none transition-all duration-75"
                style={{ left: minLeft, width: barWidth }}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 -ml-2.5 rounded-full bg-white border-2 shadow cursor-grab active:cursor-grabbing pointer-events-none transition-shadow ${
                  dragging === 'min' ? 'border-primary shadow-md scale-110' : 'border-primary hover:shadow-md'
                }`}
                style={{ left: minLeft }}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 -ml-2.5 rounded-full bg-white border-2 shadow cursor-grab active:cursor-grabbing pointer-events-none transition-shadow ${
                  dragging === 'max' ? 'border-primary shadow-md scale-110' : 'border-primary hover:shadow-md'
                }`}
                style={{ left: maxLeft }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-6 pt-4 border-t border-card-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-text-muted hover:text-danger hover:bg-danger-bg transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default ProductFilters
