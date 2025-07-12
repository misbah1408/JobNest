"use client";

import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Nav from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { bgGrad } from "@/lib/utils";
import { ArrowRight, Play } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <div className="relative z-50">
        <Nav />
      </div>
      <section className="h-dvh flex justify-center items-center">
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
          className="h-full w-full flex justify-center items-center px-[20px] md:px-[170px]"
        >
          <div>
            <p className="text-white text-[35px] md:text-[50px] font-bold">
              Your dream job starts with the right preparation — let JobNest
              guide your way.
            </p>
            <p className="text-white text-xl md:max-w-1/2 mt-5 ">
              JobNest is your all-in-one career companion — whether you're
              searching for jobs, applying with ease, or preparing with
              AI-powered mock interviews. Designed for both job seekers and
              employers, JobNest streamlines hiring and interview readiness in
              one modern platform.
            </p>
            <div className="mt-5 flex gap-3 items-center">
              <Link href={session ? "/dashboard" : "/sign-in"}>
                <Button
                  className={
                    "rounded-full p-6 px-8 text-sm bg-[#3a49cc] hover:bg-[#3a42c2] cursor-pointer"
                  }
                >
                  Get started <ArrowRight />
                </Button>
              </Link>
              <Button
                className={
                  "rounded-full p-6 px-8 text-sm bg-white text-black hover:bg-gray-200 cursor-pointer hover:text-blue-500"
                }
              >
                <Play />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="md:px-[120px] py-5 px-10" id="features">
        <Features />
      </section>
      <section className="md:px-[120px] py-5 px-10" id="how-it-works">
        <HowItWorks />
      </section>
      <section className="relative overflow-hidden">
        <div className="relative z-10 w-full px-6 text-center">
          <div className="space-y-8 bg-[#3a49cc] p-6 rounded-xl">
            <br />
            <h2 className="text-5xl font-bold text-white">
              Ready to revolutionize your hiring?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Join thousands of forward-thinking companies and talented
              professionals experiencing the future of recruitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className={"rounded-full p-7 text-black bg-white hover:bg-white"}>
                  Get Started
                </Button>
              </Link>
            </div>
            <p className="text-white/60 text-sm">
              No credit card required • Setup in 5 minutes
            </p>
          </div>
        </div>
      </section>
      <br />
      <footer
        className="py-10 relative bgGrad text-white  grid place-items-center "
        style={bgGrad}
      >
        <Link href={"/dashboard"}>
          <Image src={"/logo.png"} alt="logo" width={81} height={81} />
        </Link>
        <div className="relative max-w-7xl mt-5 mx-auto px-6">
          <p>
            © 2025 JobNest. All rights reserved. Build by
            <Link
              target="_blank"
              className="hover:underline"
              href="https://misbah-portfolio-nine.vercel.app"
            >
              Mohammed Misba
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
