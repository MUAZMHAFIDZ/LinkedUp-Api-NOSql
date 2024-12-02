const { Experience } = require('../models/models');  

exports.addExperience = async (req, res) => {
    const { jobTitle, company } = req.body;
    const userId = req.user.id;

    try {
        const experience = new Experience({
            jobTitle,
            company,
            user: userId,  
        });

        await experience.save();

        res.status(201).json(experience);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getExperience = async (req, res) => {
    const userId = req.user.id;

    try {
        const experienceList = await Experience.find({ user: userId });
        res.json(experienceList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
