'use strict';

const { Op } = require('sequelize');
const Issuance = require('../models/Issuance');
const Member = require('../models/Member');
const Book = require('../models/Book');
const { getPagination, paginatedResponse } = require('../utils/pagination');

const memberAttrs = ['id', 'name', 'email', 'phone'];
const bookAttrs = ['id', 'title', 'author', 'isbn'];

// GET /issuance/:id
const getIssuanceById = async (req, res, next) => {
  try {
    const issuance = await Issuance.findByPk(req.params.id, {
      include: [
        { model: Member, as: 'member', attributes: memberAttrs },
        { model: Book, as: 'book', attributes: bookAttrs },
      ],
    });
    if (!issuance) {
      return res.status(404).json({ success: false, message: 'Issuance record not found.' });
    }
    res.json({ success: true, data: issuance });
  } catch (err) {
    next(err);
  }
};

// GET /issuance
// Query params: status (active|returned|overdue), member_id, book_id, date (target_return_date)
const getAllIssuances = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status, member_id, book_id, date } = req.query;

    const where = {};

    if (member_id) where.member_id = member_id;
    if (book_id) where.book_id = book_id;

    if (status === 'returned') {
      where.actual_return_date = { [Op.ne]: null };
    } else if (status === 'active') {
      where.actual_return_date = null;
    } else if (status === 'overdue') {
      where.actual_return_date = null;
      where.target_return_date = { [Op.lt]: new Date() };
    }

    // Filter by a specific target return date (for dashboard)
    if (date) {
      where.target_return_date = date;
      where.actual_return_date = null;
    }

    const { count, rows } = await Issuance.findAndCountAll({
      where,
      include: [
        { model: Member, as: 'member', attributes: memberAttrs },
        { model: Book, as: 'book', attributes: bookAttrs },
      ],
      limit,
      offset,
      order: [['target_return_date', 'ASC']],
    });

    res.json(paginatedResponse(rows, count, page, limit));
  } catch (err) {
    next(err);
  }
};

// POST /issuance
const createIssuance = async (req, res, next) => {
  try {
    const { member_id, book_id, target_return_date, issued_date } = req.body;

    if (!member_id || !book_id || !target_return_date) {
      return res.status(400).json({
        success: false,
        message: 'member_id, book_id, and target_return_date are required.',
      });
    }

    // Validate member and book exist
    const [member, book] = await Promise.all([
      Member.findByPk(member_id),
      Book.findByPk(book_id),
    ]);

    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    if (book.copies_available < 1) {
      return res.status(400).json({ success: false, message: 'No copies available for this book.' });
    }

    // Decrement available copies
    await book.update({ copies_available: book.copies_available - 1 });

    const issuance = await Issuance.create({
      member_id,
      book_id,
      issued_date: issued_date || new Date(),
      target_return_date,
    });

    const result = await Issuance.findByPk(issuance.id, {
      include: [
        { model: Member, as: 'member', attributes: memberAttrs },
        { model: Book, as: 'book', attributes: bookAttrs },
      ],
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// PUT /issuance/:id
const updateIssuance = async (req, res, next) => {
  try {
    const issuance = await Issuance.findByPk(req.params.id, {
      include: [{ model: Book, as: 'book' }],
    });
    if (!issuance) {
      return res.status(404).json({ success: false, message: 'Issuance record not found.' });
    }

    const { actual_return_date, target_return_date } = req.body;

    // If marking as returned and wasn't returned before, increment copies
    if (actual_return_date && !issuance.actual_return_date) {
      await issuance.book.update({
        copies_available: issuance.book.copies_available + 1,
      });
    }

    await issuance.update({ actual_return_date, target_return_date });

    const result = await Issuance.findByPk(issuance.id, {
      include: [
        { model: Member, as: 'member', attributes: memberAttrs },
        { model: Book, as: 'book', attributes: bookAttrs },
      ],
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getIssuanceById, getAllIssuances, createIssuance, updateIssuance };
