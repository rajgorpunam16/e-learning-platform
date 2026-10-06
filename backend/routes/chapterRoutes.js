const express = require("express");

const {
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
} = require("../controllers/chapterController");

const router = express.Router();

router.get("/", getChapters);
router.post("/", createChapter);
router.put("/:id", updateChapter);
router.delete("/:id", deleteChapter);

module.exports = router;