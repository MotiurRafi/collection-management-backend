module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_search_vector_collections()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector = to_tsvector(NEW.name || ' ' || NEW.category);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_update_search_vector_collections
      BEFORE INSERT OR UPDATE ON "Collections"
      FOR EACH ROW EXECUTE FUNCTION update_search_vector_collections();
      

      CREATE OR REPLACE FUNCTION update_search_vector_items()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector = to_tsvector(COALESCE(NEW.name, '') || ' ' || 
                                        COALESCE(NEW.string_field1_value, '') || ' ' || 
                                        COALESCE(NEW.string_field2_value, '') || ' ' || 
                                        COALESCE(NEW.string_field3_value, ''));
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_update_search_vector_items
      BEFORE INSERT OR UPDATE ON "Items"
      FOR EACH ROW EXECUTE FUNCTION update_search_vector_items();
      

      CREATE OR REPLACE FUNCTION update_search_vector_tags()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector = to_tsvector(NEW.name);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_update_search_vector_tags
      BEFORE INSERT OR UPDATE ON "Tags"
      FOR EACH ROW EXECUTE FUNCTION update_search_vector_tags();
      
      
      CREATE OR REPLACE FUNCTION update_search_vector_comments()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector = to_tsvector(NEW.text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_update_search_vector_comments
      BEFORE INSERT OR UPDATE ON "Comments"
      FOR EACH ROW EXECUTE FUNCTION update_search_vector_comments();


      CREATE OR REPLACE FUNCTION update_search_vector_users()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector = to_tsvector(NEW.username || ' ' || NEW.email);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_update_search_vector_users
      BEFORE INSERT OR UPDATE ON "Users"
      FOR EACH ROW EXECUTE FUNCTION update_search_vector_users();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_update_search_vector_collections ON "Collections";
      DROP FUNCTION IF EXISTS update_search_vector_collections;
      
      DROP TRIGGER IF EXISTS trg_update_search_vector_items ON "Items";
      DROP FUNCTION IF EXISTS update_search_vector_items;
      
      DROP TRIGGER IF EXISTS trg_update_search_vector_tags ON "Tags";
      DROP FUNCTION IF EXISTS update_search_vector_tags;
      
      DROP TRIGGER IF EXISTS trg_update_search_vector_comments ON "Comments";
      DROP FUNCTION IF EXISTS update_search_vector_comments;

      DROP TRIGGER IF EXISTS trg_update_search_vector_users ON "Users";
      DROP FUNCTION IF EXISTS update_search_vector_users;
    `);
  }
};
