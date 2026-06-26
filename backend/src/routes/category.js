'use strict';
const express = require('express');
const router = express.Router();
const { getCategoryById, getAllCategories, createCategory, updateCategory } = require('../controllers/categoryController');
router.get('/:id', getCategoryById);
router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
module.exports = router;
