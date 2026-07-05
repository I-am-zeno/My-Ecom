import Order from '../models/Order.js'
import Product from '../models/Product.js'

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(20)
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id, hidden: { $ne: true } }).sort({ createdAt: -1 })
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (order.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' })
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stockCount: item.quantity } })
    }

    order.status = 'Cancelled'
    await order.save()

    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (order.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (order.status === 'Pending') {
      return res.status(400).json({ message: 'Cancel the order first before removing it' })
    }

    order.hidden = true
    await order.save()
    res.json({ message: 'Order removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const clearCompletedOrders = async (req, res) => {
  try {
    const result = await Order.updateMany(
      { user: req.user.id, status: { $in: ['Completed', 'Cancelled'] } },
      { hidden: true }
    )
    res.json({ message: `Cleared ${result.modifiedCount} orders` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
