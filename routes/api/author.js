const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getAuthors,
  getAuthorById,
  signup,
  signin,
  deleteAuthor,
  updateAuthor,
} = require("../../controllers/author");
const { isLoggedIn } = require("../../middleware/isLoggedIn");

router.get("/", getAuthors);
router.get("/:authorId", getAuthorById);

router.post(
  "/signup",
  [
    check("name", "Name is required.").not().isEmpty(),
    check("email", "Please provide a valid e-mail.").isEmail(),
    check("password", "Enter a valid password(4-digits).").isLength({ min: 4 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "Please provide a valid e=mail.").isEmail(),
    check("password", "Enter a valid password(4-digits).").isLength({ min: 4 }),
  ],
  signin
);

router.put("/update", isLoggedIn, updateAuthor);

router.delete("/delete", isLoggedIn, deleteAuthor);

module.exports = router;
