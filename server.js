const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Book Schema
const bookSchema = new mongoose.Schema({
    bookName: String,
    author: String,
    genre: String,
    date: Date
});
const Book = mongoose.model('Book', bookSchema);

// GET: Display books
app.get('/', async (req, res) => {
    const books = await Book.find({});
    res.render('index', { books: books });
});

// POST: Add a new book
app.post('/add-book', async (req, res) => {
    const { bookName, author, genre, date } = req.body;
    const newBook = new Book({ bookName, author, genre, date });
    await newBook.save();
    res.redirect('/');
});

// POST: Remove a book
app.post('/remove-book', async (req, res) => {
    const { bookId } = req.body;
    await Book.findByIdAndDelete(bookId);
    res.redirect('/');
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
