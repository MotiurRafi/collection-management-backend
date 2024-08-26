const db = require('../models');

exports.createComment = async (req, res) => {
    const { itemId } = req.params
    const { text } = req.body;
    try {
        const comment = await db.Comment.create({
            text,
            itemId,
            userId: req.user.id,
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Error creating comment", error });
    }
};

exports.getItemComments = async (req, res) => {
    const { itemId } = req.params;
    try {
        const comments = await db.Comment.findAll({
            where: { itemId },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'username']
                },
            ],
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error });
    }
};


exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const comment = await db.Comment.findByPk(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        if (text !== undefined) comment.text = text;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Error updating comment", error });
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await db.Comment.findByPk(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        await comment.destroy();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error });
    }
};
