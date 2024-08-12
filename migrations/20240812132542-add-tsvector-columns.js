module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Collections', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: true, 
    });

    await queryInterface.addColumn('Items', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: true, 
    });

    await queryInterface.addColumn('Tags', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: true, 
    });

    await queryInterface.addColumn('Comments', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: true, 
    });

    await queryInterface.addColumn('Users', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: true,  
    });

    await queryInterface.sequelize.query(`
      UPDATE "Collections"
      SET search_vector = to_tsvector(COALESCE(name, '') || ' ' || COALESCE(category, ''));

      UPDATE "Items"
      SET search_vector = to_tsvector(COALESCE(name, '') || ' ' ||  COALESCE(string_field1_value, '') || ' ' || COALESCE(string_field2_value, '') || ' ' || COALESCE(string_field3_value, ''));

      UPDATE "Tags"
      SET search_vector = to_tsvector(COALESCE(name, ''));

      UPDATE "Comments"
      SET search_vector = to_tsvector(COALESCE(text, ''));

      UPDATE "Users"
      SET search_vector = to_tsvector(COALESCE(username, '') || ' ' || COALESCE(email, ''));
    `);

    await queryInterface.changeColumn('Collections', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: false,
    });

    await queryInterface.changeColumn('Items', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: false,
    });

    await queryInterface.changeColumn('Tags', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: false,
    });

    await queryInterface.changeColumn('Comments', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Collections', 'search_vector');
    await queryInterface.removeColumn('Items', 'search_vector');
    await queryInterface.removeColumn('Tags', 'search_vector');
    await queryInterface.removeColumn('Comments', 'search_vector');
    await queryInterface.removeColumn('Users', 'search_vector');
  }
};
