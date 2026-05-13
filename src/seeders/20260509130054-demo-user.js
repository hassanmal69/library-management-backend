'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:

    */
    await queryInterface.bulkInsert('users', [{
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashed-password',
      createdAt:  Date.now(),
      updatedAt: Date.now()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('users', null, {});

  }
};
