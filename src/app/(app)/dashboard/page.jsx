"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const {data: session} = useSession();
  const router = useRouter();
  
  useEffect(()=>{
    if(!session){
      router.replace("/sign-in")
    }
  },[session])
  return (
    <div>
      
    </div>
  );
};

export default Page;
