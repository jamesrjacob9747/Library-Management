'use strict';

const prisma = require('../config/prisma');
const { getPagination, paginatedResponse } = require('../utils/pagination');

const includeRelations = {
  member: { select: { mem_id: true, mem_name: true, mem_email: true, mem_phone: true } },
  book: { select: { book_id: true, book_name: true, book_publisher: true, category: true, collection: true } },
};

// GET /issuance/:id
const getIssuanceById = async (req, res, next) => {
  try {
    const issuance = await prisma.issuance.findUnique({
      where: { issuance_id: parseInt(req.params.id) },
      include: includeRelations,
    });
    if (!issuance) return res.status(404).json({ success: false, message: 'Issuance not found.' });
    res.json({ success: true, data: issuance });
  } catch (err) { next(err); }
};

// GET /issuance  (?status=issued|returned|overdue, ?member_id=, ?book_id=, ?date=YYYY-MM-DD)
const getAllIssuances = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status, member_id, book_id, date } = req.query;

    const where = {};
    if (member_id) where.issuance_member = parseInt(member_id);
    if (book_id) where.book_id = parseInt(book_id);
    if (status) where.issuance_status = status;

    // For dashboard: pending returns on or before a given date
    if (date) {
      where.target_return_date = { lte: new Date(date) };
      where.issuance_status = { not: 'returned' };
    }

    const [total, issuances] = await Promise.all([
      prisma.issuance.count({ where }),
      prisma.issuance.findMany({
        where,
        include: includeRelations,
        skip: offset,
        take: limit,
        orderBy: { target_return_date: 'asc' },
      }),
    ]);

    res.json(paginatedResponse(issuances, total, page, limit));
  } catch (err) { next(err); }
};

// POST /issuance
const createIssuance = async (req, res, next) => {
  try {
    const { book_id, issuance_member, issued_by, target_return_date, issuance_date } = req.body;
    if (!book_id || !issuance_member || !target_return_date)
      return res.status(400).json({ success: false, message: 'book_id, issuance_member, and target_return_date are required.' });

    const [member, book] = await Promise.all([
      prisma.member.findUnique({ where: { mem_id: parseInt(issuance_member) } }),
      prisma.book.findUnique({ where: { book_id: parseInt(book_id) } }),
    ]);

    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });

    const issuance = await prisma.issuance.create({
      data: {
        book_id: parseInt(book_id),
        issuance_member: parseInt(issuance_member),
        issued_by,
        issuance_date: issuance_date ? new Date(issuance_date) : new Date(),
        target_return_date: new Date(target_return_date),
        issuance_status: 'issued',
      },
      include: includeRelations,
    });
    res.status(201).json({ success: true, data: issuance });
  } catch (err) { next(err); }
};

// PUT /issuance/:id
const updateIssuance = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const exists = await prisma.issuance.findUnique({ where: { issuance_id: id } });
    if (!exists) return res.status(404).json({ success: false, message: 'Issuance not found.' });

    const { issuance_status, target_return_date, issued_by } = req.body;

    const issuance = await prisma.issuance.update({
      where: { issuance_id: id },
      data: {
        issuance_status,
        target_return_date: target_return_date ? new Date(target_return_date) : undefined,
        issued_by,
      },
      include: includeRelations,
    });
    res.json({ success: true, data: issuance });
  } catch (err) { next(err); }
};

module.exports = { getIssuanceById, getAllIssuances, createIssuance, updateIssuance };
