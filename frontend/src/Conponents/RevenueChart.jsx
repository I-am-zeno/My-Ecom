import { useState, useEffect } from 'react'
import { api } from '../services/api'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const RevenueChart = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/dashboard/stats')
        setData(data.monthlyRevenue)
      } catch {
        setData(null)
      }
    }
    fetchStats()
  }, [])

  if (!data) {
    return (
      <div className="bg-surface rounded-xl border border-card-border shadow-[var(--card-shadow)] p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-text-main">Revenue Overview</h2>
            <p className="text-xs text-text-muted mt-0.5">Monthly revenue for the current year</p>
          </div>
        </div>
        <div className="h-40 sm:h-64 flex items-center justify-center">
          <span className="text-sm text-text-muted">No data yet</span>
        </div>
      </div>
    )
  }

  const maxVal = Math.max(...data, 1)
  const points = data.map((v, i) => `${i * 10 + 5},${64 - (v / maxVal) * 56}`).join(' ')

  return (
    <div className="bg-surface rounded-xl border border-card-border shadow-[var(--card-shadow)] p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-sm md:text-base font-semibold text-text-main">Revenue Overview</h2>
          <p className="text-xs text-text-muted mt-0.5">Monthly revenue for the current year</p>
        </div>
      </div>
      <div className="relative h-40 sm:h-64">
        <svg className="w-full h-full" viewBox="0 0 120 64" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          <polygon
            fill="url(#chartFill)"
            points={`0,64 ${points}, 115,64`}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[10px] text-text-muted">
          {months.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>
    </div>
  )
}

export default RevenueChart
