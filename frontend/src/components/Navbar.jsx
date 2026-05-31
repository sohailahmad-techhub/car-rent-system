import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Car, Menu, X, LogOut, LayoutDashboard, CalendarDays } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-dark">AutoManage</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {user && (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <LayoutDashboard size={18}/> Dashboard
                    </Link>
                    <Link to="/admin/vehicles" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <Car size={18}/> Vehicles
                    </Link>
                    <Link to="/admin/bookings" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <CalendarDays size={18}/> Bookings
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/vehicles" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <Car size={18}/> Browse
                    </Link>
                    <Link to="/my-bookings" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <CalendarDays size={18}/> My Bookings
                    </Link>
                  </>
                )}
                <div className="border-l border-slate-200 h-6 mx-2"></div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            )}
            {!user && (
              <div className="flex space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-slate-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Login</Link>
                <Link to="/register" className="block px-4 py-2 text-base font-medium text-primary-600 hover:bg-slate-50">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
