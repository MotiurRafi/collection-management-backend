module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
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
      itemId: {
        type: Sequelize.INTEGER,
        references: { model: 'Items', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
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
      ON "Comments" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_updated_at ON "Comments";
      DROP FUNCTION IF EXISTS update_updated_at_column;
    `);

    await queryInterface.dropTable('Comments');
  }
};
