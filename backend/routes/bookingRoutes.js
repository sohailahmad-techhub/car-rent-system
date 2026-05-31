import express from 'express';
import { createBooking, getMyBookings, getAllBookings, updateBookingStatus, deleteMyBooking } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.route('/mine').get(protect, getMyBookings);

router.route('/:id')
  .delete(protect, deleteMyBooking);

router.route('/:id/status').put(protect, admin, updateBookingStatus);

export default router;
