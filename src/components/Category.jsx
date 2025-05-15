import Data from "@/Shared/Data";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Category({setVehicles}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/categories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Category");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const search = async (searchTerm) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/vehicles?category=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Failed to search vehicles");
      }
      const data = await response.json();
      setVehicles(data);
    }catch (error) {
      console.error("Error fetching data:", error);
    }

  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
      <div className="mt-40">
        <h2 className="font-bold text-3xl text-center mb-6">Browse By Type</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-6 px-20">
          {categories.data.map((category, index) => (
            <div
              key={index}
              className="border rounded-xl p-3 items-center flex flex-col hover:shadow-md cursor-pointer"
              onClick={() => search(category._id)}
            >
              <img src={category.image} width={40} height={40} />
              <h2 className="mt-2">{category.name} </h2>
            </div>
          ))}
        </div>
      </div>
  );
}

export default Category;
