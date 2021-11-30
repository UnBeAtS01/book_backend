const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/authMiddleware.js');
const bookRouter = express.Router();

//create Book

bookRouter.post('/', expressAsyncHandler(async (req, res) => {
    const book = await Book.create(req.body);

    if (book) {
        res.status(200);
        res.json(book);
    }
    else {
        res.status(500);
        throw new Error('book creation failed');
    }
}))

bookRouter.get('/', expressAsyncHandler(async (req, res) => {
    const book = await Book.find({});
    if (book) {
        res.status(200);
        res.json(book);
    }
    else {
        res.status(500);
        throw new Error('no book availabel');
    }
}))

bookRouter.put('/:id', authMiddleware, expressAsyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
        const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200);
        res.json(updateBook);
    }
    else {
        res.status(500);
        throw new Error('update failed');
    }
}))
bookRouter.delete('/:id', authMiddleware, expressAsyncHandler(async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        res.status(200);
        res.send(book);
    } catch (error) {
        res.send(error);
    }
}))
module.exports = bookRouter;