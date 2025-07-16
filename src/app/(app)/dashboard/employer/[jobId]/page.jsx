"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Check, X, Star } from "lucide-react";
import axios from "axios";
import ResumeViewer from "@/components/ResumeViewer";
import { toast } from "sonner";

const ViewApplicantsPage = () => {
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
        console.log(data.data);
        
        if (data.success) {
          setJobDetails(data.data);
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
      await axios.patch(`/api/applications/applicants/update/${appId}`, payload);
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
        .filter(item => item.consider)
        .map(item => item.applicationId);
      
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
    return aiAnalysisResults.find(result => result.applicationId === applicantId);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl mt-[90px]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Applicant AI Analyzer</h1>
        <p className="text-gray-600 mb-4">
          Reviewing applicants for: <span className="font-medium">{jobDetails?.jobTitle} at {jobDetails?.companyName}</span>
        </p>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white font-medium"
          onClick={handleAIShortlist}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Analyze Applicants with AI"}
        </Button>
      </div>
  
      {applicants.length === 0 && (
        <p className="text-gray-500 text-center">No applicants yet.</p>
      )}
  
      <div className="space-y-6">
        {applicants.map((applicant) => {
          const analysis = getApplicantAnalysis(applicant._id);
          const isTopApplicant = topApplicantIds.includes(applicant._id);
  
          return (
            <Card
              key={applicant._id}
              className={`transition-all ${
                isTopApplicant ? "border-green-600 border-2 shadow-lg shadow-green-100" : ""
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isTopApplicant && (
                      <Star className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" />
                    )}
                    <div>
                      <p className="text-lg font-semibold">{applicant.user.name}</p>
                      <p className="text-sm text-muted-foreground">{applicant.user.email}</p>
                    </div>
                  </div>
                  <Badge
                    className={`p-2 ${
                      applicant.status === "accepted"
                        ? "bg-green-500 hover:bg-green-600 text-white border-transparent"
                        : ""
                    }`}
                    variant={
                      applicant.status === "accepted"
                        ? "default"
                        : applicant.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {applicant.status}
                  </Badge>
                </div>
  
                <Separator />
  
                <div>
                  <label className="block font-medium mb-1">Cover Letter</label>
                  <div className="border rounded-md p-3 text-sm bg-gray-50">
                    {applicant.coverLetter || "Not provided"}
                  </div>
                </div>
  
                <div>
                  <label className="block font-medium mb-1">Resume</label>
                  <div className="border rounded-md p-3 text-sm bg-gray-50" onClick={()=> setIsOpen(true)}>
                    {applicant.resumeUrl ? (
                      <ResumeViewer applicant={applicant} isOpen={isOpen} setIsOpen={setIsOpen}/>
                    ) : (
                      "No resume provided"
                    )}
                  </div>
                </div>
  
                {analysis && (
                  <div className={`mt-4 border p-4 rounded-md ${analysis.consider ? "bg-green-50" : "bg-gray-50"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">AI Analysis</h3>
                      <Badge
                        variant={analysis.consider ? "default" : "outline"}
                        className={`px-3 py-1 ${
                          analysis.consider ? "bg-green-500 hover:bg-green-600 text-white border-transparent" : ""
                        }`}
                      >
                        {analysis.consider ? (
                          <span className="flex items-center"><Check className="h-4 w-4 mr-1" /> Recommended</span>
                        ) : (
                          <span className="flex items-center"><X className="h-4 w-4 mr-1" /> Not Recommended</span>
                        )}
                      </Badge>
                    </div>
  
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="font-medium w-32">Match Score:</span>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${analysis.matchScore > 70 ? "bg-green-600" : "bg-yellow-400"}`}
                              style={{ width: `${analysis.matchScore}%` }}
                            ></div>
                          </div>
                          <div className="text-right text-sm mt-1">{analysis.matchScore}%</div>
                        </div>
                      </div>
  
                      <div>
                        <span className="font-medium">AI Assessment:</span>
                        <p className="mt-1 text-sm">{analysis.reason}</p>
                      </div>
  
                      <div>
                        <span className="font-medium">Key Matches:</span>
                        <ul className="mt-1 space-y-1">
                          {analysis.matchedSummary.map((item, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
  
                <div>
                  <label className="block font-medium mb-1">Notes</label>
                  <Textarea
                    value={applicant.employerNotes || ""}
                    onChange={(e) =>
                      setApplicants((prev) =>
                        prev.map((a) =>
                          a._id === applicant._id
                            ? { ...a, employerNotes: e.target.value }
                            : a
                        )
                      )
                    }
                    placeholder="Add your notes about this candidate..."
                  />
                </div>
  
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => handleStatusChange(applicant._id, "accepted")}
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => handleStatusChange(applicant._id, "rejected")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(applicant._id, "pending")}
                  >
                    Reset
                  </Button>
                  <Button
                    className="ml-auto"
                    onClick={() =>
                      handleSave(applicant._id, applicant.employerNotes, applicant.status)
                    }
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ViewApplicantsPage;