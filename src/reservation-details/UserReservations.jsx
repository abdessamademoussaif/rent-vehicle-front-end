import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import logo from "../assets/EASYTRANS.png";
import org from "../assets/org.png";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import autoTable from "jspdf-autotable";
import Header from "@/components/Header";
import ConfirmModal from "@/components/ConfirmModal";
import Footer from "@/components/Footer";

const UserReservations = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationIdToCancel, setReservationIdToCancel] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [idClicked, setIdClicked] = useState(null);
  const token = Cookies.get("authToken");
  const userId = Cookies.get("userId");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/bookings/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setReservations(data.data || []);
    } catch (err) {
      toast.error("Error loading reservations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/bookings/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Reservation cancelled");
      setIsModalOpen(false);
      fetchReservations();
    } catch (err) {
      toast.error("Cancellation failed");
      console.error(err);
    }
  };

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
    });
  };

  const downloadInvoice = async (reservation) => {
    setIdClicked(reservation._id);
    setPdfLoading(true);
    const [logoImg, orgImg] = await Promise.all([
      loadImage(logo),
      loadImage(org),
    ]);

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
        ["Start Date", reservation.startDate],
        ["End Date", reservation.endDate],
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
    setPdfLoading(false);
  };

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <div className="px-4 py-8 mt-24 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">
          My Reservations
        </h2>

        {loading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur">
            <div className="flex flex-col items-center space-y-4">
              <svg
                className="w-8 h-8 text-blue-500 animate-spin"
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
              <span className="text-gray-600 text-lg font-medium">
                Loading, please wait...
              </span>
            </div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-2xl shadow-sm text-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25H8.25v3.75M8.25 18v-.75A2.25 2.25 0 0110.5 15h3a2.25 2.25 0 012.25-2.25v-.75h-9V5.25M6.75 9V5.25l1.5 9a2.25 2.25 0 002.25 2.25h6a2.25 2.25 0 002.25-2.25L17.25 9"
              />
            </svg>
            <h4 className="text-gray-700 text-xl font-semibold">
              No reservations found
            </h4>
            <p className="text-gray-500 mt-2">
              You haven’t booked anything yet. Start exploring vehicles!
            </p>
          </div>
        ) : (
          <div className="space-y-6 ">
            {reservations?.map((res) => (
              <div
                key={res._id}
                className="relative p-5 border rounded-xl shadow hover:shadow-md transition bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {res.vehicle?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(res.startDate).toLocaleDateString()} -{" "}
                      {new Date(res.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total:{" "}
                      <span className="font-medium">{res.totalPrice} DH</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          res.status === "cancelled"
                            ? "text-red-500"
                            : res.status === "confirmed"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {res.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4 ms:mb-0">
                    {(res.status === "pending" ||
                      res.status === "confirmed") && (
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setReservationIdToCancel(res._id);
                        }}
                        className="px-4 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => downloadInvoice(res)}
                      className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                    >
                      {pdfLoading && res._id==idClicked ? "loading..." : "Download Invoice"}
                    </button>
                    <Link
                      to={`/reservations/${res._id}`}
                      className="px-4 py-2 rounded-full bg-gray-700 text-white text-sm hover:bg-gray-800 transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
                <div className="absolute bottom-3 right-5 text-xs text-gray-400">
                  Created: {new Date(res.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmModal
          open={isModalOpen}
          title="Are you sure you want to cancel this reservation?"
          onConfirm={() => handleCancel(reservationIdToCancel)}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>

      <Footer />
    </>
  );
};

export default UserReservations;
