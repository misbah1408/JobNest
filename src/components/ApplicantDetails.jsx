import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardTitle } from "./ui/card";
import {
  AlertCircle,
  CheckCircle,
  DownloadIcon,
  FileTextIcon,
  MessageSquare,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

const ApplicantDetails = ({ applicant, candidate, onSuccess }) => {
//   console.log(applicant);
  function getColor() {
    let status = applicant.status;
    if (status == "pending") return "yellow";
    if (status == "reviewed") return "blue";
    if (status == "accepted") return "green";
    return "red";
  }
  const { resumeAnalysis, matchScore, coverLetter } = applicant || {};

  const changeStatus = async(status) => {
    if(status === applicant?.status) return;
    try {
        const res = await axios.patch(`/api/applications/applicants/update/${applicant?._id}`, {status})
        // console.log(res);
        if(res.status == 200){
            await onSuccess();
            toast.success("Application status updated to "+ status)
        }
    } catch (error) {
        toast.error(error)
    }
  }
  return (
    <Card className="w-full shadow-md p-4 md:p-6 mb-5 dark:bg-transparent">
      <Tabs defaultValue="analysis" className="max-w-full">
        <TabsList className="grid w-fit grid-cols-2 md:grid-cols-2 h-full bg-gray-900">
          <TabsTrigger value="analysis" className="text-sm md:text-base">
            Resume Analysis
          </TabsTrigger>
          <TabsTrigger value="actions" className="text-sm md:text-base">
            Actions
          </TabsTrigger>
          {/* <TabsTrigger value="projects" className="text-sm md:text-base">
            Projects
          </TabsTrigger>
          <TabsTrigger value="work" className="text-sm md:text-base">
            Work Experience
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="analysis" className="mt-4 space-y-10 px-8 w-full">
          <div>
            <CardTitle>Resume Match Analysis</CardTitle>
            <CardDescription>
              AI-powered analysis of how the candidate matches job requirements
            </CardDescription>
          </div>

          <div>
            <h2 className="text-lg">Applicant Summary</h2>
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="whitespace-pre-line">{resumeAnalysis?.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
                <CheckCircle size={24} color="green" /> Matching Skills
              </h3>
              <div className="border rounded-lg p-4">
                <div className="flex flex-wrap gap-1">
                  {resumeAnalysis?.matchingSkills?.map((skill) => (
                    <Badge
                      variant={"outline"}
                      key={skill}
                      className={"bg-green-500/10"}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
                <AlertCircle size={24} color="orange" /> Missing Skills
              </h3>
              <div className="border rounded-lg p-4">
                <div className="flex flex-wrap gap-1">
                  {resumeAnalysis?.missingSkills?.map((skill) => (
                    <Badge
                      variant={"outline"}
                      key={skill}
                      className={"bg-amber-500/10"}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Experience</h3>
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="whitespace-pre-line">
                  {resumeAnalysis?.experience}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Education</h3>
              <div className="border rounded-lg p-4">
                {resumeAnalysis?.education ? (
                  <p className="whitespace-pre-line">
                    {resumeAnalysis?.education}
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    No education data available
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">About</h3>
            <div className="border rounded-lg p-4 bg-muted/30">
              {resumeAnalysis?.about ? (
                Object.keys(resumeAnalysis.about).map((key) => (
                  <p className="whitespace-pre-line" key={key}>
                    <strong>
                      {key[0].toUpperCase() + key.slice(1, key.length)}:
                    </strong>{" "}
                    {resumeAnalysis.about[key]}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground">No About data available</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Cover Letter</h3>
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="whitespace-pre-line">{coverLetter}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="actions" className="mt-4 space-y-10 px-8">
          {/* Main container with dark background */}
          <div className="text-gray-300 rounded-lg w-full shadow-lg">
            {/* Header Section */}
            <div className="mb-6">
              <CardTitle>Application Actions</CardTitle>
              <CardDescription>
                Manage the status of this job application
              </CardDescription>
            </div>

            {/* Update Status Section */}
            <div>
              <h2 className="text-lg font-medium mb-2">Update Status</h2>
              <div className="flex items-center mb-4">
                <span className="mr-2">Current status:</span>
                <Badge
                  className={`ml-2 bg-${getColor()}-500/20 text-${getColor()}-500 border border-${getColor()}-500`}
                >
                  {applicant?.status[0].toUpperCase() +
                    applicant?.status?.slice(1, applicant?.status.length)}
                </Badge>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={"secondary"}
                  className={`${applicant.status == "pending" && "text-muted-foreground"}`}
                  onClick={()=>changeStatus("pending")}
                >
                  Mark as Pending
                </Button>
                <Button
                  variant={"secondary"}
                  className={`${applicant.status == "reviewed" && "text-muted-foreground"}`}
                  onClick={()=>changeStatus("reviewed")}
                >
                  Mark as Reviewed
                </Button>
                <Button
                  className={`${applicant.status == "accepted" && "text-muted-foreground"}`}
                  onClick={()=>changeStatus("accepted")}
                >
                  Accept Application
                </Button>
                <Button
                  variant={""}
                  className={`${applicant.status == "rejected" && "text-muted-foreground"} border-destructive/20 text-destructive hover:bg-destructive/10 bg-transparent border`}
                  onClick={()=>changeStatus("rejected")}
                >
                  Reject Application
                </Button>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-700 my-8" />

            {/* Download Resume Section */}
            <div>
              <h2 className="text-lg font-medium mb-2">Download Resume</h2>
              <p className="text-muted-foreground mb-4">
                Download the candidate's resume
              </p>
              <Button className="">
                <FileTextIcon />
                <Link href={applicant?.resumeUrl} target="_blank">
                    Download Resume
                </Link>
              </Button>
            </div>

            {/* Divider */}
            <hr className="border-gray-700 my-8" />

            {/* View Interview Section */}
            <div>
              <h2 className="text-lg font-medium mb-2">View Full Interview</h2>
              <p className="text-muted-foreground mb-4">
                View the complete interview transcript
              </p>
              <Button className="bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-2 px-4 border border-gray-600 rounded-md flex items-center transition duration-300 gap-3" onClick={()=>toast.info("This feature will be available soon.")}>
                <MessageSquare />
                View Interview Transcript
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ApplicantDetails;
