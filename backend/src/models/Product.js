import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  stockCount: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
