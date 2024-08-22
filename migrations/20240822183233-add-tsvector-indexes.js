module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_collections_search_vector
      ON "Collections" USING GIN (search_vector);

      CREATE INDEX idx_items_search_vector
      ON "Items" USING GIN (search_vector);

      CREATE INDEX idx_tags_search_vector
      ON "Tags" USING GIN (search_vector);

      CREATE INDEX idx_comments_search_vector
      ON "Comments" USING GIN (search_vector);

      CREATE INDEX idx_users_search_vector
      ON "Users" USING GIN (search_vector);
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS idx_collections_search_vector;
      DROP INDEX IF EXISTS idx_items_search_vector;
      DROP INDEX IF EXISTS idx_tags_search_vector;
      DROP INDEX IF EXISTS idx_comments_search_vector;
      DROP INDEX IF EXISTS idx_users_search_vector;
      `);
  }
};
