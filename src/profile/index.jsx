import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import MyVehiclesDetail from "./myVehiclesDetail";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";

function Profile() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const userId = Cookies.get("userId");
  const token = Cookies.get("authToken");
  const [userVehicles, setUserVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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
      toast.success("Vehicle deleted successfully");
      setUserVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
    } catch (err) {
      toast.error(err.message || "Something went wrong");
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

      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-10 w-10 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="text-indigo-700 text-lg font-medium">
              Loading, please wait...
            </p>
          </div>
        </div>
      ) : (
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
      )}

      {error && (
        <div className="flex justify-center items-center h-[80vh]">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-2xl shadow-md max-w-md text-center space-y-3">
            <div className="flex justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold">{error}</h1>
            <p className="text-sm text-red-500">
              Something went wrong. Please try again later.
            </p>
          </div>
        </div>
      )}

      {!loading && <Footer />}
    </div>
  );
}

export default Profile;
