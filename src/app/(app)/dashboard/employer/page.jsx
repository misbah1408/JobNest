"use client";

import PostedJobs from "@/components/JobPosts";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const EmployerDashboard = () => {
  const [data, setData] = useState([]);
  const { data: session } = useSession();
  const user = session?.user;
  const fetchApplications = async () => {
    const userId = user?._id;
    const response = await axios.get(`/api/create-job/?postedBy=${userId}`);
    // console.log(response?.data?.jobs.reverse());
    setData(response?.data?.jobs.reverse());
    
    totalApplicants(response?.data?.jobs);
  };

  const totalApplicants = (data) => {
    let count = 0;
    data.map((element) => {
      console.log(element);
      
      count += element.applications
    });
    
    return count;
  }
  
  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="w-[80%] m-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Employer Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-green-200 p-4 rounded-xl shadow-md">
          <p className="text-sm text-gray-600">Total Jobs Posted</p>
          <h3 className="text-3xl font-bold text-green-800 mt-2">{data.length}</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-blue-200 p-4 rounded-xl shadow-md">
          <p className="text-sm text-gray-600">Total Applications</p>
          <h3 className="text-3xl font-bold text-blue-800 mt-2">{totalApplicants(data)}</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-purple-200 p-4 rounded-xl shadow-md">
          <p className="text-sm text-gray-600">Accepted Hires</p>
          <h3 className="text-3xl font-bold text-purple-800 mt-2">5</h3>
        </div>

        {/* Card 4 */}
        <div className="bg-yellow-200 p-4 rounded-xl shadow-md">
          <p className="text-sm text-gray-600">Pending Applications</p>
          <h3 className="text-3xl font-bold text-yellow-800 mt-2">10</h3>
        </div>
      </div>
      <div className="w-3/4 m-auto">
          <PostedJobs jobs={data} />
      </div>
    </div>
  );
};

export default EmployerDashboard;
