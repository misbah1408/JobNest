"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schema/signUpSchema";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { bgGrad } from "@/lib/utils";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });
  const checkUsernameUnique = async (username) => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage(""); // Reset message
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        console.log(response);

        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };
  useEffect(() => {
    const interval = setTimeout(() => {
      checkUsernameUnique(username);
    }, 300);
    return () => clearInterval(interval);
  }, [username]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);

      toast.success(response.data.message);

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);

      const axiosError = error;

      toast.error("Sign Up Failed", {
        description: axiosError.response?.data.message,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex w-full max-w-4xl z-10 relative overflow-hidden">
        <div
          style={bgGrad}
          className="hidden w-1/2 p-3 relative text-white md:flex rounded-l-4xl"
        >
          <div className="w-full m-10 z-10 flex flex-col gap-5">
            <Link href="/dashboard">
              <Image
                src="/logo.png"
                alt="JobNest Logo"
                height={120}
                width={120}
              />
            </Link>

            <h2 className="text-4xl font-semibold text-white">
              Register with Huminex Today
            </h2>

            <p className="text-lg text-white opacity-80">
              Join India's top AI-powered talent network to find your dream job
              or hire top talent effortlessly with Huminex.
            </p>
          </div>
        </div>
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-r-4xl border border-gray-200 dark:bg-black dark:border-gray-800">
          <div className="text-left">
            <h1 className="text-4xl font-bold tracking-tight lg:text-2xl">
              Register
            </h1>
            <h3 className="text-lg opacity-80 ">
              Get started with your account
            </h3>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-sm ${
                          usernameMessage === "Username is unique"
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
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <Input {...field} name="text" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} name="email" />
                    <p className="text-slate-400 text-sm">
                      We will send you a verification code
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...field} name="password" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member?
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 m-0">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="shrink-0">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <div className="w-max h-max m-auto  mt-5 cursor-pointer  content-center  flex justify-center">
            {/* <GoogleButton onClick={() => signIn("google")} /> */}
            <button
              onClick={() => signIn("google")}
              className="whitespace-nowrap gap-x-4 rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-11 px-4 py-2 has-[>svg]:px-3 w-full flex items-center justify-center gap-2"
            >
              <svg
                width="800px"
                height="800px"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285F4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34A853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  fill="#FBBC05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#EB4335"
                />
              </svg>
              <span className="ml-2">Google</span>
            </button>
          </div>
          <p className="text-center mt-1">
            By Register you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}
