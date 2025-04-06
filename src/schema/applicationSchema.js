import { z } from "zod";

export const applicationSchema = z.object({
    coverLetter: z.string().min(10, "Cover letter must be at least 10 characters"),
    resumeUrl: z.any(),
  });