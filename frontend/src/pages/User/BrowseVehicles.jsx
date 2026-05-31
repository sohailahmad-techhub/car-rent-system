import React, { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { Car, Calendar, X, Check } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BrowseVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, bookingsRes] = await Promise.all([
          axios.get('/vehicles'),
          axios.get('/bookings/mine')
        ]);
        setVehicles(vehiclesRes.data.filter(v => v.status === 'available'));
        setMyBookings(bookingsRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    if (new Date(startDate) > new Date(endDate)) {
      setBookingError('End date must be after start date');
      setBookingLoading(false);
      return;
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = days * selectedVehicle.dailyRate;

    try {
      const res = await axios.post('/bookings', {
        vehicleId: selectedVehicle._id,
        startDate,
        endDate,
        totalPrice
      });
      // Add new booking to state so button updates immediately
      setMyBookings(prev => [...prev, res.data]);
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedVehicle(null);
        setBookingSuccess(false);
        setStartDate('');
        setEndDate('');
        navigate('/my-bookings');
      }, 2000);
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await axios.delete(`/bookings/${bookingId}`);
      setMyBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return <div className="p-8">Loading vehicles...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Find Your Perfect Ride</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Browse our collection of premium vehicles and send a booking request for your next journey.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((v) => {
          // Check for active booking state
          const activeBooking = myBookings.find(b => 
            (b.vehicle?._id === v._id || b.vehicle === v._id) && 
            ['pending', 'approved', 'in-use'].includes(b.status)
          );

          return (
            <div key={v._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden flex flex-col">
              <div className="h-48 bg-slate-100 relative group overflow-hidden">
                {v.imageUrl ? (
                  <img src={v.imageUrl} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <Car size={48} className="text-slate-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-slate-900 shadow-sm">
                  ${v.dailyRate} <span className="text-slate-500 font-normal text-xs">/day</span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{v.make} {v.model}</h3>
                <div className="flex items-center text-slate-500 text-sm mb-4">
                  <span>{v.year}</span>
                  <span className="mx-2">•</span>
                  <span>{v.licensePlate}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  {activeBooking ? (
                    activeBooking.status === 'pending' ? (
                      <button
                        onClick={() => handleCancelBooking(activeBooking._id)}
                        className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-red-100"
                      >
                        <X size={18} /> Cancel Booking
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-green-50 text-green-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 border border-green-100 opacity-80 cursor-not-allowed"
                      >
                        <Check size={18} /> Booked
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => setSelectedVehicle(v)}
                      className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar size={18} /> Request Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {vehicles.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No vehicles currently available. Please check back later.
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Booking</h2>
              <p className="text-slate-500 mb-6">{selectedVehicle.make} {selectedVehicle.model}</p>

              {bookingSuccess ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center flex flex-col items-center">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Check size={24} className="text-green-600" />
                  </div>
                  <p className="font-medium">Request Sent Successfully!</p>
                  <p className="text-sm mt-1 text-green-600">You can track its status in "My Bookings".</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  {bookingError && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm">{bookingError}</div>}
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input 
                      type="date" 
                      required 
                      min={startDate || new Date().toISOString().split('T')[0]}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
                    />
                  </div>
                  
                  {startDate && endDate && new Date(endDate) >= new Date(startDate) && (
                    <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                      <span className="text-slate-600 font-medium">Estimated Total:</span>
                      <span className="text-xl font-bold text-primary-600">
                        ${(Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1) * selectedVehicle.dailyRate}
                      </span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={bookingLoading}
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-70"
                  >
                    {bookingLoading ? 'Sending Request...' : 'Submit Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseVehicles;
