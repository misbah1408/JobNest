"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { jobSchema } from "@/schema/jobSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

// You can replace this with your actual switch component
const Switch = ({ checked, onChange }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className="h-5 w-10 rounded-full appearance-none bg-gray-300 checked:bg-blue-600 transition duration-300"
  />
);

const locations = ["Remote", "New York", "San Francisco", "London"];
const durations = ["15m", "30m", "60m"];

const PostJobPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === "authenticated" && user?.role !== "employer") {
      router.replace("/dashboard");
    }
  }, [status, user, router]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      jobType: "",
      location: "",
      salary: "",
      jobStatus: false,
      expiryDate: "",
      interviewDuration: "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      salary: data.salary || "Not disclosed",
      postedBy: user?._id,
    };

    try {
      const res = await axios.post("/api/create-job", payload);
      if (res.status === 201) {
        toast.success(res.data.message);
        router.replace("/dashboard");
      } else {
        toast.error("Failed to post job");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow mt-[100px]">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
        Create New Job
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          <FormField id="title" label="Job Title" register={register} errors={errors} />
          <FormField id="company" label="Company Name" register={register} errors={errors} />
          <FormField id="salary" label="Salary (Optional)" register={register} errors={errors} />

          {/* Job Status */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="jobStatus" className="text-gray-700 dark:text-gray-200">
              Job Status
            </Label>
            <Controller
              control={control}
              name="jobStatus"
              render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Location */}
          <div>
            <Label htmlFor="location" className="block text-gray-700 dark:text-gray-200 mb-1">
              Location
            </Label>
            <select
              {...register("location")}
              className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <Label htmlFor="expiryDate" className="block text-gray-700 dark:text-gray-200 mb-1">
              Expiry Date
            </Label>
            <Input type="date" {...register("expiryDate")} />
            {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate.message}</p>}
          </div>

          {/* Interview Duration */}
          <div>
            <Label htmlFor="interviewDuration" className="block text-gray-700 dark:text-gray-200 mb-1">
              Interview Duration
            </Label>
            <select
              {...register("interviewDuration")}
              className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded"
            >
              <option value="">Select duration</option>
              {durations.map((dur) => (
                <option key={dur} value={dur}>
                  {dur}
                </option>
              ))}
            </select>
            {errors.interviewDuration && (
              <p className="text-sm text-red-500">{errors.interviewDuration.message}</p>
            )}
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="col-span-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-200">
              Job Description
            </Label>
            <button
              type="button"
              onClick={() => {
                // TODO: add AI description generation
                toast("AI generation coming soon!");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Generate with AI
            </button>
          </div>
          <Textarea
            id="description"
            {...register("description")}
            rows={5}
            className="w-full mt-2 px-3 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded"
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button - Full Width */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
          >
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;

// ----------------
// Basic input field component
const FormField = ({ id, label, register, errors }) => (
  <div>
    <Label htmlFor={id} className="block text-gray-700 dark:text-gray-200 mb-1">
      {label}
    </Label>
    <Input
      id={id}
      {...register(id)}
      className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded"
    />
    {errors[id] && <p className="text-sm text-red-500 mt-1">{errors[id].message}</p>}
  </div>
);
