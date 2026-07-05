import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const protect = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' })
  }

  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('status role')
    if (!user) return res.status(401).json({ message: 'User not found' })
    if (user.status === 'Suspended') return res.status(401).json({ message: 'Account suspended' })
    req.user = { id: user._id, role: user.role }
    next()
  } catch {
    res.status(401).json({ message: 'Token invalid' })
  }
}
