const db = require('../models');

exports.toggleLike = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    if (!userId || !itemId) {
        return res.status(400).json({ message: "User ID or Item ID is missing" });
    }
    try {
        const existingLike = await db.Like.findOne({ where: { itemId, userId } });

        if (existingLike) {
            await existingLike.destroy();
            return res.status(200).json({ message: "Like removed successfully" });
        }
        const like = await db.Like.create({ itemId, userId });
        res.status(201).json(like);
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Error toggling like", error: error.message });
    }
};

exports.getLikes = async (req, res) => {
    const { itemId } = req.params;
    try {
        const likes = await db.Like.findAll({ where: { itemId } });
        res.status(200).json(likes);
    } catch (error) {
        console.error("Error fetching likes:", error);
        res.status(500).json({ message: "Error fetching likes", error: error.message });
    }
};
