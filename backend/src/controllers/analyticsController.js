'use strict';

const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

// GET /analytics/books-never-borrowed
const booksNeverBorrowed = async (req, res, next) => {
  try {
    const results = await sequelize.query(
      `SELECT b.title AS "Book Name", b.author AS "Author"
       FROM books b
       LEFT JOIN issuances i ON b.id = i.book_id
       WHERE i.id IS NULL
       ORDER BY b.title;`,
      { type: QueryTypes.SELECT }
    );
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    next(err);
  }
};

// GET /analytics/outstanding-books
const outstandingBooks = async (req, res, next) => {
  try {
    const results = await sequelize.query(
      `SELECT m.name AS "Member Name",
              b.title AS "Book Name",
              i.issued_date AS "Issued Date",
              i.target_return_date AS "Target Return Date",
              b.author AS "Author"
       FROM issuances i
       JOIN members m ON i.member_id = m.id
       JOIN books b ON i.book_id = b.id
       WHERE i.actual_return_date IS NULL
       ORDER BY i.target_return_date ASC;`,
      { type: QueryTypes.SELECT }
    );
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    next(err);
  }
};

// GET /analytics/top-borrowed-books
const topBorrowedBooks = async (req, res, next) => {
  try {
    const results = await sequelize.query(
      `SELECT b.title AS "Book Name",
              COUNT(i.id) AS "Number of Times Borrowed",
              COUNT(DISTINCT i.member_id) AS "Number of Members that Borrowed It"
       FROM books b
       JOIN issuances i ON b.id = i.book_id
       GROUP BY b.id, b.title
       ORDER BY COUNT(i.id) DESC
       LIMIT 10;`,
      { type: QueryTypes.SELECT }
    );
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    next(err);
  }
};

module.exports = { booksNeverBorrowed, outstandingBooks, topBorrowedBooks };
