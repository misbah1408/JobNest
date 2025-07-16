import Link from "next/link";
import React from "react";
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
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";
import { Edit, Eye, LinkIcon, LucideView, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const PostedJobs = ({ jobs }) => {
  console.log(jobs);

  return (
    <div className="space-y-4 rounded-2xl">
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead className={"text-center"}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell className="font-medium">{job.jobTitle}</TableCell>
              <TableCell>{job.companyName}</TableCell>
              <TableCell className={"flex flex-wrap"}>
                {job?.skills?.slice(0, 3).map((skill, i) => (
                  <Badge
                    variant={"secondary"}
                    key={i}
                    style={{ marginRight: "6px" }}
                  >
                    {skill}
                  </Badge>
                ))}
                {job?.skills?.length > 3 && (
                  <Badge variant={"secondary"}>+{job.skills.length - 3}</Badge>
                )}
              </TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>
                {formatDate(new Date(job.expiryDate), "MMMM dd, y")}{" "}
                {new Date(job.expiryDate) < Date.now() && (
                  <Badge variant={"destructive"}>Expired</Badge>
                )}
              </TableCell>
              <TableCell>
                {job.jobStatus ? (
                  <Badge>Active</Badge>
                ) : (
                  <Badge variant={"secondary"}>Not Active</Badge>
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
                        {job?.applicants?.length < 1 ? "" : "s"}
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
                      `${window.location.origin}/job/${job._id}`
                    );
                    toast.success("Job link copied successfully");
                  }}
                >
                  <LinkIcon size={16} />
                </button>
                <Link href={`/job/${job._id}`} title="View Job">
                  <Eye size={16} />
                </Link>
                <Link href={`/dashboard/edit/${job._id}`} title="Edit">
                  <Edit size={16} />
                </Link>
                <button
                  title="Delete Job"
                  onClick={() => handleDelete(job._id)}
                >
                  <Trash2 size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>
    </div>
  );
};

export default PostedJobs;
