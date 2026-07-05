import { Router } from 'express'
import { register, login, getMe, getUsers, updateUser, deleteUser } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.get('/users', protect, adminOnly, getUsers)
router.put('/users/:id', protect, adminOnly, updateUser)
router.delete('/users/:id', protect, adminOnly, deleteUser)

export default router
