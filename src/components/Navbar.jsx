"use client";

import Link from "next/link";
import { useState } from "react";
import logo from "../../public/logo.png";
import Image from "next/image";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./ui/menubar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  // console.log(user);

  return (
    <nav className="bg-white p-3 shadow-lg ">
      <div className="mx-auto flex justify-around items-center">
        {/* Logo */}
        <Link href="/dashboard">
          <Image src={logo} alt="Logo" className="h-16 w-16" />
        </Link>
        <div className="hidden md:flex">
          <Button variant={"link"}>{user?.role ? "Jobs" : "Post a Job"}</Button>
          <Button variant={"link"}>
            {user?.role ? "My Applications" : "Employer Dashboard"}
          </Button>
        </div>
        <div className="w-max flex flex-col cursor-pointer ">
          <Menubar className={"rounded-full p-0 bg-white"}>
            <MenubarMenu className={"rounded-full bg-white"}>
              <MenubarTrigger className={"p-0"}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.picture} className={"cursor-pointer"}/>
                  <AvatarFallback>
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  View Profile
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={()=> signOut()}>Sign out <LogOut size={16} /></MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
