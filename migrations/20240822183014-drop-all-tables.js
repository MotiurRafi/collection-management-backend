'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropAllTables();
  },

  down: async (queryInterface, Sequelize) => {
    // You would typically not reverse a drop all tables operation.
    // This section is left empty intentionally.
  }
};
