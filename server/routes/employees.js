import express from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} from '../controllers/employeeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all employee endpoints
router.use(protect);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/stats')
  .get(getEmployeeStats);

router.route('/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
