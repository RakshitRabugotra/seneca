import { z } from "zod";

export const formSchema = z.object({
  fullname: z.string().min(2).max(50),
  company: z.string().min(2).max(50),
  jobTitle: z.string().min(2).max(50),
  joinDate: z.date({
    required_error: "Date is required.",
  }),
  salary: z.string().min(2).max(50),
  bonus: z.string().min(2).max(50),
  benefits: z.array(z.string()),
  employmentType: z.enum(["full-time", "part-time", "contract"], {
    required_error: "You need to select.",
  }),
  workLocation: z.enum(["remote", "office", "hybrid"], {
    required_error: "You need to select.",
  }),
});
