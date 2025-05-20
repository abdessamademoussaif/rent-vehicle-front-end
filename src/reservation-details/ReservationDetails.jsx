import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import autoTable from "jspdf-autotable";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import logo from "../assets/EASYTRANS.png";
import org from "../assets/org.png";

import { MessageSquare, FileText, Loader2, Ban } from "lucide-react";

const ReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get("authToken");
  const userId = Cookies.get("userId");

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [pdfLoading,setPdfLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    fetchReservation();
  }, []);

  const fetchReservation = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setReservation(data);
      setStatus(data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Status update failed");
      toast.success("Status updated successfully");
      fetchReservation();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const generatePDF = async () => {
    setPdfLoading(true);
    const doc = new jsPDF();
    const [logoImg, orgImg] = await Promise.all([loadImage(logo), loadImage(org)]);

    const autoWidth = 15 * (logoImg.width / logoImg.height);
    doc.addImage(logoImg, "PNG", 14, 11, autoWidth, 15);

    doc.setFontSize(18);
    doc.text("Reservation Invoice", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Reservation ID: ${reservation._id}`, 14, 35);
    doc.text(`Status: ${reservation.status}`, 14, 42);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 49);

    autoTable(doc, {
      startY: 58,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { textColor: 50 },
      head: [["Section", "Details"]],
      body: [
        ["Start Date", new Date(reservation.startDate).toLocaleDateString()],
        ["End Date", new Date(reservation.endDate).toLocaleDateString()],
        ["Vehicle", `${reservation.vehicle?.mark?.name || ""} ${reservation.vehicle?.model || ""}`],
        ["Location", reservation.vehicle?.location || ""],
        ["Price Per Day", `${reservation.vehicle?.pricePerDay} DH`],
        ["Total Price", `${reservation.totalPrice} DH`],
        ["Customer", reservation.user?.name],
        ["Email", reservation.user?.email],
        ["Phone", reservation.userPhone],
      ],
    });

    const autoWidth1 = 70 * (orgImg.width / orgImg.height);
    doc.addImage(orgImg, "PNG", 80, 150, autoWidth1, 70);

    const footerY = 270;
    const website = "https://easytrans.com";
    doc.setFontSize(10);
    doc.text("Thank you for using our service!", 14, footerY - 10);
    doc.text(`Website: ${website}`, 14, footerY);

    const qrCode = await QRCode.toDataURL(website);
    doc.addImage(qrCode, "PNG", 160, footerY - 5, 30, 30);
    doc.save("invoice.pdf");
    setPdfLoading(false);
  };

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });

  const handleMessage = () => {
    if (reservation) {
      navigate(`/messages?to=${reservation.vehicle.owner._id}`);
    }
  };

  const ReservationInfoBlock = ({ title, children }) => (
    <div className="relative p-5 pb-8 border rounded-xl shadow bg-white">
      <div className="text-base font-semibold text-gray-700 mb-2">{title}</div>
      <div className="text-sm text-gray-600 space-y-1">{children}</div>
      <img src={logo} alt="Watermark" className="absolute bottom-2 left-2 opacity-10 w-16" />
    </div>
  );

  return (
    <>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <main className="min-h-screen bg-gray-50 pt-24 px-4 pb-10">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600 text-lg">Loading reservation...</span>
          </div>
        ) : !reservation ? (
          <div className="text-center py-20 bg-white shadow rounded-xl max-w-xl mx-auto mt-10">
            <Ban className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-700">Reservation not found</h3>
            <p className="text-sm text-gray-500">It might have been deleted or is no longer available.</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Reservation Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReservationInfoBlock title="Dates">
                <p><strong>Start:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
                <p><strong>End:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
              </ReservationInfoBlock>

              <ReservationInfoBlock title="Vehicle">
                <p>{reservation.vehicle.brand} {reservation.vehicle.model}</p>
                <p>Price per day: {reservation.vehicle.pricePerDay} DH</p>
              </ReservationInfoBlock>

              <ReservationInfoBlock title="Customer">
                <p>{reservation.user.name}</p>
                <p>Email: {reservation.user.email}</p>
                <p>Phone: {reservation.userPhone}</p>
              </ReservationInfoBlock>

              <ReservationInfoBlock title="Pricing">
                <p>Total: <strong>{reservation.totalPrice} DH</strong></p>
              </ReservationInfoBlock>
            </div>

            {reservation.status === "cancelled" ? (
              <div className="mt-6 flex items-center justify-center bg-red-100 border border-red-300 text-red-700 py-4 rounded-md px-6 shadow-sm">
                <Ban className="w-5 h-5 mr-2" />
                <p className="text-base font-medium">This reservation was cancelled.</p>
              </div>
            ) : (
              <>
                {userId === reservation.vehicle.owner._id && (
                  <div className="mt-6 max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                    <div className="flex items-center gap-3">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={handleStatusChange}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={handleMessage}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    <MessageSquare size={18} />
                    {reservation.vehicle.owner._id === userId ? "Message Customer" : "Message Supplier"}
                  </button>

                  <button
                    onClick={generatePDF}
                    className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    <FileText size={18} />
                    {pdfLoading ? 'loading...':'Download PDF'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ReservationDetails;
