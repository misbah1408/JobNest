// profileSchema.ts
import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  username: z.string().min(2, "Username is too short"),
  role: z.enum(['job_seeker', 'employer']),
  image:z.any()
});

