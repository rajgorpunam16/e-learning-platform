const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
    image: {
  type: String,
  default: "",
}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);