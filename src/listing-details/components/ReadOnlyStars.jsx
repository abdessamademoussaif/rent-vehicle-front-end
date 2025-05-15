import React from "react";

const ReadOnlyStars = ({ rating = 0 }) => {
  const starPath =
    "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95 4.146.018c.958.004 1.355 1.226.584 1.818l-3.36 2.455 1.287 3.951c.3.922-.756 1.688-1.541 1.125L10 13.011l-3.353 2.333c-.785.563-1.841-.203-1.541-1.125l1.287-3.951-3.36-2.455c-.77-.592-.374-1.814.584-1.818l4.146-.018 1.286-3.95z";

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-6 h-6 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d={starPath} />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)} / 5</span>
    </div>
  );
};

export default ReadOnlyStars;
