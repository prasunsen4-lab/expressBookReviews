const express = require('express');
let books = require("./booksdb.js"); // preloaded book data
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!users.find(user => user.username === username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
  res.json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
  res.json(filteredBooks);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;