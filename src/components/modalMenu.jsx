import React from "react";
import { Link } from "react-router-dom";
import { X, Home, Info, Mail } from "lucide-react"; // You can use react-icons if preferred
function ModalMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end sm:hidden">
      <div className="bg-white w-64 h-full shadow-lg p-6 space-y-6 transform transition-transform duration-300 translate-x-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
        >
          <X />
        </button>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-800 text-center mt-10">Navigation</h3>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-5">
          <Link
            to="/"
            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium transition"
            onClick={onClose}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>

          <Link
            to="/about-us"
            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium transition"
            onClick={onClose}
          >
            <Info size={20} />
            <span>About Us</span>
          </Link>

          <Link
            to="/contact"
            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 font-medium transition"
            onClick={onClose}
          >
            <Mail size={20} />
            <span>Contact</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default ModalMenu;
