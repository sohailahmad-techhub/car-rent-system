import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Admin can be added for demo
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await register(name, email, password, role);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/vehicles');
      }
    } catch (err) {
      if (!err.response) {
        setError('Registration failed: Cannot reach backend server. Make sure the backend is running (npm run dev in backend).');
      } else {
        setError(err.response.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
            <Car size={28} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Email address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Register As</label>
              <select
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Register
            </button>
          </div>
          <div className="text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
