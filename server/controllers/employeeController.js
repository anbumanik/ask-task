import Employee from '../models/Employee.js';

// @desc    Get all employees with pagination, search & filters
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const department = req.query.department || '';
    const status = req.query.status || '';

    // Build query filter
    const query = {};

    // Search filter (name or email)
    if (search) {
      // Escape regex special characters to prevent MongoDB syntax errors
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    // Department filter
    if (department && department !== 'All') {
      query.department = department;
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Count total documents matching query
    const total = await Employee.countDocuments(query);

    // Fetch paginated results sorted by newest first
    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      employees,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private
export const createEmployee = async (req, res) => {
  const { name, email, department, designation, status, joiningDate } = req.body;

  try {
    // Check if email already exists
    const employeeExists = await Employee.findOne({ email });

    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      designation,
      status,
      joiningDate,
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating employee' });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private
export const updateEmployee = async (req, res) => {
  const { name, email, department, designation, status, joiningDate } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if updating email to one that belongs to another employee
    if (email && email !== employee.email) {
      const emailExists = await Employee.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Employee with this email already exists' });
      }
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;
    employee.designation = designation || employee.designation;
    employee.status = status || employee.status;
    employee.joiningDate = joiningDate || employee.joiningDate;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error updating employee' });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await Employee.deleteOne({ _id: req.params.id });
    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
};

// @desc    Get dashboard analytics metrics
// @route   GET /api/employees/stats
// @access  Private
export const getEmployeeStats = async (req, res) => {
  try {
    // 1. Employee status counts
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const inactiveEmployees = await Employee.countDocuments({ status: 'Inactive' });

    // 2. Department-wise count using aggregate
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          count: 1,
        },
      },
      { $sort: { department: 1 } },
    ]);

    // 3. Monthly Joined Employees (last 6 months or all)
    // We group by month and format it to name (e.g. "Jan", "Feb")
    const monthlyStats = await Employee.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$joiningDate' },
            month: { $month: '$joiningDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly counts to readable months (e.g. "Jan 2026")
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const formattedMonthlyStats = monthlyStats.map((item) => {
      const year = item._id.year;
      const monthIndex = item._id.month - 1;
      const label = `${monthNames[monthIndex]} ${year}`;
      return {
        month: label,
        count: item.count,
      };
    });

    res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departmentStats,
      monthlyStats: formattedMonthlyStats,
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    res.status(500).json({ message: 'Server error generating analytics data' });
  }
};
