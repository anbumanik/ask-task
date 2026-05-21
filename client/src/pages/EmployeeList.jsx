import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import axios from 'axios';
import useDebounce from '../hooks/useDebounce';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import EmployeeModal from '../components/EmployeeModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  Mail,
  User,
  Layers,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from 'lucide-react';

const DEPARTMENTS = ['All', 'Engineering', 'Marketing', 'Human Resources', 'Sales', 'Finance', 'Design'];
const STATUSES = ['All', 'Active', 'Inactive'];

const EmployeeList = () => {
  // Query filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // 6 rows per page for a compact fit

  // API response state
  const [employees, setEmployees] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { addToast } = useToast();
  const debouncedSearch = useDebounce(search, 400);

  // Fetch employees on filter/page updates
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const params = {
        page,
        limit,
        search: debouncedSearch,
        department,
        status,
      };
      const response = await api.get('/employees', { params });
      setEmployees(response.data.employees);
      setTotalPages(response.data.pages);
      setTotalEmployees(response.data.total);
    } catch (error) {
      console.error('Error loading employee catalog:', error);
      setError(true);
      addToast('Failed to fetch employee list.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, department, status, limit, addToast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Reset page to 1 on search or filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, status]);

  // CRUD operation: Create or Update
  const handleFormSubmit = useCallback(async (formData) => {
    setActionLoading(true);
    try {
      if (selectedEmployee) {
        // ── Edit Mode: update Employee record only ──
        const response = await api.put(`/employees/${selectedEmployee._id}`, formData);
        addToast(`Successfully updated ${response.data.name}'s profile.`, 'success');
      } else {
        // ── Add Mode: call /api/auth/register to create User login + Employee record ──
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name:        formData.name,
          email:       formData.email,
          password:    formData.password,
          department:  formData.department,
          designation: formData.designation,
          joiningDate: formData.joiningDate,
        });
        addToast(`${response.data.name} registered successfully. They can now log in.`, 'success');
      }
      setIsFormOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      const msg = error.response?.data?.message || 'Error occurred during transaction.';
      addToast(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  }, [selectedEmployee, addToast, fetchEmployees]);

  // CRUD operation: Delete
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedEmployee) return;
    setActionLoading(true);
    try {
      await api.delete(`/employees/${selectedEmployee._id}`);
      addToast('Employee record was removed from the database.', 'success');
      setIsConfirmOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error removing employee:', error);
      addToast('Failed to delete employee profile.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [selectedEmployee, addToast, fetchEmployees]);

  const handleEditClick = useCallback((employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((employee) => {
    setSelectedEmployee(employee);
    setIsConfirmOpen(true);
  }, []);

  const handleAddClick = useCallback(() => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  }, []);

  // Quick toggle Active / Inactive
  const handleToggleStatus = async (emp) => {
    const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.put(`/employees/${emp._id}`, { ...emp, status: newStatus });
      addToast(`${emp.name} marked as ${newStatus}.`, 'success');
      fetchEmployees();
    } catch {
      addToast('Failed to update status.', 'error');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/40 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees by name or email..."
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm glass-input"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department filter */}
          <div className="flex items-center gap-2 bg-slate-900/30 px-3 py-1.5 rounded-xl border border-slate-800/40">
            <Layers size={13} className="text-slate-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-transparent text-xs text-slate-200 border-none outline-none focus:ring-0 cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                  Dept: {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 bg-slate-900/30 px-3 py-1.5 rounded-xl border border-slate-800/40">
            <Filter size={13} className="text-slate-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent text-xs text-slate-200 border-none outline-none focus:ring-0 cursor-pointer"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat} className="bg-slate-900 text-slate-200">
                  Status: {stat}
                </option>
              ))}
            </select>
          </div>

          {/* Add Employee Button */}
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 hover:shadow-brand-500/25 active:bg-brand-700 transition-all cursor-pointer border border-brand-500/20 shrink-0"
          >
            <UserPlus size={15} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Main Listing Grid */}
      {loading ? (
        /* Loading Spinner */
        <div className="glass-panel rounded-2xl p-16 flex flex-col items-center justify-center border border-slate-800/40">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-brand-500 mb-4"></div>
          <p className="text-sm font-semibold text-slate-400">Loading employees...</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="glass-panel rounded-2xl p-12 text-center border border-rose-500/20 bg-rose-500/5 flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle size={30} />
          </div>
          <h4 className="mt-4 text-md font-bold text-white">Error loading data</h4>
          <p className="mt-2 text-sm text-slate-400 max-w-sm">
            Something went wrong while fetching the employee list. Please try again.
          </p>
          <button
            onClick={fetchEmployees}
            className="mt-5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition-all border border-slate-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : employees.length === 0 ? (
        /* Empty State UI */
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800/40 flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/60 text-slate-500 border border-slate-800">
            <User size={30} />
          </div>
          <h4 className="mt-4 text-md font-bold text-white">No employees found</h4>
          <p className="mt-2 text-sm text-slate-400 max-w-sm">
            There are no employees matching the current search parameters. Clear the filters or register a new profile.
          </p>
          <button
            onClick={handleAddClick}
            className="mt-5 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-all"
          >
            <UserPlus size={14} />
            Register First Employee
          </button>
        </div>
      ) : (
        /* Table UI */
        <div className="glass-panel rounded-2xl border border-slate-800/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800/60 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Joining Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-900/20 transition-colors">
                    {/* Employee Profile Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/10 font-bold text-brand-400 text-sm border border-brand-500/20">
                          {emp.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{emp.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail size={11} />
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department Cell */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-900/40 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-800/40">
                        {emp.department}
                      </span>
                    </td>

                    {/* Designation Cell */}
                    <td className="px-6 py-4 font-medium text-slate-200">{emp.designation}</td>

                    {/* Joining Date Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-slate-450">
                        <Calendar size={12} className="text-slate-500" />
                        {formatDate(emp.joiningDate)}
                      </div>
                    </td>

                    {/* Status Cell */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 border
                          ${
                            emp.status === 'Active'
                              ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-950/20 text-slate-400 border-slate-800'
                          }`}
                      >
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions Cell */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Quick Activate / Deactivate toggle */}
                        <button
                          onClick={() => handleToggleStatus(emp)}
                          title={emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                            emp.status === 'Active'
                              ? 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                              : 'text-slate-400 border-slate-600/40 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30'
                          }`}
                        >
                          {emp.status === 'Active'
                            ? <><ToggleRight size={15} /> Active</>
                            : <><ToggleLeft size={15} /> Inactive</>}
                        </button>

                        <button
                          onClick={() => handleEditClick(emp)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-850 hover:text-amber-400 hover:border-amber-500/20 border border-transparent transition-all cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(emp)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-850 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition-all cursor-pointer"
                          title="Delete Employee"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer: Pagination controls */}
          <div className="flex items-center justify-between border-t border-slate-800/40 bg-slate-950/20 px-6 py-4 text-xs font-semibold text-slate-400">
            <div>
              Showing <span className="text-slate-200">{(page - 1) * limit + 1}</span> to{' '}
              <span className="text-slate-200">
                {Math.min(page * limit, totalEmployees)}
              </span>{' '}
              of <span className="text-slate-200">{totalEmployees}</span> employee records
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 hover:text-slate-250 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-8 w-8 rounded-lg border text-center transition-all
                      ${
                        page === pageNum
                          ? 'bg-brand-600 border-brand-500 text-white shadow-md'
                          : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-350 hover:text-slate-100'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 hover:text-slate-250 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD modals triggers */}
      <EmployeeModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        employee={selectedEmployee}
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee Profile"
        message={`Are you sure you want to remove ${selectedEmployee?.name} from StaffSphere? This will permanently delete their employee profile and records.`}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default EmployeeList;
