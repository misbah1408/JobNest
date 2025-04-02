'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { verifySchema } from '@/schema/verifySchema';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams();
  const [searchParams] = useSearchParams();
  console.log(params.username);
  
  let otp;
  if(searchParams){
    otp = searchParams[1]
  }
  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues:{
      verifyCode: otp || ""
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.verifyCode,
      });
      console.log(response);
      
      toast('Success',{
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error;
      toast('Verification Failed',{
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}