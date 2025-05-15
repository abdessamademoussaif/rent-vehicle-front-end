import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Cookies from "js-cookie";
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useState } from "react";

const team = [
  {
    name: "Abdessamade Moussaif",
    role: "Full Stack Engineer",
    image: "https://res.cloudinary.com/dsk3xnvyc/image/upload/v1746852320/users/zmgn0unmcbwdirf2wlvl.png",
    linkedin: "https://www.linkedin.com/in/abdessamade-moussaif-859079350/",
    github: "https://github.com/abdessamademoussaif",
  },
  {
    name: "Taoufiq Oughriss",
    role: "Frontend Developer",
    image: "https://media.licdn.com/dms/image/v2/D5603AQEoU_yKxHVq-w/profile-displayphoto-shrink_400_400/B56Zaw2rYjHUAk-/0/1746723846523?e=1752710400&v=beta&t=NmNHzT93jAbkWz7SE-6QVzQqeftuX2Kht72xWE8QNAM",
    linkedin: "https://www.linkedin.com/in/taoufiq-oughriss/",
    github: "#",
  },
  {
    name: "Salah Elddin Ait Talbe",
    role: "Backend Developer",
    image: "https://res.cloudinary.com/dsk3xnvyc/image/upload/v1747265484/WhatsApp_Image_2025-05-15_at_00.28.57_b1d71b0e_usann6.jpg",
    linkedin: "#",
    github: "#",
  },
];

const AboutUs = () => {
const [isAuthenticated, setIsAuthenticated] = useState(
        !!Cookies.get("authToken")
      );
  return (
    <>
    <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="bg-gray-50 mt-20 min-h-screen py-12 px-6">
        {/* Hero / Intro Section */}
        <section className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-800">
            About EasyTrans
          </h1>
          <p className="text-lg text-gray-600">
            EasyTrans is a modern platform built to revolutionize the transport
            and logistics industry. We focus on seamless booking, fleet
            management, and communication — all in one unified system.
          </p>
        </section>

        {/* Vision Statement */}
        <section className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto mb-16 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Developed by three passionate engineers — Abdessamade Moussaif,
            Taoufiq Oughriss, and Salah Elddin Ait Talbe — EasyTrans was born
            from a vision to simplify and innovate logistics processes using
            intuitive digital tools. This project reflects our dedication to
            tackling real-world transportation challenges through smart
            technology.
          </p>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow hover:shadow-md transition p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-500"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium">{member.role}</p>
                <div className="flex justify-center gap-4 mt-3 text-gray-600 text-lg">
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    <FaLinkedin className="hover:text-blue-700" />
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer">
                    <FaGithub className="hover:text-gray-800" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
