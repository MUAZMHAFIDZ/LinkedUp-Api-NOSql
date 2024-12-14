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
    getLatestJobUsers,
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createJob);
router.get('/', getAllJobs);
router.get('/search', searchJob);
router.get('/id/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/registerforjob', authMiddleware, registerForJob);
router.post('/getjobsforuser', authMiddleware, getJobsForUser);
router.get('/getapplicant', authMiddleware, getLatestJobUsers);
router.post('/acceptapplicant/:jobId/accept/:userId', authMiddleware, acceptApplicant);

module.exports = router;
