'use strict';

const express = require('express');
const router = express.Router();
const { getIssuanceById, getAllIssuances, createIssuance, updateIssuance } = require('../controllers/issuanceController');

router.get('/:id', getIssuanceById);
router.get('/', getAllIssuances);
router.post('/', createIssuance);
router.put('/:id', updateIssuance);

module.exports = router;
