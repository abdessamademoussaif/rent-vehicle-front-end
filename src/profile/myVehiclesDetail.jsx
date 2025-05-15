import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MyVehiclesDetail = ({ vehicle }) => {
  return (
    <div
      key={vehicle._id}
      className="relative bg-white shadow-md rounded-lg p-4 flex flex-col"
    >
      {/* Badges */}
      {vehicle.condition === "new" && (
        <h2 className="absolute top-5 left-6 px-2 bg-green-500 rounded-full text-sm text-white">
          New
        </h2>
      )}
      {vehicle?.ratingsAverage && (
        <h2 className="absolute top-5 right-6 px-2 bg-yellow-500 rounded-full text-sm text-white">
          {vehicle.ratingsAverage} ⭐
        </h2>
      )}

      {/* Vehicle Image */}
      <img
        src={vehicle.imageCover}
        alt={vehicle.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Vehicle Info */}
      <h3 className="text-xl font-semibold">{vehicle.title}</h3>
      <p className="text-gray-600 line-clamp-3">{vehicle.description}</p>
      <p className="text-lg font-bold mt-2">{vehicle.pricePerDay}DH / day</p>

      {/* Action Buttons */}
      <div className="flex mt-4 gap-2">
        <Link to={`/listing-details/${vehicle._id}`} className="flex-1">
          <Button className="w-full">See Detail</Button>
        </Link>
        <Link to={`/update-vehicle/${vehicle._id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Update
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MyVehiclesDetail;
