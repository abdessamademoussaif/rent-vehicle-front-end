import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import { useEffect, useRef } from "react";
import LogButton from "./LogButton";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import SearchModal from "./searchModal";
import ProfileModal from "./ProfileModal";
import NotificationDropdown from "./NotificationDropDown";

import ModalMenu from "./modalMenu";
import { Menu } from "lucide-react";

function Header({ isAuthenticated, setIsAuthenticated, setVehicles  }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toHome = () => {
    navigate("/");
  }

  const profileModalRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target)
      ) {
        setShowProfileModal(false);
      }
    };

    if (showProfileModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileModal]);

  const switchToForgotPassword = () => {
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
    setShowProfileModal(false);
    toHome();
  };

  return (
    <div className=" flex justify-between items-center  w-full p-5 fixed top-0 left-0  z-50 bg-white shadow-md">
      <img src="/EASYTRANS.svg" width={150} height={100} />
      <ul className="hidden md:flex gap-16">
        <Link to={"/"}>
          <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">
            Home
          </li>
        </Link>
        {location.pathname != "/" ? (
          <li
            className="font-medium  transition-all  text-gray-400"
          >
            Search
          </li>
        ) : (
          <li
            className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary"
            onClick={() => setIsSearchOpen(true)}
          >
            Search
          </li>
        )}

        <li
          className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary"
          onClick={() => navigate("/about-us")}
        >
          About us
        </li>
        <li
          className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary"
          onClick={() => navigate("/contact")}
        >
          Contact us
        </li>
      </ul>

      <div>
        <div className="flex items-center gap-5 mr-6">
          <button
            className="sm:hidden text-gray-700 text-2xl "
            onClick={() => setIsModalOpen(true)}
          >
            <Menu />
          </button>
          {isAuthenticated ? (
            <>
              <button
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <IoIosNotificationsOutline className="size-7" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div>
                <img
                  src={Cookies.get("profileImg")}
                  className="w-[40px] h-[40px] rounded-full border shadow-sm cursor-pointer hover:scale-105 transition-all duration-200"
                  alt="profil img"
                  onClick={() => setShowProfileModal(true)}
                />
                <span className="border-2 border-solid border-white absolute top-[24px] right-[45px] h-3 w-3  rounded-full bg-green-500"></span>
              </div>
            </>
          ) : (
            <LogButton
              setIsAuthenticated={setIsAuthenticated}
              switchToForgotPassword={switchToForgotPassword}
              toHome={toHome}
            />
          )}
        </div>
        {showProfileModal && (
          <ProfileModal
            onClose={() => setShowProfileModal(false)}
            onLogout={handleLogout}
          />
        )}
      </div>

      {isSearchOpen && (
        <SearchModal
          setIsSearchOpen={setIsSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          setVehicles={setVehicles}
        />
      )}
      <NotificationDropdown
        isOpen={isDropdownOpen}
        onClose={() => setDropdownOpen(false)}
      />
      <ModalMenu isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Header;
