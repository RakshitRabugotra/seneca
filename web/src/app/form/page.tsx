"use client";

import { use, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, markdown2HTML } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { llamaClient } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { sendMessage } from "@/lib/gemini";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { formSchema } from "@/schemas/form.schema";

const items = [
  {
    id: "health insurance",
    label: "Health insurance",
  },
  {
    id: "retirement plans",
    label: "Retirement plans",
  },
  {
    id: "vacation days",
    label: "Vacation days",
  },
  {
    id: "sick leave",
    label: "Sick leave",
  },
] as const;

const loadingStates = [
  {
    text: "Solving world hunger.",
  },
  {
    text: "Finding world peace.",
  },
  {
    text: "Curing all diseases.",
  },
  {
    text: "Ending climate change.",
  },
  {
    text: "Fixing the economy.",
  },
  {
    text: "Achieving global harmony.",
  },
  {
    text: "Inventing teleportation.",
  },
  {
    text: "Making the world a better place.",
  },
];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await form.trigger([
        "fullname",
        "company",
        "jobTitle",
        "joinDate",
      ]);
    } else if (currentStep === 2) {
      isValid = await form.trigger(["salary", "bonus", "benefits"]);
    } else if (currentStep === 3) {
      isValid = await form.trigger(["employmentType", "workLocation"]);
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    const template = `
    Prompt: Create a employment agreemt with details:
    1. Full Name: ${data.fullname}
    2. Company Name: ${data.company}
    3. Job Title: ${data.jobTitle}
    4. Join Date: ${data.joinDate.toISOString().split("T")[0]}
    5. Salary: ${data.salary}
    6. Bonus: ${data.bonus}
    7. Benefits: ${data.benefits.join(", ")}
    8. Employment Type: ${data.employmentType}
    9. Work Location: ${data.workLocation}

    Generate response in markdown
  `;
    try {
      const response = await sendMessage(template);
      let result = "";
      for await (const chunk of response.stream) {
        const chunkText = await chunk.text();
        result += chunkText;
      }
      const res = await markdown2HTML(result);
      localStorage.setItem("styledHtmlContent", res);
      localStorage.setItem("markdown", await result);
      router.push("/result");
      console.log(result);
      toast({
        title: "Success",
      });
    } catch (error) {
      console.log("Error while generating document: ", error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100svh] bg-background font-body m-4 lg:m-0">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md p-6 min-h-[80vh] flex flex-col relative ">
        {/* progress bar code */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          {/* 1 */}
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep >= 1 && <CheckIcon className="w-4 h-4" />}
            </div>
            {currentStep >= 2 && (
              <div className="w-8 h-1 bg-muted-foreground/20" />
            )}
          </div>
          {/* 2 */}
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep >= 2 && <CheckIcon className="w-4 h-4" />}
            </div>
            {currentStep >= 3 && (
              <div className="w-8 h-1 bg-muted-foreground/20" />
            )}
          </div>
          {/* 3 */}
          <div className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep >= 3 && <CheckIcon className="w-4 h-4" />}
            </div>
            {currentStep >= 4 && (
              <div className="w-8 h-1 bg-muted-foreground/20" />
            )}
          </div>
        </div>

        {/* form code */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
            className="space-y-8"
          >
            {currentStep === 1 && (
              <div className="flex flex-col justify-between">
                <div className="space-y-5 mb-4">
                  <h2 className="text-2xl font-bold">
                    Step 1: Personal Information
                  </h2>
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fullname</FormLabel>
                        <FormControl>
                          <Input placeholder="Elon Musk" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="google" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job title</FormLabel>
                        <FormControl>
                          <Input placeholder="Web Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="joinDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[50%] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value &&
                                !isNaN(new Date(field.value).getTime()) ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end absolute bottom-4 right-4">
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="flex flex-col justify-between">
                <div className="space-y-4  mb-4 ">
                  <h2 className="text-2xl font-bold">
                    Step 2: Compensation and benefits
                  </h2>
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="40000"
                            type="number"
                            className="no-spinner"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bonus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bonus</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="5000"
                            type="number"
                            className="no-spinner"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="benefits"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Benefits</FormLabel>
                        </div>
                        {items.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="benefits"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={
                                        Array.isArray(field.value) &&
                                        field.value.includes(item.id)
                                      }
                                      onCheckedChange={(checked) => {
                                        const valueArray = Array.isArray(
                                          field.value
                                        )
                                          ? field.value
                                          : [];
                                        return checked
                                          ? field.onChange([
                                              ...valueArray,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              valueArray.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <label>{item.label}</label>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between absolute bottom-4 right-4">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex flex-col justify-between">
                <div className="space-y-4  mb-4">
                  <h2 className="text-2xl font-bold">
                    Step 3: Employment Terms
                  </h2>

                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Word Schedule</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="full-time" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Full time
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="part-time" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Part Time
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="contract" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Contract
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workLocation"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Word Location</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="remote" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Remote
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="office" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Office
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="hybrid" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Hybrid
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between absolute bottom-4 right-4">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
