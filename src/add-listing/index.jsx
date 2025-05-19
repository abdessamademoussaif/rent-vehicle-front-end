import Header from "@/components/Header";
import { React, useState, useEffect } from "react";
import vehicleDetails from "./../Shared/vehicleDetails.json";
import InputField from "./components/InputField";
import DropdownField from "./components/DropdownField";
import TextAreaField from "./components/TextAreaField";
import { Separator } from "@/components/ui/separator";
import features from "./../Shared/features.json";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import UploadImage from "./components/UploadImage";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddListing() {
  const [formData, setFormData] = useState({
    features: [],
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [imagesFiles, setImagesFiles] = useState([]);
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

  const handleFeatureChange = (featureName, isChecked) => {
    setFormData((prevData) => {
      const updatedFeatures = isChecked
        ? [...prevData.features, featureName]
        : prevData.features.filter((feature) => feature !== featureName);

      return {
        ...prevData,
        features: updatedFeatures,
      };
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/categories`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMarks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/marks`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMarks(data.data);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const addVehicle = async () => {
    try {
      const form = new FormData();
      form.append("owner", Cookies.get("userId"));

      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => form.append(key, item));
        } else {
          form.append(key, formData[key]);
        }
      }

      if (imagesFiles.length > 0) {
        form.append("imageCover", imagesFiles[0]);
        for (let i = 1; i < imagesFiles.length; i++) {
          form.append("images", imagesFiles[i]);
        }
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/vehicles`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
          body: form,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Vehicle added successfully:", data);
      toast.success("Vehicle added successfully!");
      setFormData({ features: [] });
      setImagesFiles([]);
      navigate("/profile");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle. Please try again.");
    } finally {
      setIsLoading(false);
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

  const onSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "title",
      "description",
      "capacity",
      "fuelType",
      "transmission",
      "location",
      "condition",
      "mileage",
      "year",
      "driveType",
      "doorCount",
      "offerType",
      "pricePerDay",
      "category",
      "mark",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill the required field: ${field}`);
        return;
      }
    }

    if (!imagesFiles.length) {
      alert("Please upload at least one image");
      return;
    }

    console.log("Submitting form data:", formData, imagesFiles);
    setIsLoading(true);
    addVehicle();
  };

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {/* is loading  */}

      {isLoading && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-800"></div>
          <img
            src="/vite.svg"
            className="rounded-full h-28 w-28 z-10"
            alt="Loading..."
          />
        </div>
      )}

      {/* end is loading  */}
      <div className="mt-[100px] px-10 md:px-20 my-10">
        <h2 className="font-bold text-4xl">Add New Vehicle</h2>
        <form className="p-10 border rounded-xl mt-10">
          <div>
            <h2 className="font-medium text-xl mb-6">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {vehicleDetailsList.map((item, index) => (
                <div key={index}>
                  <label className="text-sm">
                    {item?.label}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item?.fieldType === "text" ||
                  item?.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <Separator className="bg-gray-400 hidden md:block my-6" />

          {/* Features list */}
          <div>
            <h2 className="font-medium text-xl my-6">Features List</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.features.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Checkbox
                    onCheckedChange={(checked) =>
                      handleFeatureChange(item.label, checked)
                    }
                  />
                  <h2>{item.label}</h2>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Images */}
          <UploadImage
            imagesFiles={imagesFiles}
            setImagesFiles={setImagesFiles}
          />

          <div className="mt-10 flex justify-end text-white">
            <Button type="submit" onClick={onSubmit}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddListing;
