'use strict';
import bcrypt from 'bcrypt';

export default {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await queryInterface.bulkInsert('users', [  
      {
        name: 'Admin User',
        email: 'admin@library.com',
        password: hashedPassword,
        memberId: 'ADM-001',
        role: 'admin',
        status: 'active',
        department: 'Administration',
        phone: '03001234567',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Student',
        email: 'john@student.com',
        password: hashedPassword,
        memberId: 'LBB-2024-001',
        role: 'student',
        status: 'active',
        department: 'Computer Science',
        phone: '03001234568',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sarah Librarian',
        email: 'sarah@library.com',
        password: hashedPassword,
        memberId: 'LIB-001',
        role: 'librarian',
        status: 'active',
        department: 'Library',
        phone: '03001234569',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pending User',
        email: 'pending@test.com',
        password: hashedPassword,
        memberId: 'LBB-2024-002',
        role: 'student',
        status: 'pending',
        department: 'Physics',
        phone: '03001234570',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});  
  }
};