import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, X, Package, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { api } from '../services/api'

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports']

const ProductModal = ({ product, onClose, onSave }) => {
  const editing = Boolean(product)
  const [form, setForm] = useState({
    title: product?.title || '',
    price: product?.price ?? '',
    stockCount: product?.stockCount ?? '',
    category: product?.category || categories[0],
    image: product?.image || '',
    description: product?.description || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim() || !form.price || form.stockCount === '') return
    setSaving(true)
    await onSave({
      title: form.title.trim(),
      price: parseFloat(form.price),
      stockCount: parseInt(form.stockCount, 10),
      category: form.category,
      image: form.image.trim(),
      description: form.description.trim(),
    })
    setSaving(false)
  }

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface rounded-xl border border-card-border shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
            <h2 className="text-base font-semibold text-text-main">{editing ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:text-text-main hover:bg-element transition-colors">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Product Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Wireless Keyboard"
                className="w-full px-3 py-2.5 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Stock Count</label>
                <input
                  type="number"
                  min="0"
                  value={form.stockCount}
                  onChange={e => setForm({ ...form, stockCount: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2.5 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Image URL</label>
              <input
                type="url"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
                placeholder="https://picsum.photos/seed/.../400"
                className="w-full px-3 py-2.5 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Product description..."
                className="w-full resize-none px-3 py-2.5 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-element text-text-main text-sm border border-card-border outline-none focus:ring-2 focus:ring-primary/40"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-lg bg-primary text-text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

const ProductsTable = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const perPage = 8

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await api.get('/products')
      setProducts(data.products)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async data => {
    try {
      await api.post('/products', data)
      await fetchProducts()
      setModalOpen(false)
    } catch {
      // error handled by api helper
    }
  }

  const updateProduct = async data => {
    try {
      await api.put(`/products/${editingProduct._id}`, data)
      await fetchProducts()
      setModalOpen(false)
      setEditingProduct(null)
    } catch {
      // error handled by api helper
    }
  }

  const deleteProduct = async id => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
    } catch {
      // error handled by api helper
    }
  }

  const openEdit = product => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const filtered = useMemo(() => {
    let result = products
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q))
    }
    return result
  }, [products, activeCategory, search])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="bg-surface rounded-xl border border-card-border shadow-[var(--card-shadow)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 md:px-5 py-4 border-b border-card-border">
        <h1 className="text-base md:text-lg font-semibold text-text-main">Products</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 md:px-5 py-3 border-b border-card-border">
        <div className="flex flex-wrap gap-1.5">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1) }}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-text-on-primary border-primary'
                  : 'bg-element text-text-muted border-card-border hover:text-text-main hover:border-text-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-element text-text-main text-sm placeholder:text-text-muted border border-card-border outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border text-left text-xs font-medium text-text-muted uppercase tracking-wide">
              <th className="py-3.5 px-5">Product</th>
              <th className="py-3.5 px-5">Category</th>
              <th className="py-3.5 px-5">Price</th>
              <th className="py-3.5 px-5">Stock</th>
              <th className="py-3.5 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-text-muted">
                  Loading products...
                </td>
              </tr>
            ) : paginated.map(p => {
              const lowStock = p.stockCount < 5
              return (
                <tr
                  key={p._id}
                  className={`border-b border-card-border last:border-0 transition-colors ${
                    lowStock ? 'bg-danger-bg' : 'hover:bg-element/50'
                  }`}
                >
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Package size={16} />
                      </div>
                      <span className={`font-medium ${lowStock ? 'text-danger' : 'text-text-main'}`}>
                        {p.title}
                      </span>
                    </div>
                  </td>
                  <td className={`py-3 px-5 ${lowStock ? 'text-danger' : 'text-text-muted'}`}>{p.category}</td>
                  <td className={`py-3 px-5 font-medium ${lowStock ? 'text-danger' : 'text-text-main'}`}>
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      lowStock
                        ? 'bg-danger-bg text-danger'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${lowStock ? 'bg-danger' : 'bg-emerald-500'}`} />
                      {p.stockCount}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-md text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="p-1.5 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 md:px-5 py-3.5 border-t border-card-border">
        <span className="text-xs text-text-muted">
          Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-element transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-primary text-text-on-primary'
                  : 'text-text-muted hover:text-text-main hover:bg-element'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-md text-text-muted hover:text-text-main hover:bg-element transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setModalOpen(false); setEditingProduct(null) }}
          onSave={editingProduct ? updateProduct : addProduct}
        />
      )}
    </div>
  )
}

export default ProductsTable
