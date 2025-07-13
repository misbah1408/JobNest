import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: String,
    required: false,
    default: "Not disclosed",
    trim: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["Full-time", "Part-time", "Remote", "Internship"],
  },
  skills: {
    type: [String],
    required: true,
    validate: {
      validator: function(skills) {
        return skills && skills.length > 0;
      },
      message: 'At least one skill must be specified'
    }
  },
  jobStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  expiryDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  interviewDuration: {
    type: String,
    required: true,
    enum: ["5m", "10m", "15m", "30m", "60m"],
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
  applications: {
    type: Number,
    default: 0,
  },
  // Additional useful fields
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  views: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
JobSchema.index({ jobTitle: 'text', jobDescription: 'text', companyName: 'text' });
JobSchema.index({ location: 1 });
JobSchema.index({ jobType: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ postedBy: 1 });
JobSchema.index({ expiryDate: 1 });
JobSchema.index({ isActive: 1 });
JobSchema.index({ createdAt: -1 });

// Virtual for checking if job is expired
JobSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Pre-save middleware to auto-deactivate expired jobs
JobSchema.pre('save', function(next) {
  if (this.expiryDate < new Date()) {
    this.isActive = false;
    this.jobStatus = false;
  }
  next();
});

// Static method to find active jobs
JobSchema.statics.findActiveJobs = function() {
  return this.find({
    isActive: true,
    jobStatus: true,
    expiryDate: { $gt: new Date() }
  });
};

// Instance method to increment views
JobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to add applicant
JobSchema.methods.addApplicant = function(userId) {
  if (!this.applicants.includes(userId)) {
    this.applicants.push(userId);
    this.applications += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

const JobModel = mongoose.models.Job || mongoose.model("Job", JobSchema);
export default JobModel;