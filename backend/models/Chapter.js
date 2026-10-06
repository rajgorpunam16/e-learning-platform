const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 1,
    },

    freePreview: {
      type: Boolean,
      default: false,
    },
    duration: {
  type: String,
  default: "",
},

active: {
  type: Boolean,
  default: true,
},
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chapter", chapterSchema);