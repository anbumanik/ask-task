import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Employee from './models/Employee.js';

dotenv.config();

const employeesData = [
  { name: 'John Doe', email: 'john.doe@company.com', department: 'Engineering', designation: 'Senior Software Engineer', status: 'Active', joiningDate: new Date('2025-10-15') },
  { name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Design', designation: 'UX Designer', status: 'Active', joiningDate: new Date('2025-11-01') },
  { name: 'Michael Johnson', email: 'michael.j@company.com', department: 'Sales', designation: 'Account Executive', status: 'Active', joiningDate: new Date('2025-11-20') },
  { name: 'Emily Davis', email: 'emily.davis@company.com', department: 'Human Resources', designation: 'HR Generalist', status: 'Active', joiningDate: new Date('2025-12-05') },
  { name: 'David Brown', email: 'david.b@company.com', department: 'Engineering', designation: 'Frontend Developer', status: 'Inactive', joiningDate: new Date('2025-12-10') },
  { name: 'Sarah Miller', email: 'sarah.m@company.com', department: 'Marketing', designation: 'Content Strategist', status: 'Active', joiningDate: new Date('2026-01-15') },
  { name: 'James Wilson', email: 'james.w@company.com', department: 'Finance', designation: 'Financial Analyst', status: 'Active', joiningDate: new Date('2026-01-20') },
  { name: 'Jessica Taylor', email: 'jessica.t@company.com', department: 'Design', designation: 'Product Designer', status: 'Active', joiningDate: new Date('2026-02-05') },
  { name: 'Robert Anderson', email: 'robert.a@company.com', department: 'Engineering', designation: 'Backend Tech Lead', status: 'Active', joiningDate: new Date('2026-02-12') },
  { name: 'Amanda Thomas', email: 'amanda.t@company.com', department: 'Human Resources', designation: 'Talent Acquisition', status: 'Active', joiningDate: new Date('2026-02-28') },
  { name: 'Brian Jackson', email: 'brian.j@company.com', department: 'Sales', designation: 'Sales Manager', status: 'Inactive', joiningDate: new Date('2026-03-01') },
  { name: 'Megan White', email: 'megan.w@company.com', department: 'Marketing', designation: 'SEO Executive', status: 'Active', joiningDate: new Date('2026-03-15') },
  { name: 'Kevin Harris', email: 'kevin.h@company.com', department: 'Engineering', designation: 'DevOps Engineer', status: 'Active', joiningDate: new Date('2026-03-22') },
  { name: 'Lisa Martin', email: 'lisa.m@company.com', department: 'Finance', designation: 'Senior Accountant', status: 'Active', joiningDate: new Date('2026-04-05') },
  { name: 'William Thompson', email: 'william.t@company.com', department: 'Sales', designation: 'Business Development', status: 'Active', joiningDate: new Date('2026-04-12') },
  { name: 'Rachel Garcia', email: 'rachel.g@company.com', department: 'Design', designation: 'UI Animator', status: 'Active', joiningDate: new Date('2026-04-18') },
  { name: 'Daniel Martinez', email: 'daniel.m@company.com', department: 'Engineering', designation: 'QA Engineer', status: 'Active', joiningDate: new Date('2026-04-25') },
  { name: 'Ashley Robinson', email: 'ashley.r@company.com', department: 'Marketing', designation: 'Social Media Manager', status: 'Active', joiningDate: new Date('2026-05-02') },
  { name: 'Christopher Clark', email: 'chris.c@company.com', department: 'Engineering', designation: 'Security Engineer', status: 'Active', joiningDate: new Date('2026-05-10') },
  { name: 'Patricia Rodriguez', email: 'patricia.r@company.com', department: 'Human Resources', designation: 'HR Director', status: 'Active', joiningDate: new Date('2026-05-14') },
  { name: 'Matthew Lewis', email: 'matthew.l@company.com', department: 'Sales', designation: 'Account Manager', status: 'Inactive', joiningDate: new Date('2026-05-18') },
  { name: 'Elizabeth Lee', email: 'elizabeth.l@company.com', department: 'Finance', designation: 'Treasurer', status: 'Active', joiningDate: new Date('2026-05-20') }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Clearing database...');

    // Clear existing collections
    await User.deleteMany({});
    await Employee.deleteMany({});

    console.log('Database cleared. Seeding Admin User...');

    // Create Admin User
    // Password will be hashed in the pre-save hook of the User model
    const adminUser = await User.create({
      name: 'Dashboard Administrator',
      email: 'admin@dashboard.com',
      password: 'admin123',
      department: 'Management',
      designation: 'System Administrator',
      status: 'Active',
      joiningDate: new Date('2025-01-01'),
      role: 'admin'
    });

    console.log(`Admin seeded: ${adminUser.email} (Password: admin123)`);

    console.log('Seeding employees...');
    const createdEmployees = await Employee.insertMany(employeesData);
    console.log(`Seeded ${createdEmployees.length} employees successfully.`);

    console.log('Database Seeding Completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
