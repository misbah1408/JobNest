// app/employer/view-applicants/[jobId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import ResumeViewer from "@/components/ResumeViewer";
import { toast } from "sonner";
const ViewApplicantsPage = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // Fetch applicants for the given jobId
    const fetchApplicants = async () => {
      const res = await axios.get(`/api/applications/applicants/${jobId}`);
      console.log(res.data[0].employerNotes);

      setApplicants(res.data);
    };

    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = (appId, status) => {
    setApplicants((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, status } : app))
    );
  };

  const handleSave = async (appId, employerNotes, status) => {
    const payload = {
      employerNotes,
      status
    } 
    const response = await axios.patch(`/api/applications/applicants/update/${appId}`, payload);
    console.log(response);
    
    toast("Changes saved");
  };

  return (
    <div className="w-[50%] mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Applicants</h1>
      {applicants.length === 0 && (
        <p className="text-gray-500 text-center">No applicants yet.</p>
      )}
      <div className="space-y-6">
        {applicants.map((applicant) => (
          <Card key={applicant._id}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{applicant.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {applicant.user.email}
                  </p>
                </div>
                <Badge
                  className={"p-2"}
                  variant={
                    applicant.status === "accepted"
                      ? "success"
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
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusChange(applicant._id, "accepted")}
                >
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange(applicant._id, "rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(applicant._id, "pending")}
                >
                  Reset
                </Button>
                <ResumeViewer applicant={applicant} />
              </div>

              <Button
                className="mt-4"
                onClick={() =>
                  handleSave(applicant._id, applicant.employerNotes, applicant.status)
                }
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewApplicantsPage;
