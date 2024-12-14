const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobUsersSchema = new Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  portfolioLink: { type: String },
  description: { type: String, required: true }
}, { timestamps: true });

const jobSchema = new Schema({
  title: { type: String, required: true },
  salary: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  image: { type: String },
  userCount: { type: Number, default: 0 },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  companyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' }
});

const companySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
});

const experienceSchema = new Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const educationSchema = new Schema({
  degree: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const userSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  experience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
  gender: { type: String },
  description: { type: String },
  education: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Education' }],
  role: { type: String, default: 'user' },
  image: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  jobUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobUsers' }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Experience = mongoose.model('Experience', experienceSchema);
const Education = mongoose.model('Education', educationSchema);
const Company = mongoose.model('Company', companySchema);
const Job = mongoose.model('Job', jobSchema);
const JobUsers = mongoose.model('JobUsers', jobUsersSchema);

module.exports = { User, Experience, Education, Company, Job, JobUsers };
