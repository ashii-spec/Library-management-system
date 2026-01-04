const express = require('express');
const mongoose = require('mongoose');
const Book = require('./Book'); // This connects to the file you just made

const app = express();
app.use(express.json()); // This allows the server to read data you send from Postman

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/libraryDB')
    .then(() => console.log("Success: Connected to MongoDB"))
    .catch(err => console.log("Error: Could not connect to MongoDB", err));

// --- TASK: CREATE (Insert Books) ---
app.post('/books', async (req, res) => {
    try {
        const newBooks = await Book.insertMany(req.body);
        res.status(201).json(newBooks);
    } catch (err) {
        res.status(400).json({ error: "Invalid Data" });
    }
});

// --- TASK: READ (All books or filter by year) ---
app.get('/books', async (req, res) => {
    const afterYear = req.query.afterYear;
    let query = {};
    if (afterYear) query.publishedYear = { $gt: parseInt(afterYear) };
    
    const books = await Book.find(query);
    res.json(books);
});

// --- TASK: UPDATE (Change category or copies) ---
app.patch('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (err) {
        res.status(400).json({ error: "Invalid update: " + err.message });
    }
});

// --- TASK: DELETE (Only if copies are 0) ---
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book && book.availableCopies === 0) {
            await Book.findByIdAndDelete(req.params.id);
            res.json({ message: "Book deleted successfully" });
        } else {
            res.status(400).json({ error: "Cannot delete: book still has copies" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));