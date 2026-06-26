'use strict';

const prisma = require('../config/prisma');
const { getPagination, paginatedResponse } = require('../utils/pagination');

// GET /book/:id
const getBookById = async (req, res, next) => {
  try {
    const book = await prisma.book.findUnique({
      where: { book_id: parseInt(req.params.id) },
      include: { category: true, collection: true },
    });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    res.json({ success: true, data: book });
  } catch (err) { next(err); }
};

// GET /book
const getAllBooks = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const search = req.query.search;

    const where = search
      ? {
          OR: [
            { book_name: { contains: search, mode: 'insensitive' } },
            { book_publisher: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, books] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: { category: true, collection: true },
        skip: offset,
        take: limit,
        orderBy: { book_id: 'desc' },
      }),
    ]);

    res.json(paginatedResponse(books, total, page, limit));
  } catch (err) { next(err); }
};

// POST /book
const createBook = async (req, res, next) => {
  try {
    const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
    if (!book_name || !book_cat_id || !book_collection_id)
      return res.status(400).json({ success: false, message: 'book_name, book_cat_id, and book_collection_id are required.' });

    const book = await prisma.book.create({
      data: {
        book_name,
        book_cat_id: parseInt(book_cat_id),
        book_collection_id: parseInt(book_collection_id),
        book_launch_date: book_launch_date ? new Date(book_launch_date) : null,
        book_publisher,
      },
      include: { category: true, collection: true },
    });
    res.status(201).json({ success: true, data: book });
  } catch (err) { next(err); }
};

// PUT /book/:id
const updateBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const exists = await prisma.book.findUnique({ where: { book_id: id } });
    if (!exists) return res.status(404).json({ success: false, message: 'Book not found.' });

    const { book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher } = req.body;
    const book = await prisma.book.update({
      where: { book_id: id },
      data: {
        book_name,
        book_cat_id: book_cat_id ? parseInt(book_cat_id) : undefined,
        book_collection_id: book_collection_id ? parseInt(book_collection_id) : undefined,
        book_launch_date: book_launch_date ? new Date(book_launch_date) : undefined,
        book_publisher,
      },
      include: { category: true, collection: true },
    });
    res.json({ success: true, data: book });
  } catch (err) { next(err); }
};

module.exports = { getBookById, getAllBooks, createBook, updateBook };
