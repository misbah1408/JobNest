// ProfileCard.jsx
import React, { useEffect, useState } from "react";
import { StarsIcon, Upload, Verified } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import EditProfile from "./EditProfile";
import { bgGrad } from "@/lib/utils";
import { Button } from "./ui/button";
import ProbileTabs from "./ProbileTabs";
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";

const ProfileCard = ({ data }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserValid, setCurrentUserValid] = useState(false);
  const [profileImg, setProfileImg] = useState();
  const { data: session } = useSession();
  const user = session?.user;

  const { email, isVerified, name, role, username, image } = data || {};
  const handleUploadResume = async () => {
    try {
      // Open file picker
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf"; // allowed resume formats

      input.onchange = async (e) => {
        const target = e.target;
        if (!target.files || target.files.length === 0) return;

        const file = target.files[0];
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post("/api/upload-file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const resumeUrl = uploadRes?.data?.secure_url
        console.log(resumeUrl);

        const extractedData = await axios.post("/api/ai/extract-resume", {resumeUrl})

        console.log(extractedData.data);
        
        if (!uploadRes.ok) toast.error("Upload failed");
        if(extractedData.status == 200){
          setLoading(false);
          toast.success("Extracted Resume Successfully")
        }
        toast.success("Resume processed successfully!");
      };

      input.click();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while uploading the resume.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (data) {
      setProfileImg(data.image);
      setCurrentUserValid(user?._id === data?._id);
    }
  }, [user, data]);

  if (!user || !data) {
    return (
      <div className="flex flex-col gap-4 p-6 w-full max-w-lg mx-auto">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-10 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mt-28 grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 lg:px-12">
      <div className="relative lg:col-span-2 rounded-2xl space-y-3">
        <div
          className="relative flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-xl"
          style={bgGrad}
        >
          <Avatar
            className="h-28 w-28 border-4 border-white shadow-lg cursor-pointer"
            onClick={() => setIsEditOpen(true)}
          >
            {/* <AvatarImage
              src={profileImg || "https://github.com/shadcn.png"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://github.com/shadcn.png";
              }}
              className="object-cover"
              /> */}
            <Image src={profileImg || "https://github.com/shadcn.png"} height={112} width={112} alt="profile" />
            {/* <AvatarImage></AvatarImage> */}
            {/* <AvatarFallback className="bg-gray-200 text-gray-600 text-xl">
              {name?.charAt(0)}
            </AvatarFallback> */}
          </Avatar>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-2xl font-semibold text-white">
              <span>{name}</span>
              {isVerified && <Verified className="text-blue-400" />}
            </div>
            <p className="text-sm text-gray-200">@{username}</p>
            <p className="text-sm text-gray-200 mt-1">{email}</p>
            <span className="inline-block mt-3 px-4 py-1.5 text-xs font-medium rounded-full bg-white text-gray-700 shadow-sm">
              {role === "job_seeker" ? "Job Seeker" : "Employer"}
            </span>
          </div>
          {currentUserValid && (
            <div className="absolute top-4 right-4">
              <EditProfile
                isEditOpen={isEditOpen}
                setIsEditOpen={setIsEditOpen}
                data={data}
              />
            </div>
          )}
        </div>

        <div className="w-full">
          <ProbileTabs />
        </div>
      </div>

      {/* Resume Extractor Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center max-h-fit">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          AI Resume Extractor
        </h3>
        <StarsIcon size={80} className="mt-4 text-indigo-400 fill-indigo-200" />
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Upload your resume and let AI fill in your details automatically.
        </p>
        <Button
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow"
          onClick={(e)=>handleUploadResume(e)}
          disabled={loading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {loading ? "Uploading..." : "Upload Resume"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
