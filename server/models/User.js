const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Hide password by default
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    profileImage: {
      type: String,
      default: "",
    },

    skillsOffered: {
      type: [String],
      default: [],
    },

    skillsWanted: {
      type: [String],
      default: [],
    },

    availability: {
      type: String,
      enum: ["Weekdays", "Weekends", "Evenings", ""],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);