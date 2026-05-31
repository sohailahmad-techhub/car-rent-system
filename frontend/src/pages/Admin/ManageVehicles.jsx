import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus, Edit2, Trash2, Car, Calendar, Tag, Activity } from 'lucide-react';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ make: '', model: '', year: '', licensePlate: '', dailyRate: '', status: 'available' });
  const [editingId, setEditingId] = useState(null);

  const fetchVehicles = async () => {
    try {
      const { data } = await axios.get('/vehicles');
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/vehicles/${editingId}`, formData);
      } else {
        await axios.post('/vehicles', formData);
      }
      setShowModal(false);
      setFormData({ make: '', model: '', year: '', licensePlate: '', dailyRate: '', status: 'available' });
      setEditingId(null);
      fetchVehicles();
    } catch (error) {
      console.error('Failed to save vehicle', error);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      dailyRate: vehicle.dailyRate,
      status: vehicle.status
    });
    setEditingId(vehicle._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`/vehicles/${id}`);
        fetchVehicles();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  // Helper to generate a consistent gradient based on vehicle make/model string length
  const getGradient = (text) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-rose-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-purple-500 to-violet-600'
    ];
    const index = text.length % gradients.length;
    return gradients[index];
  };

  if (loading) return <div className="p-8 flex justify-center items-center h-64 text-slate-500">Loading vehicles...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Vehicles</h1>
          <p className="text-slate-500 mt-1">Add, edit, or remove vehicles from your fleet.</p>
        </div>
        <button
          onClick={() => { setFormData({ make: '', model: '', year: '', licensePlate: '', dailyRate: '', status: 'available' }); setEditingId(null); setShowModal(true); }}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all"
        >
          <Plus size={20} /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
            {/* Styled Placeholder Banner */}
            <div className={`h-32 bg-gradient-to-r ${getGradient(v.make + v.model)} relative flex items-center justify-center overflow-hidden`}>
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:16px_16px]"></div>
              
              <Car size={64} className="text-white opacity-20 transform -rotate-12 scale-150 absolute right-4 -bottom-4" />
              
              <div className="relative z-10 flex flex-col items-center">
                <Car size={32} className="text-white mb-2" />
                <span className="text-white/90 font-bold tracking-wider text-sm uppercase">{v.make}</span>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{v.make} {v.model}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                    <Tag size={14} /> {v.licensePlate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-primary-600">${v.dailyRate}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">per day</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm text-slate-500"><Calendar size={16} /></div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Year</p>
                    <p className="text-sm font-bold text-slate-800">{v.year}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm text-slate-500"><Activity size={16} /></div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Status</p>
                    <p className={`text-sm font-bold ${v.status === 'available' ? 'text-green-600' : v.status === 'in-use' ? 'text-blue-600' : 'text-amber-600'}`}>
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => handleEdit(v)} 
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium rounded-xl transition-colors"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(v._id)} 
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <Car size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No vehicles found</h3>
            <p className="text-slate-500 mt-1">Get started by adding your first vehicle to the fleet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{editingId ? 'Edit Vehicle details' : 'Add New Vehicle'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Make</label>
                  <input type="text" name="make" value={formData.make} onChange={handleInputChange} required placeholder="e.g. Toyota" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Model</label>
                  <input type="text" name="model" value={formData.model} onChange={handleInputChange} required placeholder="e.g. Camry" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Year</label>
                  <input type="number" name="year" value={formData.year} onChange={handleInputChange} required placeholder="2024" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">License Plate</label>
                  <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} required placeholder="ABC-1234" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Daily Rate ($)</label>
                  <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleInputChange} required placeholder="50" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="in-use">In Use</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all shadow-sm">
                  {editingId ? 'Save Changes' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVehicles;
