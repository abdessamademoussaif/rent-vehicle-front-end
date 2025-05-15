import React, { useRef } from "react";
import Header from "@/components/Header";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const ProfileSetting = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("authToken")
  );
  const [userData, setUserData] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/getMe`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = async (event) => {
    
    const token = Cookies.get("authToken");
    const file = event.target.files[0];
    if (!file) return;
     setIsLoading(true);
    const formData = new FormData();
    formData.append("profileImg", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/updateImgMe`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update image");
      }

      const updatedData = await response.json();
      setUserData(updatedData.data);
      Cookies.set("profileImg",updatedData.data.profileImg);
      toast.success("your profile image changed successfully");
    } catch (err) {
      toast.error("error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <aside className="hidden py-4 md:w-1/3 fix top-28 lg:w-1/4 md:block">
        <div className="sticky top-[80px] flex flex-col gap-2 p-4 text-sm border-r border-indigo-100">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>

          <a
            href="#"
            className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full"
          >
            Public Profile
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
          >
            Account Settings
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full"
          >
            Notifications
          </a>
        </div>
      </aside>

      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">
              Public Profile
            </h2>

            <div className="grid max-w-2xl mx-auto mt-8">
              <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                <img
                  className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300"
                  src={userData?.profileImg}
                  alt="Profile avatar"
                />

                <div className="flex flex-col space-y-5 sm:ml-8">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-xl border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200"
                  >
                    {isLoading ? "Loading..." : "Change picture"}
                  </button>

                  <button
                    type="button"
                    className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-xl border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200"
                  >
                    Delete picture
                  </button>
                </div>
              </div>

              <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Your name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="Your name"
                      defaultValue={userData?.name}
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="phone_number"
                      className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >
                      Your phone number
                    </label>
                    <input
                      type="number"
                      id="phone_number"
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="Your phone number"
                      defaultValue={userData?.phone}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2 sm:mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-100 border border-indigo-300 text-indigo-900 text-sm rounded-xl focus:ring-indigo-500 outline-none block w-full p-2.5"
                    placeholder="your.email@mail.com"
                    defaultValue={userData?.email}
                    readOnly
                    required
                  />
                </div>

                <div className="mb-2 sm:mb-6">
                  <label
                    htmlFor="role"
                    className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                  >
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    className="bg-gray-100 border border-indigo-300 text-indigo-900 text-sm rounded-xl focus:ring-indigo-500 outline-none block w-full p-2.5"
                    placeholder="your role"
                    readOnly
                    defaultValue={userData?.role}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                  >
                    Bio
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-xl border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Write your bio here..."
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetting;
