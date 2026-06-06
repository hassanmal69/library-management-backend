'use strict';
import {Model} from 'sequelize'
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method atomatically.
     */
    static associate(models) {
      // User.hasMany(models.Book, { foreignKey: 'userId', as: 'borrowedBooks' });
      // define association here
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    memberId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('student', 'librarian', 'admin'),
      defaultValue: 'student'
    },
    status: {
      type: DataTypes.ENUM('active', 'blocked', 'pending'),
      defaultValue: 'pending'
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};