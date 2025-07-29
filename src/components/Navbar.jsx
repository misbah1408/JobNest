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

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { setTheme } = useTheme();
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
    <nav className="p-3 w-full fixed top-0 bg-transparent flex justify-center z-10">
      <div className="md:w-[95%] w-full text-black dark:text-white bg-white/10 backdrop-blur-md md:rounded-full p-2 shadow-lg">
        <div className="mx-auto flex justify-around items-center">
          {/* Logo */}
          <Link href="/dashboard">
            <div className="flex items-center">
              <Image src={logo} alt="Logo" className="h-16 w-16" />
              <span className="font-bold hidden md:block">JobNest</span>
            </div>
          </Link>
          <div className="hidden md:flex text-white">
            <Link href={primaryLink}>
              <Button
                variant="link"
                className={"text-black text-lg dark:text-white"}
              >
                {primaryLabel}
              </Button>
            </Link>
            <Link href={secondaryLink}>
              <Button
                variant="link"
                className={"text-black text-lg dark:text-white"}
              >
                {secondaryLabel}
              </Button>
            </Link>
          </div>
          <div className="w-max flex cursor-pointer gap-5">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={"rounded-full"}
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Menubar className={"rounded-full p-0 bg-transparent"}>
              <MenubarMenu
                className={
                  "rounded-full transition duration-150 ease-in-out bg-white/10 backdrop-blur-md border border-white/20 data-[state=open]:bg-transparent/20 active:"
                }
              >
                <MenubarTrigger className="p-0 bg-transparent rounded-full">
                  <Avatar className="w-10 h-10">
                    {user?.image && (
                      // <AvatarImage src={user?.image} alt="profile" />
                      <Image src={user?.image}  height={40} width={40} alt="profile"/>
                      
                    )}
                    <AvatarFallback>
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </MenubarTrigger>
                <MenubarContent>
                  <Link href={`/dashboard/profile/${user?.username}`}>
                    <MenubarItem>View Profile</MenubarItem>
                  </Link>

                  <MenubarSeparator className={"md:hidden"}/>
                  <Link href={isJobSeeker ? `/dashboard/jobs` :  `/dashboard/post-job`} className="md:hidden">
                    <MenubarItem>{isJobSeeker ? "Jobs" : "Post a Job"}</MenubarItem>
                  </Link>
                  <Link href={isJobSeeker ? `/dashboard/my-applications` : `/dashboard/employer`} className="md:hidden">
                    <MenubarItem>{isJobSeeker ? "My Applications":"Employer Dashboard"}</MenubarItem>
                  </Link>
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
