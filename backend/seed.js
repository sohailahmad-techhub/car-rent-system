import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding');

        // Create admin
        const adminExists = await User.findOne({ email: 'admin@demo.com' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            await User.create({
                name: 'Demo Admin',
                email: 'admin@demo.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Demo Admin created');
        } else {
            console.log('Demo Admin already exists');
        }

        // Create user
        const userExists = await User.findOne({ email: 'user@demo.com' });
        if (!userExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            await User.create({
                name: 'Demo User',
                email: 'user@demo.com',
                password: hashedPassword,
                role: 'user'
            });
            console.log('Demo User created');
        } else {
            console.log('Demo User already exists');
        }

        // Create some vehicles
        const vehicles = await Vehicle.find();
        if (vehicles.length === 0) {
            await Vehicle.create([
                { make: 'Toyota', model: 'Camry', year: 2022, licensePlate: 'ABC-123', status: 'available' },
                { make: 'Honda', model: 'Civic', year: 2021, licensePlate: 'XYZ-789', status: 'available' },
                { make: 'Ford', model: 'Mustang', year: 2023, licensePlate: 'MUS-001', status: 'maintenance' },
            ]);
            console.log('Demo Vehicles created');
        } else {
            console.log('Vehicles already exist');
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
