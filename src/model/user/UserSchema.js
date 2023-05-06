import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
        type: String,
        required: true,
      },

    email: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user_client", userSchema);