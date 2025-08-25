import Link from "next/link";
import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";
import { Edit, Eye, LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import EditJob from "./EditJob";

const PostedJobs = ({ jobs, onSuccess }) => {
  // console.log(jobs);
  const router = useRouter();
  const handleDelete = async (jobId) => {
    try {
      const response = await axios.delete(`/api/create-job/?jobId=${jobId}`);

      if (response.status === 200) {
        toast.success("Job deleted successfully.");
        router.refresh();
      } else {
        toast.error("Failed to delete the job. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the job.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead className="text-center min-w-40">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.length === 0
            ? [...Array(7)].map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                  {Array(8)
                    .fill(0)
                    .map((_, colIdx) => (
                      <TableCell key={colIdx}>
                        <div className="h-6 bg-gray-400 rounded w-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            : jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium"><Link href={"/dashboard/employer/"+job._id}>{job.jobTitle}</Link></TableCell>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell className="flex flex-wrap">
                    {job?.skills?.slice(0, 3).map((skill, i) => (
                      <Badge
                        variant="secondary"
                        key={i}
                        style={{ marginRight: "6px" }}
                      >
                        {skill}
                      </Badge>
                    ))}
                    {job?.skills?.length > 3 && (
                      <Badge variant="secondary">
                        +{job.skills.length - 3}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    {formatDate(new Date(job.expiryDate), "MMMM dd, y")}{" "}
                    {new Date(job.expiryDate) < Date.now() && (
                      <Badge variant="destructive">Expired</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {job.jobStatus ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant="secondary">Not Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-pointer">
                            <Eye size={16} className="text-muted-foreground" />
                            <span className="font-medium">
                              {job?.applicants?.length || 0}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {job?.applicants?.length || 0} view applicant
                            {job?.applicants?.length !== 1 ? "s" : ""}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell className="flex md:justify-between justify-center items-center gap-2">
                    <button
                      title="Copy Link"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/dashboard/jobs/${job._id}`
                        );
                        toast.success("Job link copied successfully");
                      }}
                    >
                      <LinkIcon size={16} />
                    </button>
                    <Link href={`/dashboard/jobs/${job._id}`} title="View Job">
                      <Eye size={16} />
                    </Link>
                    <button title="Edit">
                      <EditJob data={job} onSuccess={onSuccess} />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="none">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the job and all
                            associated data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(job._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PostedJobs;
