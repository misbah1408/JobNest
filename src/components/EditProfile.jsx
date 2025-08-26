"use client";

import React, { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pen, Loader2 } from "lucide-react";
import { profileSchema } from "@/schema/profileSchema";
import ImageUploadField from "./ImageUploadField"; // Custom image upload field
import { toast } from "sonner";

const EditProfile = ({ isEditOpen, setIsEditOpen, data }) => {
  const [username, setUsername] = useState(data?.username);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [resume, setResume] = useState(null); // New state for resume
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null); // Ref for the resume input

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: data?.username || "",
      name: data?.name || "",
      role: data?.role || "",
      image: data?.image || "",
      resume: data?.resumeUrl || "", // Add resume to the form's default values
    },
  });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const toastId = toast.loading("Saving your profile...");

      // Step 1: Upload the image if it exists
      if (formData.image && formData.image !== data?.image) {
        const fileData = new FormData();
        fileData.append("file", formData.image);

        const uploadRes = await axios.post("/api/upload-file", fileData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        formData.image = uploadRes?.data?.secure_url;
      }

      // Step 2: Upload the resume if it exists
      if (formData.resumeUrl != data?.resumeUrl && resume) {
        const resumeData = new FormData();
        resumeData.append("file", resume);

        const uploadResumeRes = await axios.post("/api/upload-file", resumeData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        formData.resumeUrl = uploadResumeRes?.data?.secure_url;
      }
      // console.log(formData);
      
      // Step 3: Save the profile
      const saveRes = await axios.post("/api/save-profile", formData);
      const message = saveRes?.data?.message || "Profile updated successfully!";
      toast.success(message, { id: toastId });
      // console.log(saveRes);
      
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkUsernameUnique = async (username) => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        setUsernameMessage("Error checking username");
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  useEffect(() => {
    if (username === data.username) {
      setUsernameMessage("");
      return;
    }
    const timeout = setTimeout(() => {
      checkUsernameUnique(username);
    }, 300);
    return () => clearTimeout(timeout);
  }, [username]);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogTrigger asChild>
        <button
          disabled={isSubmitting}
          className="p-3 flex justify-center rounded-full hover:bg-gray-100 transition-colors bg-white cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin " />
          ) : (
            <Pen className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Make changes to your account details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="flex items-center justify-center rounded-full">
              <ImageUploadField form={form} defaultImage={data.image} />
            </div>

            {/* Username Field */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className={"selection:bg-blue-500"}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin w-4 h-4 mt-1" />
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm mt-1 ${usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Field */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} className={"selection:bg-blue-500"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">Select a role</option>
                      <option value="job_seeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume Upload */}
            <FormField
              name="resume"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      ref={resumeInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setResume(file); // Store the file for upload
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  {resume && (
                    <p className="mt-1 text-sm text-gray-500">
                      {resume.name} ({(resume.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className={`flex items-center justify-center gap-2 transition-all duration-300 ${
                  isSubmitting ? "cursor-not-allowed opacity-75" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <span>Save Changes</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
