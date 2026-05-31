import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Check, X } from 'lucide-react';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error(`Failed to ${status} booking`, error);
      alert(error.response?.data?.message || `Failed to update booking status`);
    }
  };

  if (loading) return <div className="p-8">Loading bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Manage Booking Requests</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{b.user?.name}</div>
                  <div className="text-sm text-slate-500">{b.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{b.vehicle?.make} {b.vehicle?.model}</div>
                  <div className="text-xs text-slate-500">{b.vehicle?.licensePlate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                  ${b.totalPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${b.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      b.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      b.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {b.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleUpdateStatus(b._id, 'approved')} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full" title="Approve">
                        <Check size={18} />
                      </button>
                      <button onClick={() => handleUpdateStatus(b._id, 'rejected')} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full" title="Reject">
                        <X size={18} />
                      </button>
                    </div>
                  )}
                  {b.status === 'approved' && (
                    <button onClick={() => handleUpdateStatus(b._id, 'completed')} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
