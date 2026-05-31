import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';

export const createBooking = async (req, res) => {
  const { vehicleId, startDate, endDate, totalPrice } = req.body;
  try {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    // Prevent Double Booking Validation
    const overlappingBookings = await Booking.find({
      vehicle: vehicleId,
      status: { $in: ['approved', 'pending'] },
      $or: [
        { startDate: { $lte: eDate }, endDate: { $gte: sDate } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Vehicle is already booked for the selected dates' });
    }

    const booking = new Booking({
      user: req.user._id,
      vehicle: vehicleId,
      startDate: sDate,
      endDate: eDate,
      totalPrice
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('vehicle', 'make model licensePlate imageUrl');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').populate('vehicle', 'make model licensePlate');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      
      // Optionally update vehicle status if approved/completed
      if (status === 'approved') {
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'in-use' });
      } else if (status === 'completed' || status === 'rejected') {
        await Vehicle.findByIdAndUpdate(booking.vehicle, { status: 'available' });
      }

      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // Check if the user owns the booking
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this booking' });
      }
      
      // Check if it's pending (cannot cancel an approved or completed booking easily here)
      if (booking.status !== 'pending') {
        return res.status(400).json({ message: 'Can only cancel pending bookings' });
      }

      await booking.deleteOne();
      res.json({ message: 'Booking cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
