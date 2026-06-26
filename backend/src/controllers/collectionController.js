'use strict';

const prisma = require('../config/prisma');

const getCollectionById = async (req, res, next) => {
  try {
    const col = await prisma.collection.findUnique({ where: { collection_id: parseInt(req.params.id) } });
    if (!col) return res.status(404).json({ success: false, message: 'Collection not found.' });
    res.json({ success: true, data: col });
  } catch (err) { next(err); }
};

const getAllCollections = async (req, res, next) => {
  try {
    const collections = await prisma.collection.findMany({ orderBy: { collection_name: 'asc' } });
    res.json({ success: true, data: collections, count: collections.length });
  } catch (err) { next(err); }
};

const createCollection = async (req, res, next) => {
  try {
    const { collection_name } = req.body;
    if (!collection_name)
      return res.status(400).json({ success: false, message: 'collection_name is required.' });
    const col = await prisma.collection.create({ data: { collection_name } });
    res.status(201).json({ success: true, data: col });
  } catch (err) { next(err); }
};

const updateCollection = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const exists = await prisma.collection.findUnique({ where: { collection_id: id } });
    if (!exists) return res.status(404).json({ success: false, message: 'Collection not found.' });
    const col = await prisma.collection.update({ where: { collection_id: id }, data: { collection_name: req.body.collection_name } });
    res.json({ success: true, data: col });
  } catch (err) { next(err); }
};

module.exports = { getCollectionById, getAllCollections, createCollection, updateCollection };
