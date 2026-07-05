import User from '../models/User.js'

export const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    next()
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

export const allowRoles = (...roles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: `Access restricted to: ${roles.join(', ')}` })
    }
    next()
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}
