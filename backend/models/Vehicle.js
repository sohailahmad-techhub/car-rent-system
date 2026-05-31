import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  licensePlate: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'maintenance', 'in-use'], default: 'available' },
  dailyRate: { type: Number, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
