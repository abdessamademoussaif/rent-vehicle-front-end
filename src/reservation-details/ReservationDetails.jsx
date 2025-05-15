import React, { useEffect, useState } from "react";
import logo from "../assets/EASYTRANS.png";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import autoTable from "jspdf-autotable";
import org from "../assets/org.png";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const ReservationDetails = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const token = Cookies.get("authToken");
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );

  useEffect(() => {
    fetchReservation();
  }, []);

  const fetchReservation = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      setReservation(data);
      setStatus(data.status);
    } catch (err) {
      toast.error("Failed to load reservation");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Status update failed");

      toast.success("Status updated successfully");
      fetchReservation();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const handleMessageCustomer = () => {
    navigate(`/messages?to=${reservation.user._id}`);
  };

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  const generatePDF = async () => {
    const [logoImg, orgImg] = await Promise.all([
      loadImage(logo),
      loadImage(org),
    ]);
   console.log(reservation)
    const doc = new jsPDF();

    const desiredHeight = 15;
    const aspectRatio = logoImg.width / logoImg.height;
    const autoWidth = desiredHeight * aspectRatio;
    doc.addImage(logoImg, "PNG", 14, 11, autoWidth, desiredHeight);

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Reservation Invoice", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Reservation ID: ${reservation._id}`, 14, 35);
    doc.text(`Status: ${reservation.status}`, 14, 42);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 49);

    autoTable(doc, {
      startY: 58,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: { textColor: 50 },
      head: [["Section", "Details"]],
      body: [
        ["Start Date", new Date(reservation.startDate).toLocaleDateString()],
        ["End Date", new Date(reservation.endDate).toLocaleDateString()],
        [
          "Vehicle",
          `${reservation.vehicle?.mark.name} ${
            reservation.vehicle?.model || ""
          }`,
        ],
        ["Location", reservation.vehicle?.location || ""],
        ["Price Per Day", `${reservation.vehicle?.pricePerDay}DH`],
        ["Total Price", `${reservation.totalPrice}DH`],
        ["Customer", reservation.user?.name],
        ["Email", reservation.user?.email],
        ["Phone", reservation.userPhone],
      ],
    });

    const desiredHeight1 = 70;
    const aspectRatio1 = orgImg.width / orgImg.height;
    const autoWidth1 = desiredHeight1 * aspectRatio1;
    doc.addImage(orgImg, "PNG", 80, 150, autoWidth1, desiredHeight1);

    const website = "https://easytrans.com";
    const twitter = "https://x.com/Abdssamade97267";
    const facebook = "https://www.facebook.com/profile.php?id=100070846296690";
    const footerY = 270;

    doc.setFontSize(10);
    doc.text("Thank you for using our service!", 14, footerY - 10);
    doc.text(`Website: ${website}`, 14, footerY);
    doc.text(`X: ${twitter}`, 14, footerY + 5);
    doc.text(`Facebook: ${facebook}`, 14, footerY + 10);

    const qrCodeDataUrl = await QRCode.toDataURL(website);
    doc.addImage(qrCodeDataUrl, "PNG", 160, footerY - 5, 30, 30);

    doc.save("invoice.pdf");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!reservation)
    return <div className="p-6 text-red-500">Reservation not found.</div>;

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="p-6 mt-24 max-w-4xl mx-auto bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Reservation Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold">Dates</h3>
            <p>
              <strong>Start:</strong> {reservation.startDate}
            </p>
            <p>
              <strong>End:</strong> {reservation.endDate}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Vehicle</h3>
            <p>
              {reservation.vehicle.brand} {reservation.vehicle.model}
            </p>
            <p>Price per day: ${reservation.vehicle.pricePerDay}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Customer</h3>
            <p>{reservation.user.name}</p>
            <p>Email: {reservation.user.email}</p>
            <p>Phone: {reservation.user.phone}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Pricing</h3>
            <p>
              Total: <strong>${reservation.totalPrice}</strong>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-3 py-2 w-full max-w-xs"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleStatusChange}
            className="mt-3 ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Update Status
          </button>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleMessageCustomer}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Message Customer
          </button>

          <button
            onClick={generatePDF}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Download Invoice PDF
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ReservationDetails;
