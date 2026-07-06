import 'dotenv/config'
import { connectDB } from './config/db.js'
import User from './models/User.js'
import Product from './models/Product.js'

const seed = async () => {
  await connectDB()

  const existing = await User.findOne({ email: 'admin@example.com' })
  if (!existing) {
    await User.create({
      name: 'admin100',
      email: 'admin100@example.com',
      password: 'pass123',
      role: 'Admin',
    })
    console.log('Admin user created (admin@example.com / admin123)')
  } else {
    console.log('Admin user already exists')
  }

  const productCount = await Product.countDocuments()
  if (productCount === 0) {
    const products = [
      { title: 'Wireless Headphones', price: 79.99, stockCount: 34, category: 'Electronics', image: 'https://picsum.photos/seed/headphones/400/300', description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.' },
      { title: 'Cotton T-Shirt', price: 24.99, stockCount: 120, category: 'Clothing', image: 'https://picsum.photos/seed/tshirt/400/300', description: 'Soft 100% organic cotton t-shirt available in multiple colors.' },
      { title: 'Desk Lamp', price: 45.00, stockCount: 18, category: 'Home & Garden', image: 'https://picsum.photos/seed/desklamp/400/300', description: 'Adjustable LED desk lamp with five brightness levels and USB charging port.' },
      { title: 'Running Shoes', price: 129.99, stockCount: 42, category: 'Clothing', image: 'https://picsum.photos/seed/runshoes/400/300', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.' },
      { title: 'Garden Shears', price: 32.50, stockCount: 7, category: 'Home & Garden', image: 'https://picsum.photos/seed/shears/400/300', description: 'Sharp stainless steel garden shears with ergonomic non-slip handles.' },
      { title: 'USB-C Hub', price: 39.99, stockCount: 55, category: 'Electronics', image: 'https://picsum.photos/seed/usbhub/400/300', description: '7-in-1 USB-C hub with HDMI, SD card reader, and 100W power delivery.' },
      { title: 'Denim Jacket', price: 89.99, stockCount: 23, category: 'Clothing', image: 'https://picsum.photos/seed/denim/400/300', description: 'Classic denim jacket with a modern slim fit and comfortable stretch denim.' },
      { title: 'Throw Pillow Set', price: 34.99, stockCount: 0, category: 'Home & Garden', image: 'https://picsum.photos/seed/pillows/400/300', description: 'Set of two decorative throw pillows with removable machine-washable covers.' },
      { title: 'Yoga Mat', price: 28.00, stockCount: 61, category: 'Sports', image: 'https://picsum.photos/seed/yogamat/400/300', description: 'Non-slip exercise yoga mat with extra thickness for joint protection.' },
      { title: 'Espresso Machine', price: 199.99, stockCount: 11, category: 'Home & Garden', image: 'https://picsum.photos/seed/espresso/400/300', description: 'Semi-automatic espresso machine with built-in grinder and steam wand.' },
      { title: 'Bluetooth Speaker', price: 59.99, stockCount: 44, category: 'Electronics', image: 'https://picsum.photos/seed/speaker/400/300', description: 'Portable waterproof Bluetooth speaker with 360-degree sound and 12-hour playtime.' },
      { title: 'Wool Scarf', price: 19.99, stockCount: 88, category: 'Clothing', image: 'https://picsum.photos/seed/scarf/400/300', description: 'Soft merino wool scarf perfect for keeping warm during cold months.' },
      { title: 'Indoor Plant Pot', price: 27.00, stockCount: 36, category: 'Home & Garden', image: 'https://picsum.photos/seed/plantpot/400/300', description: 'Modern ceramic plant pot with drainage hole and matching saucer.' },
      { title: 'Resistance Bands', price: 14.99, stockCount: 93, category: 'Sports', image: 'https://picsum.photos/seed/bands/400/300', description: 'Set of five resistance bands with different tension levels for home workouts.' },
      { title: 'Notebook Set', price: 12.99, stockCount: 150, category: 'Books', image: 'https://picsum.photos/seed/notebook/400/300', description: 'Pack of three A5 lined notebooks with durable covers and 200 pages each.' },
      { title: 'Mechanical Keyboard', price: 149.99, stockCount: 29, category: 'Electronics', image: 'https://picsum.photos/seed/keyboard/400/300', description: 'Hot-swappable mechanical keyboard with RGB backlighting and aluminum frame.' },
      { title: 'Leather Belt', price: 42.00, stockCount: 54, category: 'Clothing', image: 'https://picsum.photos/seed/belt/400/300', description: 'Genuine leather belt with a classic brass buckle available in brown and black.' },
      { title: 'Scented Candle', price: 18.00, stockCount: 72, category: 'Home & Garden', image: 'https://picsum.photos/seed/candle/400/300', description: 'Hand-poured soy wax candle with lavender and vanilla fragrance.' },
      { title: 'Water Bottle', price: 22.99, stockCount: 105, category: 'Sports', image: 'https://picsum.photos/seed/bottle/400/300', description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.' },
      { title: 'Air Fryer', price: 89.99, stockCount: 0, category: 'Home & Garden', image: 'https://picsum.photos/seed/airfryer/400/300', description: 'Digital air fryer with 5.8-quart capacity and 8 preset cooking programs.' },
      { title: 'Smartwatch Band', price: 15.99, stockCount: 66, category: 'Electronics', image: 'https://picsum.photos/seed/watchband/400/300', description: 'Silicone sports band compatible with most smartwatches, available in various colors.' },
      { title: 'Canvas Backpack', price: 54.99, stockCount: 31, category: 'Clothing', image: 'https://picsum.photos/seed/backpack/400/300', description: 'Durable canvas backpack with padded laptop compartment and multiple pockets.' },
      { title: 'Wall Clock', price: 29.99, stockCount: 19, category: 'Home & Garden', image: 'https://picsum.photos/seed/clock/400/300', description: 'Minimalist wall clock with silent quartz movement and large easy-to-read numbers.' },
      { title: 'Dumbbell Set', price: 74.99, stockCount: 15, category: 'Sports', image: 'https://picsum.photos/seed/dumbbell/400/300', description: 'Adjustable dumbbell set ranging from 5 to 25 pounds with comfortable grip.' },
      { title: 'Cookbook', price: 24.99, stockCount: 40, category: 'Books', image: 'https://picsum.photos/seed/cookbook/400/300', description: 'Collection of 200 easy-to-follow recipes from around the world with beautiful photos.' },
    ]
    await Product.insertMany(products)
    console.log(`${products.length} products seeded`)
  } else {
    console.log(`${productCount} products already exist`)
  }

  process.exit(0)
}

seed()
