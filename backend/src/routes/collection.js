'use strict';
const express = require('express');
const router = express.Router();
const { getCollectionById, getAllCollections, createCollection, updateCollection } = require('../controllers/collectionController');
router.get('/:id', getCollectionById);
router.get('/', getAllCollections);
router.post('/', createCollection);
router.put('/:id', updateCollection);
module.exports = router;
