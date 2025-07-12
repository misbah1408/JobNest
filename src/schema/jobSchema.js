import { z } from "zod";

export const jobSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  skills: z.array(z.string()).nonempty("At least one skill is required"),
  location: z.string().min(1, "Location is required"),
  salary: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || /^\$\d{1,3}(,\d{3})*(\.\d{2})?\s*-\s*\$\d{1,3}(,\d{3})*(\.\d{2})?$/.test(val),
      {
        message: "Salary must be like $80,000 - $100,000",
      }
    ),
  expiryDate: z.string().min(1, "Expiry date is required"),
  interviewDuration: z.string().min(1, "Interview duration is required"),
  jobStatus: z.boolean(),
  jobDescription: z.string().min(1, "Job description is required"),
});
