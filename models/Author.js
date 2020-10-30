const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  booksWritten: [
    {
      type: mongoose.Types.ObjectId,
      ref: "book",
    },
  ],
});

module.exports = new mongoose.model("author", AuthorSchema);
