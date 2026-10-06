const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Book = require("../models/Book");
const Category = require("../models/Category");
const Chapter = require("../models/Chapter");

router.get("/", async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalChapters = await Chapter.countDocuments();
    const totalUsers = await User.countDocuments();

    const books = await Book.find().sort({ createdAt: -1 });
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-password")
      .limit(5);

    const totalViews = books.reduce(
      (sum, book) => sum + Number(book.views || 0),
      0
    );

    const categoryMap = {};

    books.forEach((book) => {
      const category = book.category || book.genre || "Uncategorized";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categoryChart = Object.keys(categoryMap).map((name) => ({
      name,
      books: categoryMap[name],
    }));

    res.json({
      totalBooks,
      totalCategories,
      totalChapters,
      totalUsers,
      totalViews,
      recentBooks: books.slice(0, 5),
      recentUsers: users,
      categoryChart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Dashboard data fetch failed",
      error: error.message,
    });
  }
});

module.exports = router;