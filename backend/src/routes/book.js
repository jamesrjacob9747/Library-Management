'use strict';

const express = require('express');
const router = express.Router();
const { getBookById, getAllBooks, createBook, updateBook } = require('../controllers/bookController');

router.get('/:id', getBookById);
router.get('/', getAllBooks);
router.post('/', createBook);
router.put('/:id', updateBook);

module.exports = router;
