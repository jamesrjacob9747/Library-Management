'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define(
  'Book',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true },
    },
    author: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: true },
    },
    isbn: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    publication_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1000, max: new Date().getFullYear() },
    },
    copies_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 0 },
    },
  },
  {
    tableName: 'books',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Book;
