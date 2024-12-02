const { Education } = require('../models/models');  

exports.addEducation = async (req, res) => {
    const { degree } = req.body;
    const userId = req.user.id;

    try {
        const education = new Education({
            degree,
            user: userId, 
        });

        await education.save();

        res.status(201).json(education);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEducation = async (req, res) => {
    const userId = req.user.id;

    try {
        const educationList = await Education.find({ user: userId });

        res.json(educationList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
