import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'

const router = Router()

router.get('/stats', protect, adminOnly, getDashboardStats)

export default router
