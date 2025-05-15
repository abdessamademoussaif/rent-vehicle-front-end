import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Category from './components/Category'
import MostSearshVehicle from './components/MostSearshVehicle'
import Footer from './components/Footer'
import { useState , useEffect } from 'react'
import Cookies from "js-cookie";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("authToken"));
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/vehicles`);
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);
  return (
    <div>
      {/*Header*/}
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setVehicles={setVehicles} />
     {/*Hero*/}
      <Hero/>
      {/*Category*/}
      <Category setVehicles={setVehicles}/>
      {/*Most Search Vehicle*/}
      <MostSearshVehicle loading={loading} vehicles={vehicles} error={error}/>
      {/*info Section*/}
      {/* <InfoSection/> */}
      {/*Footer*/}
      <Footer/>
    </div>
  )
}

export default Home