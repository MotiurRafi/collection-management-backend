const { Sequelize } = require('../models');
const db = require('../models')
exports.searchTag = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        const sanitizedQuery = query
            .replace(/'/g, "''")
            .split(/\s+/)
            .filter(word => word.length > 0)
            .map(word => `${word}:*`)
            .join(' & ');
            
        const searchQuery = `${sanitizedQuery}`;

        const tags = await db.Tag.findAll({
            where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`)
        });
        res.status(200).json(tags);
    } catch (error) {
        console.error("Error searching tags:", error);
        res.status(500).json({ error: 'An error occurred while searching' });
    }
};
