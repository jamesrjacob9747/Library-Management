'use strict';

const { Op } = require('sequelize');
const Member = require('../models/Member');
const { getPagination, paginatedResponse } = require('../utils/pagination');

// GET /member/:id
const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// GET /member
const getAllMembers = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const search = req.query.search;

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Member.findAndCountAll({
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

// POST /member
const createMember = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'name and email are required fields.',
      });
    }

    const member = await Member.create({ name, email, phone, address });
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// PUT /member/:id
const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const { name, email, phone, address } = req.body;
    await member.update({ name, email, phone, address });
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMemberById, getAllMembers, createMember, updateMember };
