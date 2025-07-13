"use client";

import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import locations from "../../../utils/location.json";
import { X } from "lucide-react";

// You can replace this with your actual switch component
const Switch = ({ checked, onChange }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className="h-5 w-10 rounded-full appearance-none bg-gray-300 checked:bg-blue-600 transition duration-300"
  />
);

const durations = ["5m", "10m", "15m", "30m", "60m"];
const jobType = ["Full-time", "Part-time", "Remote", "Internship"];

const PostJobPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  
  useEffect(() => {
    if (status === "authenticated" && user?.role !== "employer") {
      router.replace("/dashboard");
    }
  }, [status, user, router]);
  
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState([]);
  const states = locations["States"];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills([...skills, trimmed]);
        setInputValue("");
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
      jobType: "",
      location: "",
      salary: "",
      jobStatus: false,
      expiryDate: "",
      interviewDuration: "",
      skills: [],
    },
  });

  // Update skills in form when skills state changes
  useEffect(() => {
    setValue("skills", skills);
  }, [skills, setValue]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      salary: data.salary || "Not disclosed",
      postedBy: user?._id,
      location: city.trim() !== "" ? `${state}, ${city}` : state,
      skills: skills, // Use the skills from state
    };
    console.log(payload);

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        {/* Left Column */}
        <div className="space-y-5">
          <FormField
            id="jobTitle"
            label="Job Title"
            register={register}
            errors={errors}
          />
          <FormField
            id="companyName"
            label="Company Name"
            register={register}
            errors={errors}
          />
          <FormField
            id="salary"
            label="Salary (Optional)"
            register={register}
            errors={errors}
          />
          <div className="space-y-1">
            <Label
              htmlFor="Skills"
              className="text-gray-700 dark:text-gray-200"
            >
              Skills
            </Label>
            <Input
              id="skills"
              placeholder="Write skill, press Enter or comma"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="flex items-center bg-blue-500 p-1 text-sm rounded-full text-white"
                >
                  {skill}{" "}
                  <X
                    className="w-4 h-4 cursor-pointer ml-1"
                    onClick={() => removeSkill(skill)}
                  />
                </span>
              ))}
            </div>
          </div>
          {/* Job Status */}
          <div className="flex items-center space-x-3">
            <Label
              htmlFor="jobStatus"
              className="text-gray-700 dark:text-gray-200"
            >
              Job Status
            </Label>
            <Controller
              control={control}
              name="jobStatus"
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div>
            <Label
              htmlFor="jobType"
              className="block text-gray-700 dark:text-gray-200 mb-1"
            >
              Job Type
            </Label>
            <Controller
              control={control}
              name="jobType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobType.map((ty) => (
                      <SelectItem key={ty} value={ty}>
                        {ty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.jobType && (
              <p className="text-sm text-red-500">{errors.jobType.message}</p>
            )}
          </div>
          
          {/* Location */}
          <div>
            <Label
              htmlFor="location"
              className="block text-gray-700 dark:text-gray-200 mb-1"
            >
              Location
            </Label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Select 
                  onValueChange={(value) => {
                    setState(value);
                    field.onChange(value);
                  }} 
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {state && state !== "Remote" && (
            <div>
              <Label
                htmlFor="City"
                className="block text-gray-700 dark:text-gray-200 mb-1"
              >
                City
              </Label>
              <Select onValueChange={(value) => setCity(value)} value={city}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {locations[state]?.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Expiry Date */}
          <div>
            <Label
              htmlFor="expiryDate"
              className="block text-gray-700 dark:text-gray-200 mb-1"
            >
              Expiry Date
            </Label>
            <Input type="date" {...register("expiryDate")} />
            {errors.expiryDate && (
              <p className="text-sm text-red-500">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          {/* Interview Duration */}
          <div>
            <Label
              htmlFor="interviewDuration"
              className="block text-gray-700 dark:text-gray-200 mb-1"
            >
              Interview Duration
            </Label>
            <Controller
              control={control}
              name="interviewDuration"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((dur) => (
                      <SelectItem key={dur} value={dur}>
                        {dur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.interviewDuration && (
              <p className="text-sm text-red-500">
                {errors.interviewDuration.message}
              </p>
            )}
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="col-span-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="jobDescription"
              className="text-gray-700 dark:text-gray-200"
            >
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
            id="jobDescription"
            {...register("jobDescription")}
            rows={5}
            className="w-full mt-2 px-3 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded"
          />
          {errors?.jobDescription && (
            <p className="text-sm text-red-500 mt-1">
              {errors?.jobDescription?.message}
            </p>
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
    {errors[id] && (
      <p className="text-sm text-red-500 mt-1">{errors[id].message}</p>
    )}
  </div>
);