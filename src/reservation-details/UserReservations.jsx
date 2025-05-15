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
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <div className="p-6 mt-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">My Reservations</h2>

        {reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <div className="space-y-6">
            {reservations.map((res) => (
              <div
                key={res._id}
                className="p-5 border rounded-[5px] shadow hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {res.vehicle?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      From {new Date(res.startDate).toLocaleDateString()} to{" "}
                      {new Date(res.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">Total: ${res.totalPrice}</p>
                    <p className="text-sm">
                      Status: <span className="font-medium">{res.status}</span>
                    </p>
                  </div>

                  <div className="flex gap-3 items-center">
                    {res.status === "pending" || res.status === "confirmed" ? (
                      <button
                        onClick={() =>{ setIsModalOpen(true);setReservationIdToCancel(res._id)}}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Cancel
                      </button>
                    ) : null}

                    <button
                      onClick={() => downloadInvoice(res)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Download Invoice
                    </button>

                    <Link
                      to={`/reservations/${res._id}`}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <ConfirmModal
          open={isModalOpen}
          title={"are you sure you want to cancel this reservation"}
          onConfirm={() => handleCancel(reservationIdToCancel)}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
      <Footer/>
    </>
  );
};

export default UserReservations;
