import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import Card, { CardHeader, CardContent } from "./ui/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ActionButton from "./ActionButton";
import ConfirmModal from "./ConfirmModal";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
});

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, vehicle: null, action: null });

  const authHeaders = {
    Authorization: `Bearer ${Cookies.get("authToken")}`,
  };

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/vehicles", 
        { 
          headers: authHeaders,
        });
      const formatted = data.data.map((vehicle) => ({
        id: vehicle._id,
        title: vehicle.title,
        category: vehicle.category.name,
        mark: vehicle.mark.name,
      }));
      setVehicles(formatted);
    } catch {
      toast.error("Failed to fetch vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) =>
    [vehicle.title, vehicle.id, vehicle.mark, vehicle.category].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAction = async () => {
    const { open , vehicle, action } = modal;
    if (!vehicle || !action) return;

    const urlMap = {
      delete: `/vehicles/${vehicle.id}`,
    };

    const method = action === "delete" ? "delete":"delete";
    const url = urlMap[action];
    try {
      await api[method](url,
        { headers: authHeaders })
        ;

      setVehicles((prev) =>
        action === "delete"
          ? prev.filter((u) => u.id !== vehicle.id)
          : prev.map((u) =>
              u.id === vehicle.id
                ? { ...u, isActive: action === "activate" }
                : u
            )
      );

      toast.success(`Vehicle ${action}d`);
    } catch(error) {
      console.log(error);
      toast.error( error.response.data.message || `Failed to ${action} Vehicle` );
    } finally {
      setModal({ open: false, vehicle: null, action: null });
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Vehicles"
          description="View and manage vehicles list"
          action={
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
              onClick={() => console.log("Add new vehicle")}
            >
              +Add vehicle
            </Button>
          }
        />

        <div className="px-6 pt-4 flex flex-wrap gap-4 items-center justify-between border-b pb-4">
          <Input
            placeholder="Search vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            size="sm"
            onClick={fetchVehicles}
          >
            {isLoading && (
              <RefreshCw size={16} className="ml-1  animate-spin" />
            )}
            {!isLoading && <RefreshCw size={16} className="ml-1" />}
            Refresh
          </Button>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Vehicle", "Mark", "Category", "Actions"].map((title) => (
                    <th
                      key={title}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.length ? (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {vehicle.mark}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs font-semibold rounded-full`}
                        >
                          {vehicle.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <ActionButton
                            type="edit"
                            onClick={() =>
                              console.log("Edit vehicle", vehicle.id)
                            }
                          />
                          <ActionButton
                            type="delete"
                            onClick={() =>
                              setModal({
                                open: true,
                                vehicle,
                                action: "delete",
                              })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No vehicls found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={modal.open}
        onCancel={() => setModal({ open: false, vehicle: null, action: null })}
        onConfirm={handleAction}
        title={
          modal.vehicle && modal.action
            ? `Are you sure you want to ${modal.action} ${modal.vehicle.name}?`
            : ""
        }
      />
    </>
  );
};

export default VehicleList;
