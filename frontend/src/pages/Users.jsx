import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UsersTable from '../Conponents/UsersTable'

const Users = () => {
  const { user } = useAuth()
  if (user?.role !== 'Admin') return <Navigate to="/products" replace />
  return <UsersTable />
}

export default Users
