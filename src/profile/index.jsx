import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import MyVehiclesDetail from "./myVehiclesDetail";
import Footer from "@/components/Footer";

function Profile() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const userId = Cookies.get("userId");
  const token = Cookies.get("authToken");
  const [userVehicles, setUserVehicles] = useState([]);
  const [error, setError] = useState(null);

  const fetchUserVehicles = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/vehicles/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setUserVehicles(data.data.vehicles);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/vehicles/${vehicleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete vehicle");

      setUserVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchUserVehicles();
    }
  }, [userId, token]);

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="mt-[100px] px-10 md:px-20 my-10">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-4xl">My Listing</h2>
          <Link to={"/add-listing"}>
            <Button>+ Add New Vehicle</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10 md:px-20 my-10">
        {userVehicles.length > 0 ? (
          userVehicles.map((vehicle) => (
            <MyVehiclesDetail
              key={vehicle._id}
              vehicle={vehicle}
              onDelete={handleDeleteVehicle}
            />
          ))
        ) : error ? null : (
          <div className="flex justify-center items-center h-[80vh]">
            <h1 className="text-4xl font-bold">No Listings Found</h1>
          </div>
        )}
      </div>

      {error && (
        <div className="flex justify-center items-center h-[80vh]">
          <h1 className="text-4xl font-bold text-red-500">{error}</h1>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Profile;
