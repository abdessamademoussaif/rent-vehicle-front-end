import { useState , useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const stats = [
    { label: 'Total Users', value: 120 },
    { label: 'Total Vehicles', value: 87 },
  ];

const api = axios.create({  
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
});

  

export default function DashboardStats() {
    const [countUsers, setCountUsers] = useState(0);
    const [countVehicles, setCountVehicles] = useState(0);

     const fetchUsersCount = async () => {
      try {
        const response = await api.get('/users/count', {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
          },
        });
        setCountUsers(response.data.data.count);
      } catch (error) {
        console.error('Error fetching users count:', error);
        return 0;
      }
    };
    
     const fetchVehiclesCount = async () => {
      try {
        const response = await api.get('/vehicles/count', {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
          },
        });
        setCountVehicles(response.data.data.count);
      } catch (error) {
        console.error('Error fetching vehicles count:', error);
        return 0;
      }
    };

  useEffect(() => {
       fetchUsersCount();
       fetchVehiclesCount();
    });
    stats[0].value = countUsers;
    stats[1].value = countVehicles;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{stat.label}</h2>
            <p className="text-2xl text-blue-600">{stat.value}</p>
          </div>
        ))}
      </div>  
    );
  }
  