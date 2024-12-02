const express = require('express');
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    searchJob,
    registerForJob,
    getJobsForUser,
    acceptApplicant,
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createJob);
router.get('/', getAllJobs);
router.get('/search', searchJob);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/registerForJob', authMiddleware, registerForJob);
router.post('/getJobsForUser', authMiddleware, getJobsForUser);
router.post('/acceptApplicant', authMiddleware, acceptApplicant);

module.exports = router;
