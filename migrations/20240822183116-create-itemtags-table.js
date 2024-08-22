module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ItemTags', {
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Items',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true
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
      ON "ItemTags" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryInterface.addConstraint('ItemTags', {
      fields: ['itemId', 'tagId'],
      type: 'unique',
      name: 'unique_item_tag'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_updated_at ON "ItemTags";
      DROP FUNCTION IF EXISTS update_updated_at_column;
    `);

    await queryInterface.dropTable('ItemTags');
  }
};
