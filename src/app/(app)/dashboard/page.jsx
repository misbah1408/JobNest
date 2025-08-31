"use client";

import CandidateDashboard from "@/components/CandidateDashboard";
import EmployerDashboard from "@/components/EmployerDashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Store user in state
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === "loading") return; // wait until session is resolved

    if (!session) {
      router.replace("/sign-in");
    } else {
      setUser(session.user); // store user in state
      // console.log("User:", session.user);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="h-dvh flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="h-dvh">
      <div className="h-full w-full">
        {user?.role === "job_seeker" ? (
          <CandidateDashboard />
        ) : (
          <EmployerDashboard />
        )}
      </div>
    </div>
  );
};

export default Page;
