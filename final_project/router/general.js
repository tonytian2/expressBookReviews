const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBookByIsbn = (isbn) =>{
  return new Promise((resolve, reject) => {
    if(books[isbn]){
      resolve(books[isbn])
    }else{
      reject(`Book not found by ISBN:${isbn}`)
    }
  })
}

const getBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    let book = Object.values(books).filter((book) => {return book.author === author})
    if(book.length > 0){
      resolve(book);
    }
    else{
      reject(`Book not found under author:${author}`)
    }
  })
}

const getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    let book = Object.values(books).filter((book) => {return book.title === title})
    if(book.length > 0){
      resolve(book);
    }
    else{
      reject(`Book not found with title:${title}`)
    }
  })
}

const getBookReviewByIsbn = (isbn) =>{
  return new Promise((resolve, reject) => {
    if(books[isbn]){
      resolve(books[isbn].review)
    }else{
      reject(`Book not found by ISBN:${isbn}`)
    }
  })
}

public_users.post("/register", (req,res) => {

  const username = req.body.username
  const password = req.body.password

  if(!username || !password){
    res.status(400).send("Username and password are required")
  }
  const user = users.find((user) => user.username === username)
  if(user)
    {return res.status(400).send(`Username ${username} already exists.`)}
  
  users.push({"username": username, "password":password})
  return res.status(200).send("Customer successfully registered. Now you can login.")

}

);

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 600)
  } )
  promise.then( result =>{
    res.status(200).send(JSON.stringify(books,null,4))
  })
  .catch((err) =>{
    res.status(500).send("Something went wrong.")
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  getBookByIsbn(isbn)
  .then(book => {return res.status(200).send(JSON.stringify(book, null, 4))})
  .catch(err => {return res.status(400).send(err)})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  getBookByAuthor(author)
  .then( book => {return res.status(200).send(JSON.stringify(book))})
  .catch(err => {return res.status(400).send(err)})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  getBookByTitle(title)
  .then( book => {return res.status(200).send(JSON.stringify(book))})
  .catch(err => {return res.status(400).send(err)})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  getBookReviewByIsbn(isbn)
  .then(review => {return res.status(200).send(JSON.stringify(review, null, 4))})
  .catch(err => {return res.status(400).send(err)})
 });

module.exports.general = public_users;
