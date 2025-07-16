"use client";

import PostedJobs from "@/components/JobPosts";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const EmployerDashboard = () => {
  const [data, setData] = useState([]);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(()=>{
    if(user){
      fetchApplications();
    }else{
      toast.error("Error while fetcing details")
    }
    
  },[user?._id])

  const fetchApplications = async () => {
    const userId = user?._id;
    console.log(userId);
    
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
  

  return (
    <div className="w-full mt-[90px] p-6 flex flex-col items-center">
      {/* <h2 className="text-2xl font-semibold mb-6">Employer Dashboard</h2> */}
      <div>

      </div>
      <div className="w-[95%]">
          <PostedJobs jobs={data} />
      </div>
    </div>
  );
};

export default EmployerDashboard;
