import React, { useState } from "react";
import Cookies from "js-cookie";
import ReadOnlyStars from "./ReadOnlyStars";
import { useEffect } from "react";
import { toast } from "react-toastify";

const StarRating = ({ vehicleId, userId }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("authToken");

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    setSubmitted(false);
  };

  useEffect(() => {
    const fetchUserReview = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/v1/reviews?user=${userId}&vehicle=${vehicleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.data.length > 0) {
          setHasReview(true);
          setSelectedRating(data.data[0].ratings);
        }
      } catch (error) {
        console.log("error get review: " + error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserReview();
  }, [vehicleId, userId, token]);

  const handleSubmit = async () => {
     if(!token || token==""){
      toast.error("You are not logged in. Please log in 😑")
      return;
     }
    if (selectedRating > 0) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/reviews`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ratings: selectedRating,
              vehicle: vehicleId,
              user: userId,
            }),
          }
        );
        if (!res.ok) throw new Error("Failed to submit review");
        setHasReview(true);
        setSubmitted(true);
        toast.success("Your rating has been submitted 🫡.")
      } catch (error) {
        console.error("Error submitting review:", error.message);
      }
    } else {
      alert("Please select a rating before submitting.");
    }
  };

  const renderStars = () => {
    const starPath =
      "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95 4.146.018c.958.004 1.355 1.226.584 1.818l-3.36 2.455 1.287 3.951c.3.922-.756 1.688-1.541 1.125L10 13.011l-3.353 2.333c-.785.563-1.841-.203-1.541-1.125l1.287-3.951-3.36-2.455c-.77-.592-.374-1.814.584-1.818l4.146-.018 1.286-3.95z";

    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        onClick={() => handleRatingClick(i + 1)}
        className={`w-8 h-8 cursor-pointer transition-colors ${
          i < selectedRating
            ? "text-yellow-400"
            : "text-gray-400 hover:text-yellow-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d={starPath} />
      </svg>
    ));
  };
  return (
    <div className="p-6 rounded-xl border shadow-lg bg-white">
      <div className="flex flex-col items-center">
        {hasReview ? (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Your Feedback
            </h3>
            <ReadOnlyStars rating={selectedRating} />
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Hello Geek, Provide your Feedback
            </h3>
            <div className="flex space-x-2 mb-4">{renderStars()}</div>

            <div className="text-lg text-gray-700 mb-4">
              Rating: {selectedRating} {selectedRating === 1 ? "star" : "stars"}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitted}
              className={`px-4 py-2 rounded-[2px] transition text-white ${
                submitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Rating"}
            </button>

            {submitted && (
              <div className="mt-4 text-green-600 text-lg font-bold">
                Thank you! You rated: <span>{selectedRating}</span> star
                {selectedRating > 1 ? "s" : ""}.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StarRating;
