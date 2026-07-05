import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import StatCards from '../Conponents/StatCards'
import RevenueChart from '../Conponents/RevenueChart'
import TransactionsTable from '../Conponents/TransactionsTable'
import UserModeration from '../Conponents/UserModeration'

const Dashboard = () => {
  const { user } = useAuth()
  if (user?.role !== 'Admin') return <Navigate to="/products" replace />
  return (
    <div className="space-y-4 md:space-y-6">
      <StatCards />
      <RevenueChart />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <TransactionsTable />
        <UserModeration />
      </div>
    </div>
  )
}

export default Dashboard
