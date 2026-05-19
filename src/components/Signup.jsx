import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Shield } from 'lucide-react';
import CustomSelect from './CustomSelect';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const res = signup(formData);
    setIsLoading(false);
    
    if (res.success) {
      if (res.role === 'admin') navigate('/admin');
      else navigate('/user');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 relative z-10">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-4 rounded-2xl shadow-lg mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-blue-800 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Join to manage and view products
          </p>
        </div>
        
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
              <input
                name="username"
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-white/50 focus:bg-white"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all bg-white/50 focus:bg-white"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="relative z-10">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
              <CustomSelect
                value={formData.role}
                onChange={val => setFormData({ ...formData, role: val })}
                placeholder="Select Role"
                icon={Shield}
                options={[
                  { label: 'Normal User', value: 'user' },
                  { label: 'Administrator', value: 'admin' }
                ]}
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center font-medium bg-red-50 py-3 rounded-xl border border-red-100">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Sign up'}
            </button>
          </div>
          
          <div className="text-center text-sm font-medium pt-2">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
