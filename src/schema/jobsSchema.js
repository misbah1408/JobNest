const { z } = require("zod");

export const jobSchema = z.object({
    title: z.string().min(2, "Title is required"),
    company: z.string().min(2, "Company is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    jobType: z.string().min(2, "Job type is required"),
    location: z.string().min(2, "Location is required"),
    salary: z.string(),
    postedby: z.string()
  });