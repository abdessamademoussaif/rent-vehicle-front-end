import Search from "./Search";
import { useEffect, useRef } from "react";
const SearchModal = ({ setIsSearchOpen, onClose , setVehicles}) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);


  const handleClickOutside = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleClickOutside}
      tabIndex="-1"
      
      className="overflow-y-auto overflow-x-hidden fixed md:inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 transition-opacity duration-300"
    >
      <div className="relative mx-4 p-4 w-full max-w-[700px] max-h-full">
        <div className="relative bg-white rounded-full shadow-sm dark:bg-gray-700 transition-all duration-300 ease-out transform scale-95 hover:scale-100">
          <div className="p-4 md:p-5 relative">
            <Search setVehicles={setVehicles} onClose={onClose}/>
            <div className="absolute top-[50px] right-10">
              <div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
