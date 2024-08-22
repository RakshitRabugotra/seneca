"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUp.schema";
import { ApiError } from "next/dist/server/api-utils";
import { Loader2 } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/axios";

const Signup = () => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      //   const fd = new FormData();
      //   fd.append("username", "krrish");
      //   fd.append("email", "krrishk@gmail.com");
      //   fd.append("password", "password12");
      const response = await authClient.post("/register", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      form.reset();
      router.replace(`/login`);
    } catch (error) {
      console.log("error in signup", error);
      const axiosError = error as AxiosError<ApiError>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "SignUp failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-[100svh] px-4 font-body">
        <div className="border-2 dark:custom-border border-gray-200 px-4 py-10 lg:p-10 rounded-md w-full max-w-md shadow-md ">
          <div className=" mb-5 text-center">
            <h1 className="text-3xl mb-1 font-bold">Get Started</h1>

            <p className="text-slate-400">
              Fill out the form below to continue
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="ex: alan_turing" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setPassword(e.target.value);
                          }}
                        />
                        {password &&
                          (showPassword ? (
                            <Eye
                              className="absolute top-2 right-2 p-1 text-gray-500"
                              onClick={togglePasswordVisibility}
                            />
                          ) : (
                            <EyeOff
                              className="absolute top-2 right-2 p-1 text-gray-500"
                              onClick={togglePasswordVisibility}
                            />
                          ))}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                {isSubmitting ? (
                  <Button disabled>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </form>
          </Form>
          <footer className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <Link className="text-blue-500" href={"/login"} replace>
                Login
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Signup;
