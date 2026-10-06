const mongoose = require("mongoose");

const courseModuleSchema = new mongoose.Schema(
  {
    moduleTitle: {
      type: String,
      required: true,
      trim: true,
    },

    lessons: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    _id: true,
  }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortTitle: {
      type: String,
      default: "",
      trim: true,
    },

    instructor: {
      type: String,
      default: "DVOC Faculty",
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    longDescription: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Professional",
        "All Levels",
      ],
      default: "Beginner",
    },

    duration: {
      type: String,
      default: "",
    },

    lessons: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    students: {
      type: Number,
      default: 0,
      min: 0,
    },

    badge: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    certificate: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],

    modules: [courseModuleSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);