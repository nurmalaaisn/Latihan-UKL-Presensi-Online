'use strict';
const md5 = require('md5');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        username: 'admin1',
        password: md5('admin'),  
        role: 'admin',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Guru Produktif',
        username: 'produktif',
        password: md5('produktif'),
        role: 'teacher',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Mala',
        username: 'Mala',
        password: md5('moklet'),
        role: 'student',
        createdAt: now,
        updatedAt: now
      }
    ], {}); 
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
