import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Category from "./components/Category";
import MostSearshVehicle from "./components/MostSearshVehicle";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const getLoggedUserData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/getMe`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      Cookies.set("userId", data.data._id);
      Cookies.set("profileImg", data.data.profileImg);
      Cookies.set("role", data.data.role);
    } catch (error) {
      console.log("error on get logged user data:" + error);
    }
  };
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/vehicles`
        );
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
    if (token) {
      Cookies.set("authToken", token);
      setIsAuthenticated(true);
      getLoggedUserData();
      queryParams.delete("token");
      const newUrl = window.location.pathname + "" + queryParams.toString();
      window.history.replaceState({}, "", newUrl);
    }

    fetchVehicles();
  }, []);
  return (
    <div>
      {/*Header*/}
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        setVehicles={setVehicles}
      />
      {/*Hero*/}
      <Hero />
      {/*Category*/}
      <Category setVehicles={setVehicles} />
      {/*Most Search Vehicle*/}
      <MostSearshVehicle loading={loading} vehicles={vehicles} error={error} />
      {/*info Section*/}
      {/* <InfoSection/> */}
      {/*Footer*/}
      {!loading && <Footer />}
    </div>
  );
}

export default Home;
