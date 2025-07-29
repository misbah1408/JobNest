import mongoose, { Schema } from "mongoose";

const EducationSchema = new Schema({
  college_university: { type: String, default: "" },
  graduation_year: { type: String, default: "" },
  field_of_study: { type: String, default: "" },
  degree: { type: String, default: "" },
});

const ProjectSchema = new Schema({
  title: { type: String, default: "" },
  link: { type: String, default: "" },
  description: { type: String, default: "" },
  technologies: [{ type: String }],
});

const WorkExperienceSchema = new Schema({
  job_title: { type: String, default: "" },
  company: { type: String, default: "" },
  duration: { type: String, default: "" },
  responsibilities: { type: String, default: "" },
});

const PersonalSchema = new Schema({
  tagline: { type: String, default: "" },
  about: { type: String, default: "" },
  email: { type: String, default: "" },
  state: { type: String, default: "" },
  skills: [{ type: String }],
});

const ResumeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeUrl: { type: String, required: true },
  personal: { type: PersonalSchema, default: {} },
  education: { type: [EducationSchema], default: [] },
  projects: { type: [ProjectSchema], default: [] },
  work_experience: { type: [WorkExperienceSchema], default: [] },
  parsedAt: { type: Date, default: Date.now },
  modelUsed: { type: String, default: "" },
});

const ResumeModel = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);

export default ResumeModel;