import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CountUp from 'react-countup';
import { FaUsers, FaCar, FaTags, FaThList, FaSyncAlt } from 'react-icons/fa';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
});

export default function DashboardStats() {
  const [countUsers, setCountUsers] = useState(0);
  const [countVehicles, setCountVehicles] = useState(0);
  const [countCategories, setCountCategories] = useState(0);
  const [countMarks, setCountMarks] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, vehiclesRes, categoriesRes, marksRes] = await Promise.all([
        api.get('/users/count', { headers }),
        api.get('/vehicles/count', { headers }),
        api.get('/categories/count', { headers }),
        api.get('/marks/count', { headers }),
      ]);

      setCountUsers(usersRes.data.data.count);
      setCountVehicles(vehiclesRes.data.data.count);
      setCountCategories(categoriesRes.data.data.count);
      setCountMarks(marksRes.data.data.count);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin mx-auto" />
          <p className="text-indigo-700 font-medium animate-pulse">Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex justify-end">
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-[6px] hover:bg-indigo-700 transition"
        >
          <FaSyncAlt className="animate-spin-once" />
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatSection title="General Overview">
          <StatCard icon={<FaUsers />} label="Total Users" value={countUsers} color="text-purple-600" />
          <StatCard icon={<FaCar />} label="Total Vehicles" value={countVehicles} color="text-blue-600" />
        </StatSection>

        <StatSection title="Categories & Marks">
          <StatCard icon={<FaThList />} label="Categories" value={countCategories} color="text-green-600" />
          <StatCard icon={<FaTags />} label="Marks" value={countMarks} color="text-pink-600" />
        </StatSection>
      </div>
    </div>
  );
}

function StatSection({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 px-5 py-4 rounded-xl shadow-sm hover:shadow-md transition duration-200">
      <div className="flex items-center gap-4">
        <div className={`text-3xl ${color}`}>{icon}</div>
        <span className="text-md font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-2xl font-bold text-gray-900">
        <CountUp end={value} duration={1.2} separator="," />
      </span>
    </div>
  );
}
