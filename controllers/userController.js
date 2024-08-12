const { User, Sequelize } = require('../models');
const db = require('../models');

exports.getUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await db.User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] },
            include: [{ model: db.Collection }]
        });

        if (!user) {
            return res.status(404).json({ message: 'No user found with that ID' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: "Error getting user" });
    }
};

exports.searchUser = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        const sanitizedQuery = query.replace(/'/g, "''");
        const searchQuery = `${sanitizedQuery}:*`;
        const users = await User.findAll({
            where: Sequelize.literal(`search_vector @@ to_tsquery('${searchQuery}')`),
            attributes: ['id', 'username', 'email', 'role', 'status']
        });

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while searching' });
    }
};