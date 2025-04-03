import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
    default: "Not disclosed",
  },
  jobType:{
    type:String,
    required:true,
    enum:["Full-time", "Part-time", "Remote", "Internship"]
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const JobModel = mongoose.models.Job || mongoose.model("Job", JobSchema);
export default JobModel;