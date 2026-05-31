import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { CalendarDays, Car, Clock, CheckCircle2, XCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const { data } = await axios.get('/bookings/mine');
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  if (loading) return <div className="p-8">Loading your bookings...</div>;

  const getStatusConfig = (status) => {
    switch(status) {
      case 'approved': return { color: 'text-green-700', bg: 'bg-green-50', icon: CheckCircle2, border: 'border-green-200' };
      case 'rejected': return { color: 'text-red-700', bg: 'bg-red-50', icon: XCircle, border: 'border-red-200' };
      case 'completed': return { color: 'text-blue-700', bg: 'bg-blue-50', icon: CheckCircle2, border: 'border-blue-200' };
      default: return { color: 'text-amber-700', bg: 'bg-amber-50', icon: Clock, border: 'border-amber-200' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <CalendarDays className="text-primary-600" /> My Booking Requests
      </h1>

      <div className="space-y-6">
        {bookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-48 h-48 sm:h-auto bg-slate-100 flex-shrink-0 relative">
                {booking.vehicle?.imageUrl ? (
                  <img src={booking.vehicle.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car size={40} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{booking.vehicle?.make} {booking.vehicle?.model}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} capitalize`}>
                      <StatusIcon size={14} /> {booking.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">License Plate: {booking.vehicle?.licensePlate}</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Dates</p>
                    <p className="text-slate-900 font-medium">
                      {new Date(booking.startDate).toLocaleDateString()} <span className="text-slate-400 mx-1">→</span> {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-primary-600">${booking.totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {bookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 border-dashed">
            <CalendarDays size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No Bookings Yet</h3>
            <p className="text-slate-500">You haven't made any vehicle booking requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
