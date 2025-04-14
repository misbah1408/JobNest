"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Page = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [cache, setCache] = useState({});
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/create-job");
        setJobs(res?.data?.jobs?.reverse() || []);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };
    fetchJobs();
  }, []);

  // Debounce the query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Filter and cache results
  const filteredJobs = useMemo(() => {
    if (!debouncedQuery) return jobs;

    if (cache[debouncedQuery]) {
      return cache[debouncedQuery].length > 0
        ? cache[debouncedQuery]
        : jobs;
    }

    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    setCache((prev) => ({ ...prev, [debouncedQuery]: filtered }));

    return filtered.length > 0 ? filtered : jobs;
  }, [debouncedQuery, jobs, cache]);

  return (
    <div>
      <div className="relative w-full max-w-xl mx-auto mt-8">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2">
          <Search className="text-gray-400" />
          <Input
            type="text"
            placeholder="Search jobs..."
            className="w-full border-none focus:outline-none focus:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
        </div>

        {isFocused && debouncedQuery && filteredJobs.length > 0 && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
    {filteredJobs.map((job) => (
      <div
        key={job._id}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
        onClick={() => setQuery(job.title)}
      >
        {job.title}
      </div>
    ))}
  </div>
)}

{isFocused &&
  debouncedQuery &&
  cache[debouncedQuery]?.length === 0 && (
    <p className="text-sm text-gray-500 px-4 mt-2">
      No matching jobs found. Showing all jobs.
    </p>
)}

      </div>

      <div className="mt-6 space-y-4">
        {filteredJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Page;
