'use client'

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { bgGrad } from "@/lib/utils";

const Nav = () => {
    const { data: session } = useSession();
  return (
    <nav className="p-3 w-full fixed top-0 bg-transparent flex justify-center">
          <div className="w-[95%] text-white bg-white/10 backdrop-blur-md rounded-full p-2 shadow-lg">
            <div className="mx-auto flex justify-around items-center">
              {/* Logo */}
              <Link href="/dashboard">
                <div className="flex items-center">
                  <Image src={"/logo.png"} alt="Logo" height={64} width={64} />
                  <span className=" hidden md:flex text-xl font-bold">JobNest</span>
                </div>
              </Link>
              <div className="hidden md:flex text-white">
                <Link href={"#features"}>
                  <Button variant="link" className={"text-white text-lg"}>
                    Features
                  </Button>
                </Link>
                <Link href={"#how-it-works"}>
                  <Button variant="link" className={"text-white text-lg"}>
                    How it Works Blog
                  </Button>
                </Link>
                <Link href={"#blog"}>
                  <Button variant="link" className={"text-white text-lg"}>
                    Blog
                  </Button>
                </Link>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-full bg-[#3a49cc] border-2 border-gray-400 py-5 hover:bg-[#3a417d] cursor-pointer dark:text-white">
                      Book Demo
                    </Button>
                  </DialogTrigger>
                  <DialogTitle className="hidden">Book demo</DialogTitle>
                  <DialogContent className="sm:max-w-[800px] md:max-h-[800px] p-0 overflow-hidden rounded-2xl shadow-lg">
                    <div className="flex w-full max-w-4xl relative z-10">
                      {/* Left side panel with branding */}
                      <div
                        style={bgGrad}
                        className="hidden md:flex w-1/2 p-10 text-white flex-col"
                      >
                        <Image
                          src="/logo.png"
                          alt="JobNest Logo"
                          height={60}
                          width={60}
                        />
                        <h2 className="text-3xl font-bold mt-8">
                          Request a call with our expert
                        </h2>
                        <p className="mt-4 text-lg opacity-80">
                          Our experts are ready to help you realize your vision
                          with personalized solutions for events, product
                          launches, and more.
                        </p>
                      </div>

                      {/* Right side - Form */}
                      <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                          Book a Demo
                        </h2>
                        <form className="flex flex-col gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <Input
                              type="email"
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#3a49cc] focus:border-[#3a49cc] sm:text-sm"
                              placeholder="you@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <Input
                              type="text"
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#3a49cc] focus:border-[#3a49cc] sm:text-sm"
                              placeholder="Your name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              write a message
                            </label>
                            <Textarea
                              required
                              placeholder={"Tell me us little about your project..."}
                              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-[#3a49cc] focus:border-[#3a49cc] sm:text-sm h-[150px] resize-none"
                            />
                          </div>

                          <Button
                            type="submit"
                            className="mt-4 bg-[#3a49cc] hover:bg-[#2e3ab8] text-white font-medium py-2 px-4 rounded-md"
                          >
                            Submit Request
                          </Button>
                        </form>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                {session ? (
                  <Button
                  onClick={() => redirect('/dashboard')}
                    className={
                      "rounded-full bg-[#3a49cc] border-2 border-gray-400 py-5 hover:bg-[#3a417d] cursor-pointer dark:text-white"
                    }
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Link href={"/sign-in"}>
                    <Button
                      className={
                        "rounded-full bg-[#3a49cc] border-2 border-gray-400 py-5 hover:bg-[#3a417d] cursor-pointer dark:text-white"
                      }
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
  )
}

export default Nav