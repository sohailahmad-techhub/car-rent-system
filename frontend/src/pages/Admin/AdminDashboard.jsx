import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Car, CheckCircle, Clock, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Vehicles', value: stats?.totalVehicles || 0, icon: Car, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Available Vehicles', value: stats?.availableVehicles || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Pending Bookings', value: stats?.pendingBookings || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center">
            <div className={`p-4 rounded-lg ${card.bg} ${card.color} mr-4`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Insights */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <DollarSign className="text-green-600" /> Revenue Insights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-sm font-medium text-slate-500">Today's Revenue</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">${stats?.revenue?.today || 0}</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-sm font-medium text-slate-500">This Week</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">${stats?.revenue?.week || 0}</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-sm font-medium text-slate-500">This Month</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">${stats?.revenue?.month || 0}</h3>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <p className="text-sm font-medium text-slate-500">This Year</p>
          <h3 className="text-3xl font-bold text-primary-600 mt-2">${stats?.revenue?.year || 0}</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
