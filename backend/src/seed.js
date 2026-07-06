import 'dotenv/config'
import { connectDB } from './config/db.js'
import User from './models/User.js'
import Product from './models/Product.js'

const seed = async () => {
  await connectDB()

  const existing = await User.findOne({ email: 'admin@example.com' })
  if (!existing) {
    const newAdmin = await User.create({
      name: 'admin100',
      email: 'admin100@example.com',
      password: 'pass123',
      role: 'Admin',
    })
    console.log(`Admin user created (${newAdmin.email} / ${newAdmin.password})`)
  } else {
    console.log(`Admin user already exists`)
  }

  const productCount = await Product.countDocuments()
  if (productCount === 0) {
    const products = []
    await Product.insertMany(products)
    console.log(`${products.length} products seeded`)
  } else {
    console.log(`${productCount} products already exist`)
  }

  process.exit(0)
}

seed()
