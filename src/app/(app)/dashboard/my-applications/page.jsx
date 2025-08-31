"use client";

import ApplicationCard from "@/components/ApplicationCard";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [data, setData] = useState([]);
  const fetchApplications = async () => {
    const response = await axios.get("/api/applications");
    // console.log(response);
    setData(response?.data?.data.reverse());
  };
  useEffect(() => {
    fetchApplications();
  }, []);
  return (
    <div className="w-full mt-[100px] flex items-center flex-col">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage all your job applications
        </p>
      </div>
      <div className="w-[80%]">
        <ApplicationCard data={data} />
      </div>
    </div>
  );
};

export default page;
