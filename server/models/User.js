const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ---------------- Basic Details ----------------
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
      select: false,
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

    year: {
      type: String,
      default: "",
    },

    // ---------------- Profile ----------------

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    profileImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
    },

    // ---------------- Skills ----------------

    skillsOffered: {
      type: [String],
      default: [],
    },

    skillsWanted: {
      type: [String],
      default: [],
    },

    experience: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
    },
    // ---------------- Availability ----------------

    availability: {
      type: String,
      enum: ["Weekdays", "Weekends", "Evenings", ""],
      default: "",
    },

    experience: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", ""],
      default: "Beginner",
    },

    // ---------------- Rating ----------------

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    completedSwaps: {
      type: Number,
      default: 0,
    },

    // ---------------- Achievements ----------------

    achievements: {
      type: [String],
      default: [],
    },

    // ---------------- Social Links ----------------

    socials: {
      github: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      portfolio: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);