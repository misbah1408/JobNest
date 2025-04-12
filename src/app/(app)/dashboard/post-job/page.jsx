"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jobSchema } from "@/schema/jobsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";


const PostJobPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  if(session?.user?.role !== "employer"){
    router.replace("/dashboard")
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      jobType: "",
      location: "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      salary: data.salary || "Not disclosed",
      postedBy: user?._id,
    };
    // console.log(payload);
    
    try {
      const res = await axios.post("/api/create-job", payload);
      // console.log(res);
      
      if (res.status === 201) {
        toast.success(res.data.message);
        router.replace("/dashboard");
      } else {
        toast.error("Failed to post job");
      }
      
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="w-[50%] mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Post a Job</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <div className="grid gap-4 py-4">
          {/* Title */}
          <FormField id="title" label="Title" register={register} errors={errors} />
          <FormField id="company" label="Company" register={register} errors={errors} />
          <FormTextarea id="description" label="Description" register={register} errors={errors} />
          <FormField id="jobType" label="Job Type" register={register} errors={errors} />
          <FormField id="location" label="Location" register={register} errors={errors} />
          <FormField id="salary" label="Salary ($/yr)" register={register} errors={errors} />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;

// ----------------
// Reusable field components
const FormField = ({ id, label, register, errors }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">{label}</Label>
    <div className="col-span-3">
      <Input id={id} {...register(id)} />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id].message}</p>}
    </div>
  </div>
);

const FormTextarea = ({ id, label, register, errors }) => (
  <div className="grid grid-cols-4 items-start gap-4">
    <Label htmlFor={id} className="text-right">{label}</Label>
    <div className="col-span-3">
      <Textarea
        id={id}
        {...register(id)}
        className="w-full border rounded px-3 py-2"
        rows={4}
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id].message}</p>}
    </div>
  </div>
);