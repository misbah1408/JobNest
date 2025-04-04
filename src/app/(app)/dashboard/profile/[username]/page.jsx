'use client';

import ProfileCard from '@/components/ProfileCard';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const page = () => {
  const params = useParams(); 
  const [userdata, setUserData] = useState({}); 
  const router = useRouter();
  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/get-profile/${params.username}`);
      // console.log(response.data);
      
      if(response.status == 200){
        setUserData(response.data)
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Something went wrong';
      toast.error(`${errorMessage}`);
      router.replace(`/dashboard`)
      return null;
    }
  };

  useEffect(()=>{
    fetchUser();
  },[])
  return (
    <div className='w-full h-full flex justify-center mt-2'>
      {userdata && <ProfileCard data={userdata}/>}
    </div>
  )
}

export default page
