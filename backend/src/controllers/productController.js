import Product from '../models/Product.js'

export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, showOutOfStock } = req.query
    const filter = {}

    if (search) {
      filter.title = { $regex: search, $options: 'i' }
    }
    if (category) {
      const categories = category.split(',')
      filter.category = { $in: categories }
    }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }
    if (showOutOfStock !== 'true') {
      filter.stockCount = { $gt: 0 }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json({ products })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { title, price, stockCount, category, image, description } = req.body
    const product = await Product.create({ title, price, stockCount, category, image, description })
    res.status(201).json({ product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { title, price, stockCount, category, image, description } = req.body
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { title, price, stockCount, category, image, description },
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
