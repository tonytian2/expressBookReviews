const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password)
  {return res.status(400).send("Username and password are required.")}
  if(users.find( (user) => {return user.username === username && user.password === password}))
    {
      const accessToken = jwt.sign({"username":username},"mysecret",{"expiresIn": "300s"})
      req.session.authorization = {accessToken}
      return res.status(200).send("Successfully logged in.")
  }
  return res.status(400).send("Wrong username and password combination.")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn]
  const review = req.query.review
  const username = req.username
  if(!review) {return res.status(400).send("No review found")}
  if(!book) {return res.status(400).send(`Book not found by ISBN:${isbn}`)}
  book.reviews[username] = review
  return res.status(200).send(`Review for book "${book.title}" added/updated.`)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.username
  const book = books[isbn]
  if(!book) {return res.status(400).send(`Book not found by ISBN:${isbn}`)}
  delete book.reviews[username] 
  return res.status(200).send(`Review for book "${book.title}" deleted by user "${username}".`)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
