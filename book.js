const mongoose = require('mongoose');

// This is the Schema (the structure) required by your intern task
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    availableCopies: { 
        type: Number, 
        required: true, 
        min: [0, 'Cannot have negative copies'] // Error Handling: Prevention
    }
});

module.exports = mongoose.model('Book', bookSchema);