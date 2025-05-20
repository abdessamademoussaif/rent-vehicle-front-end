import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleNotificationClick = async (notification) => {
  
    if (!notification.isRead) {
      await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/notifications/${notification._id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    onClose(); 
    if (notification.type === "reservation") {
      navigate(`/reservations/${notification.metadata.reservationId}`);
    } else if (notification.type === "message") {
      navigate("/messages");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-4 top-24 w-80 bg-white shadow-xl border border-gray-200 rounded-[6px] z-50"
    >
      <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>
      <ul className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="p-4 text-gray-500">No notifications</li>
        ) : (
          notifications?.map((notification) => (
            <li
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition ${
                !notification.isRead ? "bg-blue-50 font-medium" : ""
              }`}
            >
              <p className="text-sm">{notification.content}</p>
              <span className="text-xs text-gray-400 block mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
