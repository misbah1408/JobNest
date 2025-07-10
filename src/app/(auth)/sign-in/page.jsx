"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema } from "@/schema/signInSchema";
import Image from "next/image";

export default function SignInForm() {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result.ok) {
      toast.success("Loggded in successfully");
    }

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Login Failed", {
          description: "Incorrect username or password",
        });
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
      return; // Prevent further execution
    }

    if (result?.url && pathname !== "/dashboard") {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex w-full max-w-4xl z-10 relative overflow-hidden ">
        <div
          style={{
            background: `
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='10' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='table' tableValues='0 0'/%3E%3CfeFuncG type='table' tableValues='0 0'/%3E%3CfeFuncB type='table' tableValues='0 0'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E"),
                radial-gradient(circle at 84.593% 18.1395%, #6299f2 0%, transparent 80%),
                #000 radial-gradient(circle at 100% 96.7442%, #5746d9 0%, transparent 80%)
              `,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
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
              Log In to JobNest
            </h2>

            <p className="text-lg text-white opacity-80">
              Log in to your JobNest account to access your dashboard and manage
              your job applications, interview schedules, and more.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 max-w-md p-8 space-y-8 bg-white  border border-gray-200 rounded-r-4xl">
          <div className="text-left">
            <h1 className="text-4xl font-bold tracking-tight lg:text-2xl mb-2">
              Log In
            </h1>
            <h3 className="text-lg opacity-80 ">
              Welcome Back to your account
            </h3>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} />
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
                    <Input type="password" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Sign In
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Not a member yet?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
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
              className="whitespace-nowrap rounded-full gap-x-4 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-11 px-4 py-2 has-[>svg]:px-3 w-full flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="size-6"
                width="1em"
                height="1em"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l6.039-6.039C34.046,6.053,29.268,4,24,4
                c-11.045,0-20,8.955-20,20s8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
                c3.059,0,5.842,1.154,7.961,3.039l6.039-6.039C34.046,6.053,29.268,4,24,4
                C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.215-5.091C29.211,35.091,26.715,36,24,36
                c-5.037,0-9.341-3.105-11.299-7.524l-6.57,5.061C9.65,39.67,16.319,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                c0.001-0.001,0.002-0.001,0.003-0.002l6.215,5.091C39.597,35.747,44,30.508,44,24
                C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span className="ml-2">Google</span>
            </button>
          </div>
          <p className="text-center mt-1">
            By Log In you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}
