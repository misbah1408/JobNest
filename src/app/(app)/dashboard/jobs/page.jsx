"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { LucideLoaderCircle, Search } from "lucide-react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [cache, setCache] = useState({});
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  // Fetch jobs on mount

  const fetchJobs = useCallback(
    async (reset = false) => {
      if (loading || (!hasNextPage && !reset)) return;

      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "5",
          location: locationFilter,
          active: statusFilter === "active" ? "true" : "",
          search: debouncedQuery,
        });

        const res = await axios.get(`/api/create-job?${params.toString()}`);
        const data = res.data;

        if (data.success) {
          setJobs((prev) => (reset ? data.jobs : [...prev, ...data.jobs]));
          setHasNextPage(data.pagination.hasNext);
          setPage(currentPage + 1);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasNextPage, page, locationFilter, statusFilter, debouncedQuery]
  );

  useEffect(() => {
    // Reset pagination and refetch jobs
    setPage(1);
    setHasNextPage(true);
    setJobs([]); // clear current jobs
    fetchJobs(true); // fetch page 1 again
  }, [debouncedQuery, locationFilter, statusFilter]);

  useEffect(() => {
    // console.log("Observer running, loading:", loading, "hasNext:", hasNextPage);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // console.log("Reached bottom — fetching more...");
        fetchJobs();
      }
    });

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchJobs]);

  // Debounce the query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Filter and cache results
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (debouncedQuery) {
      if (cache[debouncedQuery]) {
        result = cache[debouncedQuery];
      } else {
        result = jobs.filter((job) =>
          job?.jobTitle?.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setCache((prev) => ({ ...prev, [debouncedQuery]: result }));
      }
    }

    // Apply location filter
    if (locationFilter) {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((job) =>
        statusFilter === "active" ? job.jobStatus : !job.jobStatus
      );
    }

    return result;
  }, [debouncedQuery, locationFilter, statusFilter, jobs, cache]);

  return (
    <div>
      <div className="relative w-full mt-8 pt-[90px] flex justify-center px-4">
        <div className="w-full max-w-2xl border dark:border-gray-700 rounded-full overflow-hidden">
          <div className="flex flex-row">
            {/* Search Input */}
            <div className="flex items-center gap-2 flex-1 bg-white dark:bg-black px-4 py-4 shadow-sm">
              <Search className="text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search job titles..."
                className="w-full focus:outline-none focus:ring-0 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              />
            </div>

            {/* Location Filter */}
            <select
              className="flex-1 md:max-w-[200px] max-w-[110px] px-4 py-2 bg-white dark:bg-black md:text-sm text-[10px] text-gray-700 dark:text-gray-300 focus:outline-none"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {[...new Set(jobs.map((job) => job.location))].map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="flex-1 md:max-w-[200px] max-w-[110px] md:text-sm text-[10px] px-4 py-2 rounded-r-full bg-white dark:bg-black text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Not Active</option>
            </select>
          </div>
        </div>
        {isFocused && debouncedQuery && cache[debouncedQuery]?.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 px-2">
            No matching jobs found. Showing all jobs.
          </p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {(debouncedQuery || locationFilter || statusFilter
          ? filteredJobs
          : jobs
        ).map((job) => (
          <JobCard key={job?._id} job={job} />
        ))}
      </div>

      {loading && (
        <div className="h-fit max-w-2xl m-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="animate-pulse space-y-4 p-6">
            {/* Large stacked boxes */}
            <div className="h-7 w-[250px] bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="h-5 w-3xs bg-gray-200 dark:bg-gray-700 rounded-md" />

            {/* Horizontal box row */}
            <div className="flex space-x-2 mt-6 justify-between">
              <div className="h-full w-[300px] flex gap-2">
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-md" />
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-md" />
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-md" />
              </div>
              <div className="h-full w-[200px] flex gap-2">
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-md" />
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasNextPage && !loading && (
        <p className="text-center text-gray-500">No more jobs to load.</p>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default Page;
