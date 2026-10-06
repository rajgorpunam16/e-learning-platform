const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// =========================
// GET ALL AUTHORS
// =========================
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 });
    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =========================
// GET SINGLE AUTHOR
// =========================
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =========================
// ADD AUTHOR
// =========================
router.post("/", async (req, res) => {
  try {
    const { name, bio, image } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Author name is required",
      });
    }

    const exists = await Author.findOne({ name });

    if (exists) {
      return res.status(400).json({
        message: "Author already exists",
      });
    }

    const author = new Author({
      name,
      bio,
      image,
    });

    await author.save();

    res.status(201).json({
      message: "Author added successfully",
      author,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =========================
// UPDATE AUTHOR
// =========================
router.put("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.status(200).json({
      message: "Author updated successfully",
      author,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =========================
// DELETE AUTHOR
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.status(200).json({
      message: "Author deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;