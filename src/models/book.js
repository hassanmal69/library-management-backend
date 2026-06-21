'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Book has many Loans (issued books)
      Book.hasMany(models.Loan, {
        foreignKey: 'bookId',
        as: 'loans'
      });
    }
  }
  
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    available: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  
  return Book;
};