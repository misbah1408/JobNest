"use client";

import Link from "next/link";
import { useState } from "react";
import logo from "../../public/logo.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  // console.log(user);
  const isJobSeeker = user?.role === "job_seeker";

  const primaryLink = isJobSeeker ? "/dashboard/jobs" : "/dashboard/post-job";
  const primaryLabel = isJobSeeker ? "Jobs" : "Post a Job";

  const secondaryLink = isJobSeeker
    ? "/dashboard/my-applications"
    : "/dashboard/employer";
  const secondaryLabel = isJobSeeker ? "My Applications" : "Employer Dashboard";

  return (
    <nav className="p-3 w-full fixed top-0 bg-transparent flex justify-center">
      <div className="w-[95%] text-white bg-white/10 backdrop-blur-md rounded-full p-2 shadow-lg">
        <div className="mx-auto flex justify-around items-center">
          {/* Logo */}
          <Link href="/dashboard">
          <div className="flex items-center">
            <Image src={logo} alt="Logo" className="h-16 w-16" />
            <span className="text-xl font-bold">JobNest</span>
          </div>
          </Link>
          <div className="hidden md:flex text-white">
            <Link href={primaryLink}>
              <Button variant="link" className={"text-white text-lg"}>{primaryLabel}</Button>
            </Link>
            <Link href={secondaryLink}>
              <Button variant="link" className={"text-white text-lg"}>{secondaryLabel}</Button>
            </Link>
          </div>
          <div className="w-max flex flex-col cursor-pointer ">
            <Menubar className={"rounded-full p-0 bg-transparent"}>
              <MenubarMenu className={"rounded-full transition duration-150 ease-in-out bg-white/10 backdrop-blur-md border border-white/20 data-[state=open]:bg-transparent/20 active:"} >
                <MenubarTrigger className="p-0 bg-transparent">
                  <Avatar className="w-10 h-10">
                    {user?.picture && (
                      <AvatarImage src={user.picture} alt="profile" />
                    )}
                    <AvatarFallback>
                      <UserRound />
                    </AvatarFallback>
                  </Avatar>
                </MenubarTrigger>
                <MenubarContent>
                  <Link href={`/dashboard/profile/${user?.username}`}>
                    <MenubarItem>View Profile</MenubarItem>
                  </Link>

                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => signOut()}>
                    Sign out <LogOut size={16} />
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
