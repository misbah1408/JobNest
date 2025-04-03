import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["job_seeker", "employer"],
    default: "job_seeker",
    required: true,
  },
  resume: {
    type: String,
  },
  verifyCode: {
    type: String,
  },
  provider:{
    type:String,
    default: "credentials"
  },
  verifyCodeExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  image:{
    type:String,
  }
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
