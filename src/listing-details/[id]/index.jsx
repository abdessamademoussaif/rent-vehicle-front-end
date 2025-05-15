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
  const userId = Cookies.get("userId")

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="mt-20 p-10 md:px-20">
        <DetailsHeader VehicleDetail={vehicleDetail.data} />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-10 gap-5">
          {/* right */}
          <div className="md:col-span-2 ">
            <ImageGallery imageUrl={vehicleDetail.data.imageCover} />
            <Description Description={vehicleDetail.data.description} />
            <Features Features={vehicleDetail.data.features} />
            <Reservation vehicleId={id}/>
            <StarRating vehicleId={id} userId={userId}/>
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
    </div>
  );
}

export default ListingDetails;
