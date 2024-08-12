const db = require('../models');

exports.getAllAdmin = async (req, res) => {
  try {
    const admins = await db.User.findAll({ where: { role: 'admin' } });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins" });
  }
};

exports.promoteToAdmin = async (req, res) => {
  const {id} = req.params
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin', user });
  } catch (error) {
    res.status(500).json({ message: 'Error promoting user to admin' });
  }
};

exports.demoteToUser = async (req, res) => {
  const {id} = req.params
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'user';
    await user.save();

    res.status(200).json({ message: 'Admin demoted to user', user });
  } catch (error) {
    res.status(500).json({ message: 'Error demoting Admin' });
  }
};

exports.blockAdmin = async (req, res) => {
  const {id} = req.params
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === "user") {
        return res.status(404).json({message: 'The user is not an admin'})
    }

    user.status = 'blocked';
    await user.save();

    res.status(200).json({ message: 'admin blocked', user });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking Admin' });
  }
};

exports.unblockAdmin = async (req, res) => {
  const {id} = req.params
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === "user") {
        return res.status(404).json({message: 'The user is not an admin'})
    }

    user.status = 'active';
    await user.save();

    res.status(200).json({ message: 'Admin unblocked', user });
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking Admin' });
  }
};
