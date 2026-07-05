import React from 'react'
import StatCards from './StatCards'
import RevenueChart from './RevenueChart'
import TransactionsTable from './TransactionsTable'
import UserModeration from './UserModeration'

const Main = () => {
  return (
    <div className="space-y-6">
      <StatCards />
      <RevenueChart />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TransactionsTable />
        <UserModeration />
      </div>
    </div>
  )
}

export default Main
