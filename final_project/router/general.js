const express = require("express");
let booksSync = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(booksSync), 1000);
  });
};

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
public_users.get("/", async function (req, res) {
  const books = await getBooks();
  return res.json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const books = await getBooks();
  const book = books[req.params.isbn];
  if (book) {
    return res.json(book);
  } else {
    return res.sendStatus(404);
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const books = await getBooks();
  const ret = {};
  Object.keys(books).forEach((key) => {
    if (books[key].author === req.params.author) {
      ret[key] = books[key];
    }
  });
  return res.json(ret);
});

// Get all booksSync based on title
public_users.get("/title/:title", async function (req, res) {
  const books = await getBooks();
  const ret = {};
  Object.keys(books).forEach((key) => {
    if (books[key].title === req.params.title) {
      ret[key] = books[key];
    }
  });
  return res.json(ret);
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const books = await getBooks();
  const book = books[req.params.isbn];
  if (book) {
    return res.json(book.reviews);
  } else {
    return res.sendStatus(404);
  }
});

module.exports.general = public_users;
