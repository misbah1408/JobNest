'use client'

import { Edit, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/schema/jobSchema";
import { useEffect, useState } from "react";
import locations from "../app/utils/location.json";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";

const durations = ["5m", "10m", "15m", "20m", "30m", "60m"];
const jobType = ["Full-time", "Part-time", "Remote", "Internship"];

const EditJob = ({ data, onSuccess}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState(data?.skills || []);
  const states = locations["States"];
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: data.jobTitle || "",
      companyName: data.companyName || "",
      jobDescription: data.jobDescription || "",
      jobType: data.jobType || "",
      location: data.location || "",
      salary: data.salary || "",
      jobStatus: data.jobStatus || false,
      expiryDate: data.expiryDate?.split("T")[0] || "",
      interviewDuration: data.interviewDuration || "",
      skills: data.skills || [],
    },
  });

  useEffect(() => {
    setValue("skills", skills);
  }, [skills, setValue]);

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim().split(",").filter(Boolean);
      const newSkills = trimmed.filter((s) => !skills.includes(s));
      setSkills((prev) => [...prev, ...newSkills]);
      setInputValue("");
    }
  };

  const onSubmit = async (values) => {
    try {
      const updatedData = {
        ...values,
        skills,
        location: city ? `${state}, ${city}` : state,
      };
      if (updatedData.location == "") updatedData.location = data.location;
      const res = await axios.put(`/api/create-job`, {
        jobId: data._id,
        updatedData,
      });

      if (res.status == 200) {
        setIsOpen(false);
        await onSuccess();
        toast.success("Job updated successfully!");
      } else {
        toast.error("Failed to update job");
      }
    } catch (error) {
      toast.error("Failed to update job");
    }
  };

  const generateWithAI = async () => {
    const values = getValues();
    // console.log(values);

    if (
      !values.jobTitle ||
      !values.companyName ||
      !values.jobType ||
      skills.length === 0
    ) {
      toast.error(
        "Please fill in the required fields before generating the job description."
      );
      return;
    }
    try {
      toast.info("Generating job description...");
      const response = await axios.post("/api/ai/generate-job-description", {
        jobTitle: values.jobTitle,
        companyName: values.companyName,
        jobType: values.jobType,
        location: city ? `${state}, ${city}` : state,
        salary: values.salary,
        expiryDate: values.expiryDate,
        skills,
      });
      const { description } = response.data;
      if (description) {
        setValue("jobDescription", description);
        toast.success("Job description generated!");
      } else {
        toast.error("AI response incomplete.");
      }
    } catch (error) {
      toast.error("Failed to generate description.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <span>
          <Edit size={16} className="cursor-pointer" />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[600px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Make changes and save the updated job details.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          {/* Left Column */}
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input type="text" id="jobTitle" {...register("jobTitle")} />
              {errors.jobTitle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label id={"companyName"}>Company Name</Label>
              <Input
                type={"text"}
                id="companyName"
                label="Company Name"
                {...register("companyName")}
                errors={errors}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label id={"salary"}>Salary</Label>
              <Input
                type={"text"}
                id="salary"
                label="Salary (Optional)"
                {...register("salary")}
                errors={errors}
              />
            </div>
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

              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center bg-blue-500 p-1 px-2 text-[12px] rounded-full text-white"
                  >
                    {skill}
                    <X
                      className="w-4 h-4 cursor-pointer ml-1"
                      onClick={() => removeSkill(skill)}
                    />
                  </span>
                ))}
              </div>
            </div>
            {/* Job Status */}
            <div className="flex items-center gap-2">
              <Label>Job Active</Label>
              <Controller
                name="jobStatus"
                control={control}
                defaultValue={getValues("jobStatus")}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // console.log(getValues());
                    }}
                  />
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
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
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
                defaultValue={data?.interviewDuration || ""}
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
              <Button
                onClick={() => generateWithAI(getValues(), setValue)}
                className="text-sm hover:underline"
                variant={"outline"}
              >
                <Sparkles />
                Generate with AI
              </Button>
            </div>
            <Textarea
              id="jobDescription"
              {...register("jobDescription")}
              rows={5}
              className="w-full mt-2 px-3 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded"
              placeholder="Recommended Generate with Ai"
            />
            {errors?.jobDescription && (
              <p className="text-sm text-red-500 mt-1">
                {errors?.jobDescription?.message}
              </p>
            )}
          </div>

          <DialogFooter className={"text-right"}>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJob;
