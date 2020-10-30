const { validationResult } = require("express-validator");
const Author = require("../models/Author");

const Book = require("../models/Book");

exports.getBooks = async (req, res) => {
  try {
    // const books = await Book.find();
    const books = await Book.find().populate({
      path: "author",
      select: "name email",
    });
    console.log(books);
    res.status(200).send(books);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server error." });
  }
};
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.bookId });
    console.log(book);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error." });
  }
};

exports.createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description } = req.body;

  try {
    const newBook = new Book({
      title,
      description,
      author: req.author.id,
    });

    // update: author's written books array.
    let author = await Author.findById(req.author.id);
    author.booksWritten.unshift(newBook._id);

    await author.save();
    await newBook.save();
    console.log(newBook, author);
    res.status(200).json({ newBook, author });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server error." });
  }
};

exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.bookId);
    // console.log(book);
    // console.log(req.author.id.toString());
    // console.log(book.author.toString());
    if (book.author.toString() !== req.author.id.toString()) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const { title, description } = req.body;
    const newBook = {
      title,
      description,
    };
    book = await Book.findOneAndUpdate(
      { _id: req.params.bookId },
      { $set: newBook },
      { new: true }
    );
    console.log(book);
    res.status(200).json({ book });
  } catch (error) {
    // console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ error: "The book was not found." });
    }
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    const author = await Author.findById(req.author.id);
    if (!book) return res.status(500).json({ error: "Book not found." });
    console.log(book.author);
    console.log(author._id);
    if (book.author.toString() !== author._id.toString())
      return res.status(401).json({ error: "Access denied." });
    const removeIndex = author.booksWritten
      .map((bookId) => bookId.toString())
      .indexOf(book._id);
    author.booksWritten.splice(removeIndex, 1);
    await author.save();
    await book.remove();
    res.json({ msg: "Book removed.", author });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
