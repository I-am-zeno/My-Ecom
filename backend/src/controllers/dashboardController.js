import Order from '../models/Order.js'
import User from '../models/User.js'

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [
      totalRevenueResult,
      ordersCount,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      activeUsers,
      usersWithOrdersResult,
      totalUsers,
      monthlyRevenue
    ] = await Promise.all([
      Order.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Completed' }),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Cancelled' }),
      User.countDocuments({ status: 'Active' }),
      Order.distinct('user'),
      User.countDocuments(),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfYear }, status: { $ne: 'Cancelled' } } },
        { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$total' } } },
        { $sort: { _id: 1 } },
      ]),
    ])

    const totalRevenue = totalRevenueResult[0]?.total || 0
    const conversionRate = totalUsers > 0 ? ((usersWithOrdersResult.length / totalUsers) * 100).toFixed(1) : '0.0'
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlyRevenue.find(m => m._id === i + 1)
      return monthData ? monthData.revenue : 0
    })

    res.json({
      stats: {
        totalRevenue,
        activeUsers,
        totalOrders: ordersCount,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalUsers,
        conversionRate: parseFloat(conversionRate),
      },
      monthlyRevenue: months,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
