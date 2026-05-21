import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, department, designation, status, joiningDate } = req.body;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user with admin role
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      department: department || '',
      designation: designation || '',
      status: 'Active',
      joiningDate: joiningDate || new Date(),
      role: 'admin',
    });

    if (user) {
      // If department is provided (from Admin Add Employee Modal), also create Employee record
      if (department) {
        const empExists = await Employee.findOne({ email: user.email });
        if (!empExists) {
          await Employee.create({
            name:        user.name,
            email:       normalizedEmail,
            department:  user.department,
            designation: user.designation,
            status:      'Inactive',   // admin must activate
            joiningDate: user.joiningDate,
          });
        }
      }
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        designation: user.designation,
        status: user.status,
        joiningDate: user.joiningDate,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        designation: user.designation,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/auth/role/:id
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  try {
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "user" or "admin"' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: `Role updated to ${role} successfully`,
    });
  } catch (error) {
    console.error('Role Update Error:', error);
    res.status(500).json({ message: 'Server error updating role' });
  }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};
