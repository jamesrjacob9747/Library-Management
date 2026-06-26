'use strict';

const prisma = require('../config/prisma');

// GET /membership/:id
const getMembershipById = async (req, res, next) => {
  try {
    const membership = await prisma.membership.findUnique({
      where: { membership_id: parseInt(req.params.id) },
      include: { member: true },
    });
    if (!membership) return res.status(404).json({ success: false, message: 'Membership not found.' });
    res.json({ success: true, data: membership });
  } catch (err) { next(err); }
};

// GET /membership
const getAllMemberships = async (req, res, next) => {
  try {
    const memberships = await prisma.membership.findMany({
      include: { member: true },
      orderBy: { membership_id: 'desc' },
    });
    res.json({ success: true, data: memberships, count: memberships.length });
  } catch (err) { next(err); }
};

// POST /membership
const createMembership = async (req, res, next) => {
  try {
    const { member_id, status } = req.body;
    if (!member_id || !status)
      return res.status(400).json({ success: false, message: 'member_id and status are required.' });

    const member = await prisma.member.findUnique({ where: { mem_id: parseInt(member_id) } });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });

    const membership = await prisma.membership.create({
      data: { member_id: parseInt(member_id), status },
      include: { member: true },
    });
    res.status(201).json({ success: true, data: membership });
  } catch (err) { next(err); }
};

// PUT /membership/:id
const updateMembership = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const exists = await prisma.membership.findUnique({ where: { membership_id: id } });
    if (!exists) return res.status(404).json({ success: false, message: 'Membership not found.' });

    const { status } = req.body;
    const membership = await prisma.membership.update({
      where: { membership_id: id },
      data: { status },
      include: { member: true },
    });
    res.json({ success: true, data: membership });
  } catch (err) { next(err); }
};

module.exports = { getMembershipById, getAllMemberships, createMembership, updateMembership };
