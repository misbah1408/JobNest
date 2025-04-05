// ProfileCard.jsx
import React, { useEffect, useState } from "react";
import { Verified } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import EditProfile from "./EditProfile";
import Image from "next/image";

const ProfileCard = ({ data }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentUserValid, setCurrentUserValid] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const { email, isVerified, name, role, username, _id, image } = data || {};
  // console.log(image);
  
  useEffect(() => {
    if (user?._id === data?._id) {
      setCurrentUserValid(true);
    } else {
      setCurrentUserValid(false);
    }
  }, [user, data]);

  if (!data) {
    return (
      <div className="flex flex-col gap-4 p-6 w-full max-w-md mx-auto">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-10 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-lg">
        
        <Avatar className="h-28 w-28 border-4 border-gray-100 shadow-sm">
          <AvatarImage src={image} className="object-cover" />
          <AvatarFallback className="bg-gray-100 text-gray-500">
          <Image src="https://github.com/shadcn.png" className="object-cover" width={112} height={112} alt={`${username} avatar`}/>
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800">
            <span>{name}</span>
            {isVerified && <Verified className="text-blue-500" />}
          </div>
          <p className="text-sm text-gray-500">@{username}</p>
          <p className="text-sm text-gray-500 mt-1">{email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            Role: {role === "job_seeker" ? "Job seeker" : "Employer"}
          </span>
        </div>
        {currentUserValid && (
            <div className="absolute top-2 right-2 p-3 flex justify-center rounded-full hover:bg-gray-100 transition-colors bg-white">
                <EditProfile isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} data={data}/>
            </div>
        )}
        <div>
            <span>Add resume</span>
        </div>
        {/* <Image src={image} height={100} width={100} alt="rwer"/>
        <Image src={getImageUrl("next-cloudinary-uploads/ixqgelcpbh1zmaymhdrx")} alt="rhb " height={100} width={100}/> */}
      </div>
    </>
  );
};

export default ProfileCard;