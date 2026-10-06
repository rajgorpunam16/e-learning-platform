const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    moduleTitle: {
      type: String,
      required: true,
    },

    lessons: [
      {
        type: String,
      },
    ],
  },
  {
    _id: true,
  }
);

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortTitle: {
      type: String,
      trim: true,
      default: "",
    },

    instructor: {
      type: String,
      default: "DVOC Faculty",
      trim: true,
    },

    // Temporary compatibility with the old BookHive code
    author: {
      type: String,
      default: "DVOC Faculty",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      default: "Technology",
    },

    description: {
      type: String,
      default: "",
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
      default: "Self-paced",
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

    // Temporary compatibility
    original: {
      type: Number,
      default: 0,
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

    stock: {
      type: Number,
      default: 1,
    },

    image: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    coverUrl: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    learningOutcomes: [
      {
        type: String,
      },
    ],

    modules: [moduleSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);