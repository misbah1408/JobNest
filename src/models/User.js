import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["job_seeker", "employer"],
    default: "job_seeker",
    required:true
  },
  resume: {
    type: String
  },
});


const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;