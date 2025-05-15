import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CiSearch } from "react-icons/ci";
import Data from "@/Shared/Data";

function Search({ setVehicles, onClose }) {
  const [condition, setCondition] = useState("");
  const [mark, setMark] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [fetchedMarks, setFetchedMarks] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/marks`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch marks");
        }
        const data = await response.json();
        const formatted = data.data.map((mark) => ({
          id: mark._id,
          name: mark.name,
        }));
        setFetchedMarks(formatted);
      } catch (error) {
        console.error("Error fetching marks:", error);
      }
    };
    fetchMarks();
  }, []);

  const searchData = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (condition) queryParams.append("condition", condition);
      if (mark) queryParams.append("mark", mark);
      if (maxPrice) {
        queryParams.append("maxPrice", maxPrice);
        queryParams.append("minPrice", 0);
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/vehicles/?${queryParams.toString()}`
      );
     
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      const data = await response.json();
      setVehicles(data);
      onClose();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    searchData();
  };

  return (
    <div className="p-2 bg-white md:p-4 rounded-md md:rounded-full flex-col md:flex md:flex-row gap-10 px-5 items-center w-[60%] ">
      <Select onValueChange={setCondition}>
        <SelectTrigger className=" outline-none md:border-none w-full shadow-none">
          <SelectValue placeholder="Vehicle" />
        </SelectTrigger>
        <SelectContent className="bg-white select-content">
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="used">Used</SelectItem>
        </SelectContent>
      </Select>

      <Separator
        orientation="vertical"
        className="bg-gray-400 hidden md:block"
      />

      <Select onValueChange={setMark}>
        <SelectTrigger className=" outline-none md:border-none w-full shadow-none">
          <SelectValue placeholder="Manufacturers" />
        </SelectTrigger>
        <SelectContent className="bg-white select-content">
          {fetchedMarks.map((mark, index) => (
            <SelectItem key={index} value={mark.id}>
              {mark.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator
        orientation="vertical"
        className="bg-gray-400 hidden md:block"
      />

      <Select onValueChange={setMaxPrice}>
        <SelectTrigger className=" outline-none md:border-none w-full shadow-none">
          <SelectValue placeholder="Pricing" />
        </SelectTrigger>
        <SelectContent className="bg-white select-content">
          {Data.Pricing.map((price, index) => (
            <SelectItem key={index} value={price.amount}>
              {price.amount}<span className='text-[8px] font-bold'>DH</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>
        <CiSearch
          className="text-[50px] bg-primary rounded-full p-3 text-white hover:scale-105 transition-all cursor-pointer"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
}

export default Search;
