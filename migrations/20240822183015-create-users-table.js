module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user'
      },
      status: {
        type: Sequelize.ENUM('active', 'blocked'),
        defaultValue: 'active'
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
      ON "Users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_role";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_status";`);
    
    await queryInterface.dropTable('Users');
    
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_updated_at ON "Users";
      DROP FUNCTION IF EXISTS update_updated_at_column;
    `);
  }
};
