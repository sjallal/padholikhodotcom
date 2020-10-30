const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");

const Author = require("../models/Author");
const Book = require("../models/Book");

exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    console.log(authors);
    res.status(200).send(authors);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server error." });
  }
};
exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findOne({ _id: req.params.authorId });
    console.log(author);
    res.status(200).send(author);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error." });
  }
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let author = await Author.findOne({ email });
    if (author) {
      return res.status(400).json({ msg: "Author already exists." });
    }

    author = new Author({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    author.password = await bcrypt.hash(author.password, salt);

    console.log(author);
    await author.save();

    const payload = {
      author: {
        id: author._id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, author });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
  }
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let author = await Author.findOne({ email });

    if (!author) {
      res.status(400).json({ msg: "User doesn't exists." });
    }

    const isMatch = bcrypt.compare(password, author.password);
    if (!isMatch) {
      res.status(400).json({ msg: "Password didn't matched." });
    }

    const payload = {
      author: {
        id: author._id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, author });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.updateAuthor = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newAuthor = {
      name,
      email,
    };
    const author = await Author.findOneAndUpdate(
      { _id: req.author.id },
      { $set: newAuthor },
      { new: true }
    );
    console.log(author);
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    await Book.deleteMany({ author: req.author.id });
    await Author.findOneAndDelete({ _id: req.author.id });
    res.status(200).json({ msg: "Author and his books deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
