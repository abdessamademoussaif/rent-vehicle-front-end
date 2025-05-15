import React, { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Reservation = ({ vehicleId }) => {
  const [formData, setFormData] = useState({
    userName: "",
    startDate: "",
    endDate: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("authToken");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateFields = () => {
    const requiredFields = [
      "userName",
      "startDate",
      "endDate",
      "userEmail",
      "userPhone",
      "userAddress",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError("Please fill in all the fields.");
        return false;
      }
    }
    return true;
  };

  const validateDates = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (start < now) {
      setError("Start date cannot be in the past.");
      return false;
    }
    if (end <= start) {
      setError("End date must be after the start date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields() || !validateDates()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            vehicle: vehicleId,
          }),
        }
      );
      console.log(JSON.stringify({
            ...formData,
            vehicle: vehicleId,
          }))
      const data = await res.json();

      if (!res.ok) {
        const msg =
          data.message ||
          "This vehicle is already reserved for the selected dates.";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Your reservation is complete. Awaiting owner response.");

      // Reset form
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error submitting reservation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 rounded-xl border shadow-xl my-7">
      <h2 className="font-medium text-2xl">Reserve Now</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-7"
      >
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded w-full"
        />

        <input
          type="email"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full"
        />

        <input
          type="tel"
          name="userPhone"
          value={formData.userPhone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          name="userAddress"
          value={formData.userAddress}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        {error && (
          <div className="col-span-full text-red-600 font-medium">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`col-span-full md:col-span-2 lg:col-span-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Processing..." : "Submit Reservation"}
        </button>
      </form>
    </div>
  );
};

export default Reservation;
