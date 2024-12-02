const express = require('express');
const { getCurrentUser, updateUser, deleteAccount, updateImage } = require('../controllers/userController');
const { addEducation, getEducation } = require('../controllers/educationController');
const { addExperience, getExperience } = require('../controllers/experienceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getCurrentUser);
router.put('/me', authMiddleware, updateUser);
router.delete('/me', authMiddleware, deleteAccount);
router.put('/me/image', authMiddleware, updateImage);

router.get('/education', authMiddleware, getEducation);
router.post('/education', authMiddleware, addEducation);

router.get('/experience', authMiddleware, getExperience);
router.post('/experience', authMiddleware, addExperience);

module.exports = router;
