import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import Order from './models/Order.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: [
    'https://my-ecom-coral.vercel.app', // <-- Put your real Vercel URL here!
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json())

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/dashboard', dashboardRoutes)

await connectDB()

setInterval(async () => {
  try {
    await Order.updateMany(
      { status: 'Pending', deliveryDate: { $lte: new Date() } },
      { status: 'Completed' }
    )
  } catch {
    // silently fail
  }
}, 30_000)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
