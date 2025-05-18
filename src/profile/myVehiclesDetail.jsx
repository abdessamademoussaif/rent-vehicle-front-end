import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Trash2 } from "lucide-react";

const MyVehiclesDetail = ({ vehicle, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete && typeof onDelete === "function") {
      onDelete(vehicle._id);
    }
  };

  return (
    <div className="relative bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 flex flex-col group border border-gray-100">
      {/* Badges */}
      {vehicle.condition === "new" && (
        <span className="absolute top-4 left-4 px-2 py-0.5 bg-green-500 rounded-full text-xs font-medium text-white shadow">
          New
        </span>
      )}
      {vehicle?.ratingsAverage && (
        <span className="absolute top-5 right-5 px-2 py-0.5 bg-yellow-500 rounded-full text-xs font-medium text-white shadow">
          {vehicle.ratingsAverage} ⭐
        </span>
      )}

      {/* Image */}
      <img
        src={vehicle.imageCover}
        alt={vehicle.title}
        className="w-full h-48 object-cover rounded-[6px] mb-3 transition-transform group-hover:scale-[1.01]"
      />

      {/* Info */}
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{vehicle.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-3">{vehicle.description}</p>
      <p className="text-base font-bold text-blue-600 mt-2">{vehicle.pricePerDay} DH / day</p>

      {/* Action Buttons */}
      <div className="flex mt-4 gap-2">
        <Link to={`/listing-details/${vehicle._id}`} className="flex-1">
          <Button className="w-full">See Detail</Button>
        </Link>
        <Link to={`/update-vehicle/${vehicle._id}`} className="flex-1">
          <Button variant="outline" className="w-full">Update</Button>
        </Link>
      </div>

      {/* Delete Button */}
      <Button
        variant="destructive"
        className="mt-2 w-full flex items-center justify-center gap-2"
        onClick={() => setShowConfirm(true)}
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-[12px] flex flex-col justify-center items-center text-center px-4">
          <div className="bg-white p-5 rounded-[6px] shadow-lg w-full max-w-sm">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-800 mb-2">
              Are you sure you want to delete this vehicle?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                Yes, Delete
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVehiclesDetail;
