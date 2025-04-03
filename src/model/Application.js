import mongoose, { Schema } from "mongoose";

const ApplicationSchema = new Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job", 
    required: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
  },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending", 
    required: true,
  },
  resumeUrl: { 
    type: String, 
    required: true,
  },
  coverLetter: { 
    type: String, 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  employerNotes: { 
    type: String,
  },
});

const ApplicationModel = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export default ApplicationModel;
