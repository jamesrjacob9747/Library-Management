'use strict';

const express = require('express');
const router = express.Router();
const { booksNeverBorrowed, outstandingBooks, topBorrowedBooks } = require('../controllers/analyticsController');

router.get('/books-never-borrowed', booksNeverBorrowed);
router.get('/outstanding-books', outstandingBooks);
router.get('/top-borrowed-books', topBorrowedBooks);

module.exports = router;
