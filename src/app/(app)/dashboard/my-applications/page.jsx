'use client';

import ApplicationCard from '@/components/ApplicationCard';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [data, setData] = useState([]);
  const fetchApplications = async() => {
    const response = await axios.get("/api/applications")
    // console.log(response);
    setData(response?.data?.data.reverse())
  }
  useEffect(()=>{
    fetchApplications();
  },[])
  return (
    <div>
      <div>{data.map(application => <ApplicationCard key={application._id} application={application}/>)
      }
      </div>
    </div>
  )
}

export default page