import { Router } from 'express'
import { getCart, addToCart, updateCartItem, removeCartItem, checkout } from '../controllers/cartController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, getCart)
router.post('/add', protect, addToCart)
router.put('/item/:productId', protect, updateCartItem)
router.delete('/item/:productId', protect, removeCartItem)
router.post('/checkout', protect, checkout)

export default router
