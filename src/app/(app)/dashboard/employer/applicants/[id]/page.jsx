"use client";

import ApplicantDetails from "@/components/ApplicantDetails";
import ResumeViewer from "@/components/ResumeViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { formatDate } from "date-fns";
import {
  Award,
  ExternalLink,
  FileCheck,
  FileText,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [applicant, setApplicant] = useState();
  const [jobDetails, setJobDetails] = useState();
  const [user, setUser] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  // console.log(id);

  const fetchApplicantDetails = async () => {
    try {
      const res = await axios.get("/api/applications/applicants/update/" + id);
      // console.log(res.data);
      setApplicant(res?.data?.application);
      setJobDetails(res?.data?.jobDetails);
      setUser(res?.data?.user);
      // toast.success("Applicant Details fetched!");
    } catch (error) {
      // console.log(error);
      toast.error(error);
    }
  };
  function getColor(){
    let status = applicant.status;
    if(status == "pending") return "yellow";
    if(status == "reviewed") return "blue";
    if(status == "accepted") return "green";
    return "red";
  }
  useEffect(() => {
    fetchApplicantDetails();
  }, []);

  if (!applicant || !jobDetails) {
    return (
      <div className="text-center mt-[100px] flex justify-center animate-spin">
        <Loader2 size={64} />
      </div>
    );
  }
  return (
    <div className="w-full h-full mt-[100px] flex items-center flex-col">
      <div className="w-[80%] space-y-3">
        <div className="py-3">
          <h2 className="md:text-3xl text-xl font-bold">Job Application Details</h2>
          <p className="md:text-xl text-sm font-semibold">
            Detailed information for application submitted on{" "}
            {formatDate(new Date(applicant?.appliedAt), "MMMM dd, y")}
          </p>
        </div>
        <div className="w-full border-2 px-10 py-5 rounded-2xl h-full space-y-6">
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">{jobDetails?.jobTitle}</p>
              <p>{jobDetails?.companyName}</p>
            </div>
            <Badge className={`bg-${getColor()}-500/20 text-${getColor()}-500 text-lg py-2 px-4`}>
              {applicant?.status[0].toUpperCase()+applicant?.status?.slice(1,applicant?.status.length)}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {/* Resume */}
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span className="text-muted-foreground mr-2">Resume:</span>
                <span className="font-medium"></span>
                <div onClick={() => setIsOpen(true)}>
                  <ResumeViewer
                    name={user?.name}
                    resumeUrl={applicant?.resumeUrl}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    text={"View Resume"}
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-muted-foreground mr-2">
                  Preferred Language:
                </span>
                <span className="font-medium">en</span>
              </div>

              {/* Submitted Date */}
              <div className="flex items-center">
                <FileCheck className="h-4 w-4 mr-2" />
                <span className="text-muted-foreground mr-2">Submitted:</span>
                <span className="font-medium">
                  {formatDate(new Date(applicant?.appliedAt), "MMMM dd, y")}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Award />
                  <span className="text-muted-foreground mr-2">
                    Match Score:
                  </span>
                </div>
                <Badge
                  className={
                    applicant.matchScore > 40
                      ? applicant.matchScore > 75
                        ? "bg-green-200 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                      : "bg-red-200 text-red-500"
                  }
                >
                  {applicant.matchScore}%{" "}
                </Badge>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  applicant?.matchScore > 75
                    ? "bg-green-200"
                    : applicant?.matchScore > 40
                      ? "bg-yellow-100"
                      : "bg-red-100"
                }`}
              >
                <div
                  className={`h-full ${
                    applicant?.matchScore > 40
                      ? applicant?.matchScore > 75
                        ? "bg-green-500 "
                        : "bg-yellow-400 "
                      : "bg-red-500 "
                  }`}
                  style={{ width: applicant?.matchScore+"%" }}
                ></div>
              </div>
              <div className="md:text-md text-sm text-muted-foreground text-right">
                Analyzed on 
                {formatDate(new Date(applicant?.appliedAt), "MMMM dd, y")}
              </div>
            </div>
          </div>
        </div>
        <div>
          <ApplicantDetails applicant={applicant} candidate={user} onSuccess={fetchApplicantDetails}/>
        </div>
      </div>
    </div>
  );
};

export default page;
