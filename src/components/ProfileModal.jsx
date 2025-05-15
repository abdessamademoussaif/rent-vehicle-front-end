import React, { useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { RiTruckLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaRegBookmark } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
function ProfileModal({ onClose, onLogout }) {
  const profileModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile-setting");
    onClose();
  };
  const role = Cookies.get("role");
  return (
    <div
      ref={profileModalRef}
      className="absolute right-4 mt-2 w-56 bg-white shadow-lg rounded-xl z-50 overflow-hidden border"
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={Cookies.get("profileImg")}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">Welcome back</p>
            <p className="text-xs text-gray-500">You are logged in</p>
          </div>
        </div>
      </div>

      <div className="p-2 space-y-1">
        <button
          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition"
          onClick={handleClick}
        >
          <CgProfile className="size-5"/>
          My Profile
        </button>
        <button
          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition"
          onClick={()=>navigate("/userReservation")}
        >
          <FaRegBookmark className="size-5"/>
          My reservation
        </button>
        {role === "admin" && (
          <button
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition"
            onClick={() => {
              navigate("/dashboard");
              onClose();
            }}
          >
            <LuLayoutDashboard className="size-5"/>
            Dashboard
          </button>
        )}
        <button
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition"
            onClick={() => {
              navigate("/profile");
              onClose();
            }}
          >
            <RiTruckLine className="size-5"/>
            my vehicles
          </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
        >
          <FiLogOut className="size-5"/>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;
