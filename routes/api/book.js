const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getBooks,
  getBookById,
  createBook,
  deleteBook,
  updateBook,
} = require("../../controllers/book");

const { isLoggedIn } = require("../../middleware/isLoggedIn");

router.get("/", getBooks);
router.get("/:bookId", getBookById);

router.post(
  "/create",
  [
    isLoggedIn,
    [
      check("title", "Title is required.").not().isEmpty(),
      check("description", "Description is required.").not().isEmpty(),
    ],
  ],
  createBook
);

router.put("/update/:bookId", isLoggedIn, updateBook);

router.delete("/delete/:bookId", isLoggedIn, deleteBook);

module.exports = router;
