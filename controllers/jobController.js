const { Job, JobUsers } = require('../models/models');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/jobs/');
    },
    filename: (req, file, cb) => {
        const timestamp = `${Math.random().toString(36).substring(2, 10)}-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`;
        const imagename = `${timestamp}${path.extname(file.originalname)}`;
        cb(null, imagename);
    }
});

const upload = multer({ storage: storage }).single('image');

exports.createJob = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(500).json({ error: 'File upload failed', details: err.message });
            }

            const { title, salary, description, companyId } = req.body;
            const imagename = req.file.filename; 
            const imagePath = `uploads/jobs/${imagename}`;

            const job = new Job({
                title,
                salary: parseInt(salary),
                description,
                image: imagePath,
                companyId,
            });

            await job.save();
            res.status(201).json({
                ...job.toObject(),
                imageUrl: `${req.protocol}://${req.get('host')}/${imagePath}`
            });
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const jobs = await Job.find({ status: true })
            .populate('companyId', 'id name address')
            .skip(cursor || 0)
            .limit(pageSize);

        const nextCursor = jobs.length > 0 ? jobs[jobs.length - 1]._id : null;
        res.json({ jobs, nextCursor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJobById = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id).populate('companyId', 'id name address');
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, salary, description } = req.body;

    if (!req.body) {
        return res.status(400).json({ message: "Invalid data, please send it again." });
    }

    try {
        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { title, salary, description },
            { new: true }
        );
        res.json(updatedJob);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        const imagePath = job.image;
        if (imagePath) {
            const absoluteImagePath = path.resolve(imagePath);
            await fs.unlink(absoluteImagePath);
        }

        await Job.findByIdAndDelete(id);
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchJob = async (req, res) => {
    const { title } = req.query;

    try {
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const jobs = await Job.find({
            status: true,
            ...(title && {
                title: { $regex: title, $options: 'i' }
            })
        })
        .populate('companyId', 'id name address')
        .skip(cursor || 0)
        .limit(pageSize)
        .sort({ createdAt: -1 });

        const nextCursor = jobs.length > 0 ? jobs[jobs.length - 1]._id : null;
        res.json({ jobs, nextCursor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.registerForJob = async (req, res) => {
    const userId = req.params;
    const { jobId, description, portfolioLink } = req.body;
    try {
        const existingEntry = await JobUsers.findOne({
            jobId,
            userId,
        });

        if (existingEntry) {
            return res.status(400).json({ error: 'User is already registered for this job' });
        }

        const jobUser = new JobUsers({
            jobId,
            userId,
            description,
            portfolioLink,
        });

        await jobUser.save();

        await Job.findByIdAndUpdate(jobId, {
            $inc: { userCount: 1 },
        });

        res.status(201).json({ message: 'User successfully registered for the job' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJobsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const jobs = await Job.find({
            _id: { $in: (await JobUsers.find({ userId }).select('jobId')).map(j => j.jobId) }
        }).populate('companyId', 'id name address');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.acceptApplicant = async (req, res) => {
    const { userId, jobId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const applicant = await JobUsers.findOne({
            jobId,
            userId: req.body.applicantId,
        });

        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        await Job.findByIdAndUpdate(jobId, { status: false });
        res.json({ message: 'Applicant accepted successfully, job status updated to inactive' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLatestJobUsers = async (req, res) => {
    try {
      const jobUsers = await JobUsers.find()
        .sort({ createdAt: -1 }) 
        .populate({
          path: 'jobId',
          match: { status: true }
        })      
        .populate('userId');   

      const filteredJobUsers = jobUsers.filter(jobUser => jobUser.jobId !== null);

      res.status(200).json(filteredJobUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan saat mengambil data job users.',
      });
    }
  };