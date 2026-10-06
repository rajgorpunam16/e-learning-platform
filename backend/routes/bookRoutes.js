const express = require("express");

const {
  getAllBooks,
  getBookById,
  getFeaturedBooks,
  getGenres,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

/* =========================================================
   FIXED GET ROUTES
   These routes must come before "/:id"
========================================================= */

// GET featured books
// GET /api/books/featured
router.get("/featured", getFeaturedBooks);

// GET genres with book count
// GET /api/books/genres
router.get("/genres", getGenres);

// GET all books
// GET /api/books
router.get("/", getAllBooks);

/* =========================================================
   CREATE ROUTE
========================================================= */

// CREATE a new book
// POST /api/books
router.post("/", createBook);

/* =========================================================
   DYNAMIC ID ROUTES
   Keep these routes at the bottom
========================================================= */

// GET one book by MongoDB ID
// GET /api/books/:id
router.get("/:id", getBookById);

// UPDATE one book by MongoDB ID
// PUT /api/books/:id
router.put("/:id", updateBook);

// DELETE one book by MongoDB ID
// DELETE /api/books/:id
router.delete("/:id", deleteBook);

module.exports = router;