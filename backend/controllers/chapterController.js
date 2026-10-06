const Chapter = require("../models/Chapter");

const getChapters = async (req, res) => {
  try {
    const filter = {};

    if (req.query.course) {
      filter.course = req.query.course;
    }

    const chapters = await Chapter.find(filter)
      .populate("course", "title")
      .sort({
        order: 1,
      });

    res.json(chapters);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load chapters.",
      error: error.message,
    });
  }
};

const createChapter = async (req, res) => {
  try {
    const chapter = await Chapter.create(req.body);

    res.status(201).json({
      message: "Chapter added successfully.",
      chapter,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add chapter.",
      error: error.message,
    });
  }
};

const updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found.",
      });
    }

    res.json({
      message: "Chapter updated successfully.",
      chapter,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update chapter.",
      error: error.message,
    });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(
      req.params.id
    );

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found.",
      });
    }

    res.json({
      message: "Chapter deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete chapter.",
      error: error.message,
    });
  }
};

module.exports = {
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
};