"use client";

import Link from "next/link";
import { useState } from "react";
import logo from "../../public/logo.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import {
  LogOut,
  UserRound,
} from "lucide-react";
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
    <nav className="bg-white p-3 shadow-lg ">
      <div className="mx-auto flex justify-around items-center">
        {/* Logo */}
        <Link href="/dashboard">
          <Image src={logo} alt="Logo" className="h-16 w-16" />
        </Link>
        <div className="hidden md:flex">
          <Link href={primaryLink}>
            <Button variant="link">{primaryLabel}</Button>
          </Link>
          <Link href={secondaryLink}>
            <Button variant="link">{secondaryLabel}</Button>
          </Link>
        </div>
        <div className="w-max flex flex-col cursor-pointer ">
          <Menubar className={"rounded-full p-0 bg-white"}>
            <MenubarMenu className={"rounded-full bg-white"}>
              <MenubarTrigger className={"p-0"}>
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user?.picture}
                    className={"cursor-pointer"}
                  />
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
    </nav>
  );
};

export default Navbar;
