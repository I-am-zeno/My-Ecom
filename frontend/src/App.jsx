import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppLayout from './Conponents/AppLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Products from './pages/Products'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'

const StaffRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'Admin' || user.role === 'Editor') return children
  return <Navigate to="/shop" replace />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user?.role === 'Admin') return <Navigate to="/" replace />
  if (user?.role === 'Editor') return <Navigate to="/products" replace />
  if (user) return <Navigate to="/shop" replace />
  return children
}

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route element={<StaffRoute><AppLayout /></StaffRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
