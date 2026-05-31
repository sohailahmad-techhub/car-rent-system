import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ status: 'available' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Revenue calculations
    const bookings = await Booking.find({ status: { $in: ['approved', 'completed'] } });

    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;
    let yearRevenue = 0;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    bookings.forEach(b => {
      const bookingDate = new Date(b.createdAt);

      if (bookingDate >= startOfDay) todayRevenue += b.totalPrice;
      if (bookingDate >= startOfWeek) weekRevenue += b.totalPrice;
      if (bookingDate >= startOfMonth) monthRevenue += b.totalPrice;
      if (bookingDate >= startOfYear) yearRevenue += b.totalPrice;
    });

    res.json({
      totalVehicles,
      availableVehicles,
      pendingBookings,
      revenue: {
        today: todayRevenue,
        week: weekRevenue,
        month: monthRevenue,
        year: yearRevenue
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
