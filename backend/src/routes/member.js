'use strict';

const express = require('express');
const router = express.Router();
const { getMemberById, getAllMembers, createMember, updateMember } = require('../controllers/memberController');

router.get('/:id', getMemberById);
router.get('/', getAllMembers);
router.post('/', createMember);
router.put('/:id', updateMember);

module.exports = router;
