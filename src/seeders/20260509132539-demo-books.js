'use strict';

/** @type {import('sequelize-cli').Migration} */

export default {
  async up(queryInterface, Sequelize) {

    const books = [];

    for (let i = 1; i <= 1000; i++) {
      books.push({
        title: `Book Title ${i}`,
        author: `Author ${i}`,
        isbn: `ISBN-${1000000000 + i}`,
        publishedYear: 2000 + (i % 24),
        quantity: Math.floor(Math.random() * 20) + 1,
        available: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Books', books, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
};