'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Member = require('./Member');
const Book = require('./Book');

const Issuance = sequelize.define(
  'Issuance',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'members', key: 'id' },
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'books', key: 'id' },
    },
    issued_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    target_return_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    actual_return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'issuances',
    timestamps: true,
    underscored: true,
  }
);

// Associations
Issuance.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });
Issuance.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });
Member.hasMany(Issuance, { foreignKey: 'member_id', as: 'issuances' });
Book.hasMany(Issuance, { foreignKey: 'book_id', as: 'issuances' });

module.exports = Issuance;
