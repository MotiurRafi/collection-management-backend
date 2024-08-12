module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Collections', {
      id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING
      },
      integer_field1_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      integer_field1_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      integer_field2_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      integer_field2_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      integer_field3_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      integer_field3_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      string_field1_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      string_field1_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      string_field2_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      string_field2_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      string_field3_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      string_field3_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      multiline_text_field1_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      multiline_text_field1_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      multiline_text_field2_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      multiline_text_field2_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      multiline_text_field3_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      multiline_text_field3_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      checkbox_field1_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      checkbox_field1_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      checkbox_field2_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      checkbox_field2_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      checkbox_field3_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      checkbox_field3_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      date_field1_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_field1_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      date_field2_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_field2_state: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      date_field3_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_field3_state: {
        type: Sequelize.BOOLEAN,
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
      ON "Collections" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Collections');
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_updated_at ON "Collections";
      DROP FUNCTION IF EXISTS update_updated_at_column;
    `);
  }
};
