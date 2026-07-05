import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [itemCount, setItemCount] = useState(0)

  const refreshCart = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) { setItemCount(0); return }
      const { cart } = await api.get('/cart')
      setItemCount(cart.items.reduce((sum, i) => sum + i.quantity, 0))
    } catch {
      setItemCount(0)
    }
  }, [])

  useEffect(() => { refreshCart() }, [refreshCart])

  return (
    <CartContext.Provider value={{ itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
