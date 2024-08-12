const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordAdmin = await bcrypt.hash('1234', 10);
    const hashedPasswordUser = await bcrypt.hash('1234', 10);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'Motiur Rahman Rafi',
        email: 'motiurrafi601@gmail.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'demoUser1',
        email: 'mr@gmail.com',
        password: hashedPasswordUser,
        role: 'user',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'demoUser2',
        email: 'demo2@example.com',
        password: hashedPasswordUser,
        role: 'user',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {
      username: ['Motiur Rahman Rafi', 'demoUser1', 'demoUser2']
    }, {});
  }
};
