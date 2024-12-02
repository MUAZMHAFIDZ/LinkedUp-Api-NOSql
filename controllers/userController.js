const { User } = require('../models/models');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/');
    },
    filename: async (req, file, cb) => {
        const userId = req.user.id;
        const user = await User.findById(userId, 'name');
        if (user) {
            const sanitizedUserName = user.name.replace(/\s+/g, '').toLowerCase();
            const imagename = `${sanitizedUserName}${path.extname(file.originalname)}`;
            cb(null, imagename);
        } else {
            cb(new Error('User not found'), null);
        }
    }
});

const upload = multer({ storage: storage }).single('image');

exports.getCurrentUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.user.id;
    const { name, address, phone, experience, gender, education, company, description } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(name !== undefined && { name }), 
                ...(address !== undefined && { address }), 
                ...(phone !== undefined && { phone }), 
                ...(experience !== undefined && { experience }), 
                ...(gender !== undefined && { gender }), 
                ...(education !== undefined && { education }), 
                ...(company !== undefined && { company }), 
                ...(description !== undefined && { description }), 
            },
            { new: true } 
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    const userId = req.user.id;

    try {
        await User.findByIdAndDelete(userId);
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateImage = async (req, res) => {
    const userId = req.user.id;

    upload(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: 'File upload failed', details: err.message });
        }

        const sanitizedUserName = req.user.name.replace(/\s+/g, '').toLowerCase();
        const imagename = `${sanitizedUserName}${path.extname(req.file.originalname)}`;
        const imagePath = `uploads/profiles/${imagename}`;

        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { image: imagePath },
                { new: true }
            );

            res.json({
                ...updatedUser.toObject(),
                imageUrl: `${req.protocol}://${req.get('host')}/${imagePath}`
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
