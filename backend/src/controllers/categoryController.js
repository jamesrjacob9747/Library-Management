'use strict';

const prisma = require('../config/prisma');

const getCategoryById = async (req, res, next) => {
  try {
    const cat = await prisma.category.findUnique({ where: { cat_id: parseInt(req.params.id) } });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { cat_name: 'asc' } });
    res.json({ success: true, data: categories, count: categories.length });
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const { cat_name, sub_cat_name } = req.body;
    if (!cat_name || !sub_cat_name)
      return res.status(400).json({ success: false, message: 'cat_name and sub_cat_name are required.' });
    const cat = await prisma.category.create({ data: { cat_name, sub_cat_name } });
    res.status(201).json({ success: true, data: cat });
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const exists = await prisma.category.findUnique({ where: { cat_id: id } });
    if (!exists) return res.status(404).json({ success: false, message: 'Category not found.' });
    const cat = await prisma.category.update({ where: { cat_id: id }, data: { cat_name: req.body.cat_name, sub_cat_name: req.body.sub_cat_name } });
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
};

module.exports = { getCategoryById, getAllCategories, createCategory, updateCategory };
