'use strict';

const prisma = require('../config/prisma');
const { getPagination, paginatedResponse } = require('../utils/pagination');

// GET /member/:id
const getMemberById = async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: { mem_id: parseInt(req.params.id) },
      include: { membership: true },
    });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    res.json({ success: true, data: member });
  } catch (err) { next(err); }
};

// GET /member
const getAllMembers = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const search = req.query.search;

    const where = search
      ? {
          OR: [
            { mem_name: { contains: search, mode: 'insensitive' } },
            { mem_email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, members] = await Promise.all([
      prisma.member.count({ where }),
      prisma.member.findMany({
        where,
        include: { membership: true },
        skip: offset,
        take: limit,
        orderBy: { mem_id: 'desc' },
      }),
    ]);

    res.json(paginatedResponse(members, total, page, limit));
  } catch (err) { next(err); }
};

// POST /member
const createMember = async (req, res, next) => {
  try {
    const { mem_name, mem_email, mem_phone } = req.body;
    if (!mem_name || !mem_email)
      return res.status(400).json({ success: false, message: 'mem_name and mem_email are required.' });

    const member = await prisma.member.create({ data: { mem_name, mem_email, mem_phone } });
    res.status(201).json({ success: true, data: member });
  } catch (err) { next(err); }
};

// PUT /member/:id
const updateMember = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const exists = await prisma.member.findUnique({ where: { mem_id: id } });
    if (!exists) return res.status(404).json({ success: false, message: 'Member not found.' });

    const { mem_name, mem_email, mem_phone } = req.body;
    const member = await prisma.member.update({
      where: { mem_id: id },
      data: { mem_name, mem_email, mem_phone },
    });
    res.json({ success: true, data: member });
  } catch (err) { next(err); }
};

module.exports = { getMemberById, getAllMembers, createMember, updateMember };
