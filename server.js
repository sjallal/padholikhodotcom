const express = require("express");
const app = express();

const connectDB = require("./config/db");

PORT = 8080;

app.use(express.json({ extended: false })); // init middleware.

connectDB();

app.get("/", (req, res) => {
  res.send("API is running!!!");
});

// define routes
app.use("/api/authors", require("./routes/api/author"));
app.use("/api/books", require("./routes/api/book"));

app.listen(PORT, () => {
  console.log(`API is running ar port ${PORT}`);
});
