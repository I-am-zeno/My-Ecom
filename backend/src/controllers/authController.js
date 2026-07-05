import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log(name,email,password)
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already in use' })

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    res.status(201).json({ user, token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user._id)
    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { role, status } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(role && { role }), ...(status && { status }) },
      { new: true, runValidators: true }
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
