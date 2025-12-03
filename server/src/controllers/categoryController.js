const Category = require('../models/categoryModel');

async function createCategory(req, res, next) {
  try {
    const { nome, tipo } = req.body;
    const cat = await Category.create({ nome, tipo });
    res.status(201).json(cat);
  } catch (err) {
    next(err);
  }
}

async function listCategories(req, res, next) {
  try {
    const { tipo } = req.query;
    const filter = tipo ? { tipo } : {};
    const cats = await Category.find(filter).sort({ nome: 1 });
    res.json(cats);
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory, listCategories };