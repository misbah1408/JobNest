"use client";

import JobCard from "@/components/JobCard";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [data, setData] = useState([]);
  const fetchApplications = async () => {
    const response = await axios.get("/api/create-job");
    // console.log(response.data?.jobs[0]);
    setData(response?.data?.jobs.reverse());
  };
  useEffect(() => {
    fetchApplications();
  }, []);
  return (
    <div>
      <div>{data?.map(job => 
        <JobCard key={job._id} job={job} />)}</div>
    </div>
  );
};

export default page;
