import Header from "@/components/Header";
import React from "react";
import DetailsHeader from "../components/DetailsHeader";
import { useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import Description from "../components/Description";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Specification from "../components/Specification";
import OwnersDetail from "../components/OwnersDetail";
import Footer from "@/components/Footer";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Reservation from "../components/Reservation";
import StarRating from "../components/StarRating";
function ListingDetails() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [vehicleDetail, setVehicleDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchVehicleDetail = async () => {
     
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/vehicles/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Category");
        }
        const data = await response.json();
        setVehicleDetail(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetail();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center  ">
          <div className="flex items-center space-x-3">
            <svg
              className="w-6 h-6 text-blue-500 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
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
            <span className="text-lg text-gray-700 font-medium">
              Loading, please wait...
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-20 p-10 md:px-20">
            <DetailsHeader VehicleDetail={vehicleDetail.data} />

            <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-10 gap-5">
              {/* right */}
              <div className="md:col-span-2 ">
                <ImageGallery imagesUrl={vehicleDetail.data.images} cover={vehicleDetail.data.imageCover} />
                <Description Description={vehicleDetail.data.description} />
                <Features Features={vehicleDetail.data.features} />
                <Reservation vehicleId={id} />
                <StarRating vehicleId={id} userId={userId} />
              </div>
              {/* right */}
              <div className="">
                <Pricing
                  Price={vehicleDetail.data.pricePerDay}
                  OfferPrice={vehicleDetail.data.priceAfterDiscount}
                />
                <Specification Vehicle={vehicleDetail.data} />
                <OwnersDetail Owner={vehicleDetail.data.owner} />
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default ListingDetails;
