import { Search, Loader } from 'lucide-react'
import ProductCard from './ProductCard'

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={24} className="animate-spin text-text-muted" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <Search size={40} className="mb-3 opacity-40" />
        <p className="text-sm">No products match your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map(p => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}

export default ProductGrid
