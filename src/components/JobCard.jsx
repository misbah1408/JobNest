"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/schema/applicationSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Banknote, BanknoteX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const JobCard = ({ job, id }) => {
  const {
    jobTitle,
    companyName,
    jobDescription,
    jobType,
    location,
    salary,
    createdAt,
    _id,
    applicants,
  } = job || {};
  // console.log(_id);
  const [open, setOpen] = useState(false);
  // const [active, setActive] = useState(false);
  // console.log(id, _id, active);
  const isActive = id === _id;
  const { data: session } = useSession();
  const user = session?.user;
  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
      resumeUrl: user?.resumeUrl || null,
      jobId: _id || "",
    },
  });

  const onSubmit = async (formData) => {
    const toastId = toast.loading("Application submitting...");
    console.log(formData);

    try {
      const applicationPayload = {
        ...formData,
        resumeUrl: user?.resumeUrl,
        jobId: _id,
      };

      if (!formData.resumeUrl) {
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
      console.log(applicationPayload);

      const res = await axios.post("/api/applications", applicationPayload);
      console.log("Application submitted:", res.data);

      if (res?.data?.message === "Already applied") {
        toast.dismiss(toastId, { id: toastId });
        setOpen(false);
        return toast.error("You have already applied to this job.");
      }

      toast.success(
        res?.data?.message || "Application submitted successfully!",
        {
          id: toastId,
        }
      );
      setOpen(false);

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

  // useEffect(() => {
  //   setActive(id === user._id);
  //   console.log(id);
  // }, []);

  const postedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <div
      className={`relative bg-white dark:bg-black shadow-md rounded-lg p-6 max-w-2xl mx-auto my-4 border border-gray-200 dark:border-gray-700 ${isActive ? "border-2 border-black" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-400">
            {jobTitle}
          </h2>
          <p className="text-gray-600">{companyName}</p>
        </div>
        <span className="text-sm text-gray-500">{postedDate}</span>
      </div>

      <div className="text-gray-700 mt-4 overflow-hidden max-h-20 line-clamp-3">
        <ReactMarkdown>{jobDescription}</ReactMarkdown>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="bg-gray-100 dark:bg-gray-900 dark:text-gray-400 px-3 py-1 rounded-full">
          {jobType}
        </span>
        <span className="bg-gray-100 dark:bg-gray-900 dark:text-gray-400 px-3 py-1 rounded-full">
          {location}
        </span>
        <span
          className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-gray-200 px-3 py-1 rounded-full font-medium flex gap-2 justify-center items-center"
          title={salary}
        >
          {salary == "Not disclosed" ? (
            <>
              <BanknoteX /> Not disclosed{" "}
            </>
          ) : (
            <>
              <Banknote />
              {salary}
            </>
          )}
        </span>
      </div>

      <div className="absolute bottom-5 right-5">
        <Link href={`/dashboard/jobs/${_id}`}>
          <Button variant="link" className="cursor-pointer mr-1">
            Details
          </Button>
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {!applicants.includes(user._id) ? (
              <Button
                variant="outline"
                className="cursor-pointer hover:bg-green-200"
              >
                Apply
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={true}
                className="hover:bg-green-200 cursor-not-allowed"
              >
                Already applied
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
  );
};

export default JobCard;
