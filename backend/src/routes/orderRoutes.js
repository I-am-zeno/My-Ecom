import { Router } from 'express'
import { getOrders, getMyOrders, cancelOrder, deleteOrder, clearCompletedOrders } from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'

const router = Router()

router.get('/', protect, adminOnly, getOrders)
router.get('/my', protect, getMyOrders)
router.put('/:id/cancel', protect, cancelOrder)
router.delete('/:id', protect, deleteOrder)
router.delete('/my/completed-cancelled', protect, clearCompletedOrders)

export default router
