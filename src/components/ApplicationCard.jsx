"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  ClipboardList,
  Loader2,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const statusMap = {
  accepted: {
    text: "Accepted",
    badge: "bg-green-500/20 text-green-500",
    icon: <CheckCircle className="w-4 h-4 mr-1 text-green-600" />,
  },
  rejected: {
    text: "Rejected",
    badge: "bg-red-500/20 text-red-700",
    icon: <XCircle className="w-4 h-4 mr-1 text-red-600" />,
  },
  pending: {
    text: "Pending",
    badge: "bg-amber-500/20 text-amber-500",
    icon: <Clock className="w-4 h-4 mr-1 text-amber-500" />,
  },
  reviewed: {
    text: "Reviewed",
    badge: "bg-blue-500/20 text-blue-700",
    icon: <ClipboardList className="w-4 h-4 mr-1 text-blue-500" />,
  },
};

function getMatchScore(score) {
  if (score <= 40)
    return {
      bar: "bg-red-500",
      txtBg: "text-red-500",
      badge: "bg-red-100 text-red-700 border border-red-300",
      text: "✗",
    };
  if (score <= 75)
    return {
      bar: "bg-amber-500",
      badge: "bg-amber-100 text-amber-700 border border-amber-300",
      txtBg: "text-amber-500",
      text: "◐",
    };
  return {
    bar: "bg-green-500",
    badge: "bg-green-100 text-green-700 border border-green-300",
    txtBg: "text-green-500",
    text: "✓",
  };
}

const ApplicationCard = ({ data }) => {
  const [applications, setApplications] = useState([]);
  const counts = useMemo(() => {
    return data.reduce(
      (acc, app) => {
        acc[app?.status] = (acc[app?.status] || 0) + 1;
        return acc;
      },
      { pending: 0, reviewed: 0, accepted: 0, rejected: 0 }
    );
  }, [data]);

  if (!data || data.length < 0) {
    return (
      <div className="text-center mt-[100px] flex justify-center">
        <Loader2 className="animate-spin" size={64} />
      </div>
    );
  }

  useEffect(() => {
    setApplications(data);
  }, [data])
  
  return (
    <div className="w-full mt-3 mb-3">
      <Tabs
        className={"mb-3"}
        defaultValue="all"
        onValueChange={(value) => {
          setApplications(
            value === "all" ? data : data.filter((app) => app?.status === value)
          );
        }}
      >
        <TabsList>
          {["all", "pending", "reviewed", "accepted", "rejected"].map((key) => (
            <TabsTrigger key={key} value={key} className="text-sm md:text-base">
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <Badge variant="secondary" className="ml-2">
                {key === "all" ? data?.length : counts[key]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Match Score</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead></TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications?.map((app) => {
            const status = statusMap[app?.status] || {
              text: app?.status || "Unknown",
              badge: "bg-gray-100 text-gray-700 border border-gray-300",
              icon: <ClipboardList className="w-4 h-4 mr-1 text-gray-500" />,
            };

            const score = getMatchScore(app?.matchScore || 0);

            return (
              <TableRow key={app?._id}>
                <TableCell>{app.jobDetails?.jobTitle}</TableCell>
                <TableCell>{app?.jobDetails?.companyName}</TableCell>
                <TableCell>
                  <Badge
                    className={`${statusMap[app?.status]?.badge} ${statusMap[app?.status]?.badge}`}
                  >
                    {status?.text}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 flex-shrink-0">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${score.bar}`}
                          style={{ width: `${app?.matchScore || 0}%` }}
                        />
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${score.badge}`}
                    >
                      {score.text} {app?.matchScore ?? 0}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {app?.appliedAt
                    ? format(new Date(app.appliedAt), "MMMM dd, yyyy")
                    : "—"}
                </TableCell>
                <TableCell>
                  <Link href={"/dashboard/jobs/" + app?.jobDetails?._id}>
                    <Button variant={"secondary"} className="bg-transparent">
                      <Eye /> View Job
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationCard;
