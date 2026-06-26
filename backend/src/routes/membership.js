'use strict';
const express = require('express');
const router = express.Router();
const { getMembershipById, getAllMemberships, createMembership, updateMembership } = require('../controllers/membershipController');
router.get('/:id', getMembershipById);
router.get('/', getAllMemberships);
router.post('/', createMembership);
router.put('/:id', updateMembership);
module.exports = router;
