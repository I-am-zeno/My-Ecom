import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
    res.json({ cart: cart || { items: [] } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] })
    }

    const existing = cart.items.find(item => item.product.toString() === productId)
    const currentQty = existing ? existing.quantity : 0
    const newQty = currentQty + quantity

    if (newQty > product.stockCount) {
      return res.status(400).json({
        message: `Only ${product.stockCount} in stock${currentQty > 0 ? ` (${currentQty} already in cart)` : ''}`
      })
    }

    if (existing) {
      existing.quantity = newQty
    } else {
      cart.items.push({ product: productId, quantity })
    }

    await cart.save()
    await cart.populate('items.product')

    res.json({ cart })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    const product = await Product.findById(req.params.productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    if (quantity > product.stockCount) {
      return res.status(400).json({
        message: `Only ${product.stockCount} in stock`
      })
    }

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    const item = cart.items.find(item => item.product.toString() === req.params.productId)
    if (!item) return res.status(404).json({ message: 'Item not found in cart' })

    item.quantity = quantity
    await cart.save()
    await cart.populate('items.product')

    res.json({ cart })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: 'Cart not found' })

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId)
    await cart.save()

    res.json({ cart: cart || { items: [] } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const items = cart.items.map(item => ({
      product: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
    }))

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const days = 3 + Math.floor(Math.random() * 3)
    const deliveryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

    for (const cartItem of cart.items) {
      const product = cartItem.product
      if (product.stockCount < cartItem.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` })
      }
      await Product.findByIdAndUpdate(product._id, { $inc: { stockCount: -cartItem.quantity } })
    }

    await Order.create({ user: req.user.id, items, total, status: 'Pending', deliveryDate })

    cart.items = []
    await cart.save()

    res.json({ message: 'Checkout successful', total })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
