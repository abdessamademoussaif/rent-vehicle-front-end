import Header from "@/components/Header";
import { useState, useEffect } from "react";
import vehicleDetails from "./../Shared/vehicleDetails.json";
import InputField from "./components/InputField";
import DropdownField from "./components/DropdownField";
import TextAreaField from "./components/TextAreaField";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";

function UpdateVehicle() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [activeFields, setActiveFields] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [vehicleDetailsList, setVehicleDetailsList] = useState(
    vehicleDetails.vehicleDetails
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleField = (name) => {
    setActiveFields((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/categories`
      );
      const data = await res.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMarks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/marks`);
      const data = await res.json();
      setMarks(data.data);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMarks();
  }, []);

  const updateOptions = (list, index, options) => {
    return list.map((item, idx) =>
      idx === index ? { ...item, options } : item
    );
  };

  useEffect(() => {
    let updatedList = vehicleDetails.vehicleDetails;
    if (categories.length > 0) {
      updatedList = updateOptions(
        updatedList,
        3,
        categories.map((c) => ({ label: c.name, value: c._id }))
      );
    }
    if (marks.length > 0) {
      updatedList = updateOptions(
        updatedList,
        5,
        marks.map((m) => ({ label: m.name, value: m._id }))
      );
    }
    setVehicleDetailsList(updatedList);
  }, [categories, marks]);

  const updateVehicle = async () => {
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => activeFields[key])
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/vehicles/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredData),
        }
      );

      if (!response.ok) throw new Error("Failed request");

      const data = await response.json();
      toast.success("Vehicle updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to update vehicle.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    updateVehicle();
  };

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-70 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-600"></div>
        </div>
      )}

      <div className="mt-[100px] px-6 md:px-20 my-10">
        <h2 className="font-bold text-3xl mb-8">Update Vehicle</h2>
        <form
          className="p-6 md:p-10 border rounded-2xl shadow-md bg-white"
          onSubmit={onSubmit}
        >
          <h3 className="font-semibold text-xl mb-6">
            Choose fields to update
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicleDetailsList.map((item, index) => {
              const isActive = activeFields[item.name] || false;
              
                item.required =false;
              console.log(item.required)
              return (
                <div
                  key={index}
                  className={`flex flex-col gap-2 p-3 rounded-[6px] border ${
                    isActive
                      ? "bg-blue-50 border-blue-400"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-800">
                      {item?.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {isActive ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => handleToggleField(item.name)}
                      />
                    </div>
                  </div>

                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                      disabled={!isActive}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                      disabled={!isActive}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                      disabled={!isActive}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <Separator className="my-8" />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateVehicle;
