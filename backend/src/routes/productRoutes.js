import { Router } from 'express'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'
import { allowRoles } from '../middleware/admin.js'

const router = Router()

router.get('/', getProducts)
router.post('/', protect, allowRoles('Admin', 'Editor'), createProduct)
router.put('/:id', protect, allowRoles('Admin', 'Editor'), updateProduct)
router.delete('/:id', protect, allowRoles('Admin', 'Editor'), deleteProduct)

export default router
