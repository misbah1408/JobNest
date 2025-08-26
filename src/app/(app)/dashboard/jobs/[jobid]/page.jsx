"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { applicationSchema } from "@/schema/applicationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  IndianRupee,
  Loader2,
  MapPin,
  Users2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const Page = () => {
  const [jobDetails, setJobDetails] = useState();
  const params = useParams();
  const jobId = params.jobid;
  const { data: session } = useSession();
  const user = session?.user;
  // console.log(session);
  const {
    applications,
    companyName,
    createdAt,
    jobDescription,
    jobType,
    location,
    salary,
    jobTitle,
    expiryDate,
    skills,
    applicants,
  } = jobDetails || {};

  const dateFormat = (dateAt) => {
    if (!dateAt) return;
    const date = new Date(dateAt);
    const formatted = format(date, "MMMM d, yyyy");

    return formatted;
  };
  const formatMarkdownWithSpacing = (markdown) => {
    return markdown.replace(/(\n)?(?=\d\. \*\*)/g, "\n\n");
  };
  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/create-job/${jobId}`);

      // Access response data
      const data = response.data;
      // console.log(data.data);

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

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
      resumeUrl: user?.resumeUrl || null,
      jobId: jobId || "",
    },
  });

  const onSubmit = async (formData) => {
    const toastId = toast.loading("Application submitting...");
    // console.log(formData);

    try {
      const applicationPayload = {
        ...formData,
        resumeUrl: user?.resumeUrl,
        jobId: jobId,
      };
      // console.log(applicationPayload);

      if (!applicationPayload.resumeUrl) {
        const uploadPDF = await axios.post(
          "/api/upload-file",
          { file: formData.resumeUrl[0] },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        let resResumeUrl = uploadPDF?.data?.secure_url;
        applicationPayload.resResumeUrl = resResumeUrl;
      }
      // console.log(applicationPayload);

      const res = await axios.post("/api/applications", applicationPayload);
      // console.log("Application submitted:", res.data);

      if (res?.data?.message === "Already applied") {
        toast.dismiss(toastId, { id: toastId });
        // setOpen(false);
        return toast.error("You have already applied to this job.");
      }

      toast.success(
        res?.data?.message || "Application submitted successfully!",
        {
          id: toastId,
        }
      );
      // setOpen(false);

      // Optional: reset form, close modal, etc.
    } catch (error) {
      console.error("Submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong. Please try again.";

      if (errorMessage === "Already applied") {
        toast.error("You have already applied to this job.");
      } else {
        toast.error(errorMessage, { id: toastId });
      }
    }
  };
  useEffect(() => {
    if (!session) {
      // fetchJobDetails();
      toast.error("Please login/sign");
    }
    fetchJobDetails();
  }, []);

  if (!jobDetails || Object.keys(jobDetails).length === 0) {
    return (
      <div className="dark:bg-black min-h-screen pt-24 px-4 md:px-8 lg:px-36 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading job details...</span>
      </div>
    );
  }
  return (
    <div className="dark:bg-black min-h-screen pt-24 px-4 md:px-8 lg:px-36">
      {/* Back Button */}
      <div className="flex items-center mb-8">
        <Link href={"/dashboard/jobs"}>
          <Button variant={"link"} className={"text-sm"}>
            <ArrowLeft className="w-5 h-5 dark:text-white" />
            <span className="dark:text-white">Back to job listings</span>
          </Button>
        </Link>
      </div>

      <div className="relative max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="dark:text-white lg:col-span-2">
            {/* Job Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{jobTitle}</h1>

            {/* Company */}
            <div className="flex items-center mb-8">
              <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-gray-400">{companyName}</span>
            </div>

            {/* Job Description Container */}
            <div className="dark:bg-black rounded-lg p-6 md:p-8 border dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Job Description</h2>

              {/* Job Title */}
              <div className="mb-6">
                <p className="text-lg">
                  {jobTitle} at {companyName}
                </p>
              </div>

              {/* About the Company */}

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {formatMarkdownWithSpacing(jobDescription)}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="sticky top-28 dark:bg-black dark:border-gray-700 border dark:text-white p-6 rounded-lg shadow-lg lg:col-span-1 h-fit">
            {/* Location */}
            <div className="flex items-center mb-6">
              <MapPin className="w-5 h-5 mr-3 text-gray-400" />
              <span className="text-lg font-medium">{location}</span>
            </div>
            <div className="flex items-center mb-6">
              <IndianRupee className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <span className="text-gray-400">Salary: </span>
                <span className="text-lg font-medium">{salary}</span>
              </div>
            </div>
            {/* Date Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <span className="text-gray-400">Posted: </span>
                  <span className="dark:text-white">
                    {dateFormat(createdAt)}
                  </span>
                </div>
              </div>

              {expiryDate && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <span className="text-gray-400">Expires: </span>
                    <span className="dark:text-white">
                      {dateFormat(expiryDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center mb-3">
              <Users2 className="w-5 h-5 mr-3 text-gray-400" />
              {applicants.length > 0 ? (
                <div>
                  <span className="text-gray-400">No of Applicants: </span>
                  <span className="dark:text-white text-xl">
                    {applicants.length}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-gray-400">
                    {user?.role === "job_seeker"
                      ? "Apply now: Be an early applicant"
                      : "Admin/Recruiter View"}
                  </span>
                </div>
              )}
            </div>

            {/* Required Skills */}
            {skills && (
              <div className="mb-6">
                <h3 className="dark:text-white font-semibold mb-3">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="dark:bg-gray-800 dark:text-white px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            {/* <button className="w-full bg-gray-300 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Apply Now
            </button> */}
            <Dialog>
              <DialogTrigger asChild>
                {user?.role === "job_seeker" ? (
                  !applicants.includes(user._id) ? (
                    <Button className="w-full bg-gray-300 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                      Apply
                    </Button>
                  ) : (
                    <Button
                      disabled={true}
                      className="w-full bg-gray-300 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-not-allowed"
                    >
                      Already Applied
                    </Button>
                  )
                ) : (
                  <Button
                    className="w-full bg-gray-300 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    disabled={true}
                  >
                    Admin/Recruiter View
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="max-w-[425px] md:w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    Apply to {jobTitle} at {companyName}
                  </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Cover Letter */}
                    <FormField
                      name="coverLetter"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Letter</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              rows={5}
                              className="w-full border rounded px-3 py-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Resume Upload */}
                    <FormField
                      name="resumeUrl"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume (PDF)</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => field.onChange(e.target.files)}
                            />
                          </FormControl>
                          <span className="text-xs font-semibold text-gray-500">
                            Ignore if you’ve already uploaded your resume.
                          </span>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="submit"
                        className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                          form.formState.isSubmitting
                            ? "cursor-not-allowed opacity-75"
                            : ""
                        }`}
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Application</span>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
