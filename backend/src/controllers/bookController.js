'use strict';

const { Op } = require('sequelize');
const Book = require('../models/Book');
const { getPagination, paginatedResponse } = require('../utils/pagination');

// GET /book/:id
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

// GET /book
const getAllBooks = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const search = req.query.search;

    const whereClause = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { author: { [Op.iLike]: `%${search}%` } },
            { isbn: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json(paginatedResponse(rows, count, page, limit));
  } catch (err) {
    next(err);
  }
};

// POST /book
const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, publication_year, copies_available } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({
        success: false,
        message: 'title, author, and isbn are required fields.',
      });
    }

    const book = await Book.create({ title, author, isbn, publication_year, copies_available });
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

// PUT /book/:id
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    const { title, author, isbn, publication_year, copies_available } = req.body;
    await book.update({ title, author, isbn, publication_year, copies_available });
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBookById, getAllBooks, createBook, updateBook };
