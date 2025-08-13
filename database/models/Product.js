import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true }, // Example: "STANDEE"
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    images: { type: [String], required: true }, // Array of Cloudinary URLs
    members: { type: [String], default: [] }, // Example: ["OT7"]
    description: { type: String }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

