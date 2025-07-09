"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/sign-in");
    }
  }, [session]);
  return (
    <div className="h-dvh">
      <div
        style={{
          background: `
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='10' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='table' tableValues='0 0'/%3E%3CfeFuncG type='table' tableValues='0 0'/%3E%3CfeFuncB type='table' tableValues='0 0'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E"),
                radial-gradient(circle at 84.593% 18.1395%, #6299f2 0%, transparent 80%),
                #053268 radial-gradient(circle at 100% 96.7442%, #5746d9 0%, transparent 80%)
              `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="h-full w-full"
      ></div>
    </div>
  );
};

export default Page;
