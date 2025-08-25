"use client";

import PostedJobs from "@/components/JobPosts";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const EmployerDashboard = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [allJobs, setAllJobs] = useState([]);   // store everything
  const [visibleJobs, setVisibleJobs] = useState([]); // jobs shown on UI
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const PAGE_SIZE = 10; // how many jobs to show at a time

  // ✅ Fetch all jobs once
  const fetchJobs = async () => {
    if (!user?._id) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({ postedBy: user._id });
      const res = await axios.get(`/api/create-job?${params.toString()}`);
      const data = res.data;
      console.log(data);
      
      if (data.success) {
        setAllJobs(data.jobs || []);
        setVisibleJobs(data.jobs.slice(0, PAGE_SIZE)); // load first page
        setPage(1);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchJobs();
      console.log(visibleJobs);
    }
  }, [user?._id]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      
      if (entries[0].isIntersecting) {
        const nextPage = page + 1;
        const nextJobs = allJobs.slice(0, nextPage * PAGE_SIZE);

        if (nextJobs.length > visibleJobs.length) {
          setVisibleJobs(nextJobs);
          setPage(nextPage);
        }
      }
    });

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [allJobs, visibleJobs, page]);

  // ✅ calculate applicants dynamically
  const totalApplicants = allJobs.reduce(
    (acc, job) => acc + (job.applicants?.length || 0),
    0
  );

  return (
    <div className="w-full mt-[90px] p-6 flex flex-col items-center">
      <div className="w-[95%] py-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Job Management</h1>
          <span className="text-gray-600">Manage your job listings</span>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <span className="font-semibold">{totalApplicants}</span> Applicants
        </div>
      </div>

      <div className="w-[95%]">
        <PostedJobs jobs={visibleJobs} onSuccess={fetchJobs} />
      </div>

      {visibleJobs.length < allJobs.length && (
        <div ref={observerRef} className="h-10" />
      )}
      {loading && <p className="text-gray-500 mt-4">Loading...</p>}
      {!loading && visibleJobs.length >= allJobs.length && (
        <p className="text-gray-500 mt-4">No more jobs</p>
      )}
    </div>
  );
};

export default EmployerDashboard;
