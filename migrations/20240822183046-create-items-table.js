module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      collectionId: {
        type: Sequelize.INTEGER,
        references: { model: 'Collections', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      integer_field1_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      integer_field2_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      integer_field3_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      string_field1_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      string_field2_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      string_field3_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      multiline_text_field1_value: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      multiline_text_field2_value: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      multiline_text_field3_value: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      checkbox_field1_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      checkbox_field2_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      checkbox_field3_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_field1_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_field2_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_field3_value: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER update_updated_at BEFORE UPDATE
      ON "Items" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_updated_at ON "Items";
      DROP FUNCTION IF EXISTS update_updated_at_column;
    `);

    await queryInterface.dropTable('Items');
  }
};
