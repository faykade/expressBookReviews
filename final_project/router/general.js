const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res
    .status(404)
    .json({ message: "Unable to register user, missing information." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if (book) {
    return res.json(book);
  } else {
    return res.sendStatus(404);
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const ret = {};
  Object.keys(books).forEach((key) => {
    if (books[key].author === req.params.author) {
      ret[key] = books[key];
    }
  });
  return res.json(ret);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const ret = {};
  Object.keys(books).forEach((key) => {
    if (books[key].title === req.params.title) {
      ret[key] = books[key];
    }
  });
  return res.json(ret);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res.json(book.reviews);
  } else {
    return res.sendStatus(404);
  }
});

module.exports.general = public_users;
