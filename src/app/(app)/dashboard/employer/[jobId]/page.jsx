"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Check, X, Star, ArrowRight } from "lucide-react";
import axios from "axios";
import ResumeViewer from "@/components/ResumeViewer";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "date-fns";
import Link from "next/link";

const page = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [topApplicantIds, setTopApplicantIds] = useState([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState();
  const [isOpen, setIsOpen] = useState();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`/api/applications/applicants/${jobId}`);
        setApplicants(res.data);
        // console.log(res.data);
        
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to load applicants");
      }
    };

    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/create-job/${jobId}`);

        // Access response data
        const data = response.data;
        // console.log(data.data);

        if (data.success) {
          setJobDetails(data.data);
          // console.log(data.data);
        } else {
          console.error("Job not found or other error:", data.message);
        }
      } catch (error) {
        console.error(
          "Error fetching job details:",
          error.response?.data?.message || error.message
        );
        return null;
      }
    };
    if (jobId) {
      fetchApplicants();
      fetchJobDetails();
    }
  }, [jobId]);

  const handleStatusChange = (appId, status) => {
    setApplicants((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, status } : app))
    );
  };

  const handleSave = async (appId, employerNotes, status) => {
    try {
      const payload = { employerNotes, status };
      await axios.patch(
        `/api/applications/applicants/update/${appId}`,
        payload
      );
      toast("Changes saved");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleAIShortlist = async () => {
    setIsLoading(true);
    toast("Running AI to shortlist top applicants...");

    try {
      const response = await axios.post("/api/ai/shortlist", {
        applicants: applicants.map((app) => ({
          applicationId: app._id,
          resumeUrl: app?.resumeUrl,
          coverLetter: app.coverLetter,
        })),
        jobDescription: jobDetails.jobDescription,
      });

      const ids = response.data.topApplicants
        .filter((item) => item.consider)
        .map((item) => item.applicationId);

      setTopApplicantIds(ids);
      setAiAnalysisResults(response.data.topApplicants);

      toast("Top applicants highlighted!");
    } catch (err) {
      console.error("AI Shortlisting Error:", err);
      toast.error("Failed to run AI shortlisting.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get AI analysis for a specific applicant
  const getApplicantAnalysis = (applicantId) => {
    return aiAnalysisResults.find(
      (result) => result.applicationId === applicantId
    );
  };

  return (
    <div className="px-4 py-10 mt-[90px] flex flex-col items-center w-full">
      <div className="mb-8 text-center">
        {/* <h1 className="text-3xl font-bold mb-2">Applicant AI Analyzer</h1> */}
        <p className="text-black mb-4 font-bold text-xl">
          Reviewing applicants for: {jobDetails?.jobTitle} at{" "}
          {jobDetails?.companyName}
        </p>
        {/* <Button
          className="bg-green-600 hover:bg-green-700 text-white font-medium"
          onClick={handleAIShortlist}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Analyze Applicants with AI"}
        </Button> */}
      </div>

      {applicants.length === 0 && (
        <p className="text-gray-500 text-center">No applicants yet.</p>
      )}

      <div className="w-[70%]">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Job Position</TableHead> */}
              <TableHead className={"text-center"}>Candidate</TableHead>
              <TableHead className={"text-center"}>Match Score</TableHead>
              {/* <TableHead>Interview Status</TableHead> */}
              <TableHead className={"text-center"}>Status</TableHead>
              <TableHead className={"text-center"}> Applied Date</TableHead>
              <TableHead className="text-center min-w-40">View</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant?._id}>
                <TableCell className={"text-center"}>
                  {applicant?.user?.name}
                </TableCell>
                <TableCell className={"text-center"}>
                  <Badge
                    className={
                      applicant.matchScore > 40
                        ? applicant.matchScore > 75
                          ? "bg-green-200 text-green-700"
                          : "bg-yellow-200 text-yellow-500"
                        : "bg-red-200 text-red-500"
                    }
                  >
                    {applicant.matchScore}%{" "}
                  </Badge>
                </TableCell>
                <TableCell className={"text-center"}>
                  <Badge
                    className={
                      applicant.status === "accepted"
                        ? "bg-green-200 text-green-700"
                        : applicant.status === "pending"
                          ? "bg-yellow-100 text-yellow-500"
                          : "bg-red-200 text-red-500"
                    }
                  >
                    {applicant.status}
                  </Badge>
                </TableCell>
                <TableCell className={"text-center"}>
                  {formatDate(new Date(applicant.appliedAt), "MMMM dd, y")}
                </TableCell>
                <TableCell className={"text-center"}>
                  <Link href={"/dashboard/employer/applicants/"+applicant?._id}>
                    <Button variant={"link"}>
                      View Details <ArrowRight />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
