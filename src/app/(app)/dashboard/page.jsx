"use client";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
  const [searchdata, setSearchData] = useState([]);
  const [input, setInput] = useState();
  const [filterSearch, setfilterSearch] = useState([]);
  const fetchData = async () => {
    const response = await axios.get("/api/create-job");
    console.log(response.data.jobs);
    setSearchData(response.data.jobs);
  };
  const handleChange = (value) => {
    setInput(value);
    if (!value) {
      setfilterSearch() 
      return
    };

    const filteredData = searchdata.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );

    setfilterSearch(filteredData);
    console.log(value);
    console.log(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="relative w-full max-w-xl mx-auto mt-8">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 ">
          <Search className="text-gray-400" />
          <Input
            type="text"
            className="w-full border-none focus:outline-none focus:ring-0"
            placeholder="Search jobs..."
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>

        {filterSearch?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {filterSearch.map((item) => (
              <div
                key={item._id}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {item.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
