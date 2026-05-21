import mongoose from 'mongoose';
import User from './server/models/User.js';

const test = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/employee-dashboard');
  const users = await User.find().sort({ createdAt: -1 }).limit(3);
  console.log("Users:", users.map(u => ({ email: u.email, name: u.name, passHash: u.password })));
  process.exit(0);
};

test();
