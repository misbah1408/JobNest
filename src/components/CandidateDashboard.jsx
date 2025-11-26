import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Briefcase,
  Circle,
  Clock,
  ExternalLink,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import axios from "axios";
import { format } from "date-fns";
import { useTheme } from "next-themes";

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [successRate, setSuccessRate] = useState(0);
  const fetchApplications = async () => {
    const response = await axios.get("/api/applications");
    // console.log(response);
    setApplications(response?.data?.data.reverse());
  };
  const {theme} = useTheme();
  console.log(theme);
  
  const counts = useMemo(() => {
    return applications?.reduce(
      (acc, app) => {
        acc[app?.status] = (acc[app?.status] || 0) + 1;
        return acc;
      },
      { pending: 0, reviewed: 0, accepted: 0, rejected: 0 }
    );
  }, [applications]);

  const data = [
    { name: "Pending", value: counts?.pending || 60, color: "#fbbf24" },
    { name: "Accepted", value: counts?.accepted || 51, color: "#10b981" },
    { name: "Reviewed", value: counts?.reviewed || 13, color: "#3b82f6" },
    { name: "Rejected", value: counts?.rejected || 5, color: "#ef4444" },
  ];
  const statusColors = {
    reviewed: "text-blue-500",
    pending: "text-yellow-500",
    rejected: "text-red-500",
    accepted: "text-green-500",
  };
  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    // console.log(applications);
    
    if (applications.length > 0) {
      const total = applications.length;
      const accepted = applications.filter(
        (app) => app.status === "accepted"
      ).length;
      const rate = total > 0 ? ((accepted / total) * 100).toFixed(2) : 0;
      setSuccessRate(rate);
    }
  }, [applications]);

  return (
    <div className="mt-[100px] h-full w-full flex flex-col items-center">
      <div className="w-[80%] py-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href={"/dashboard/my-applications"}>
            <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer">
              <CardHeader className={"flex justify-between"}>
                <CardTitle className={"text-sm font-medium"}>
                  My Application
                </CardTitle>
                <div className="flex gap-3">
                  <FileCheck size={16} />
                  <ExternalLink size={16} />
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">{applications?.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total jobs you've applied to
                </p>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer">
            <CardHeader className={"flex justify-between"}>
              <CardTitle className={"text-sm font-medium"}>
                Application Success Rate
              </CardTitle>
              <div className="flex gap-3">
                <Briefcase size={16} />
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Percentage of successful applications
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer">
            <CardHeader className={"flex justify-between"}>
              <CardTitle className={"text-sm font-medium"}>
                Interview Opportunities
              </CardTitle>
              <div className="flex gap-3">
                <Clock size={16} />
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="text-2xl font-bold">52</div>
              <p className="text-xs text-muted-foreground">
                Applications in review or accepted status
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Link href={"/dashboard/jobs"}>
            <Card
              className={
                "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer"
              }
            >
              <CardHeader
                className={
                  "flex flex-row items-center justify-between space-y-0 pb-2"
                }
              >
                <CardTitle className={"text-sm font-medium"}>
                  Browse Available Jobs
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} />
                  <ExternalLink size={16} />
                </div>
              </CardHeader>
              <CardContent className="px-6">
                <div className="text-2xl font-bold">Explore Opportunities</div>
                <p className="text-xs text-muted-foreground">
                  Find and apply to new job openings
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className={
              "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
            }
          >
            <CardHeader>
              <CardTitle>Applications by Status</CardTitle>
              <CardDescription>
                Status distribution of your job applications
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 flex justify-center h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    dataKey="value"
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x =
                        cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y =
                        cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#fff"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-sm font-medium"
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={theme === "dark" ? "#0f172b" : "#fff"}
                        strokeWidth={5}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      borderRadius: "8px",
                      border: "none",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend
                    content={({ payload }) => (
                      <ul className="flex flex-wrap justify-center gap-4 mt-2">
                        {payload?.map((entry, index) => (
                          <li
                            key={`item-${index}`}
                            className="flex items-center gap-2"
                          >
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm font-medium ">
                              {entry.value} ({entry.payload.value})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Job Applications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {applications.slice(0, 5).map((job, i) => {
                const { jobDetails } = job;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <Circle
                      className={`mt-0.5 h-2 w-2 fill-current ${statusColors[job.status]}`}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">
                        {jobDetails.jobTitle}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        at {jobDetails.companyName}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(job.appliedAt), "MMMM dd, yyyy")}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
