import React, { useState, useEffect, useCallback } from 'react';
import { X, UserPlus, Edit, Save, Briefcase, Tag, Mail, User, Calendar, Activity, ChevronDown } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering', 'Design', 'Marketing', 'Sales',
  'Finance', 'Human Resources', 'Operations', 'Legal', 'Product', 'Support',
];

const DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Engineering Manager',
  'UI/UX Designer', 'Product Designer', 'Product Manager', 'Business Analyst',
  'Marketing Executive', 'Sales Executive', 'HR Manager', 'Finance Analyst',
  'Operations Manager', 'Legal Counsel', 'Customer Support', 'Intern',
];

const STATUS_OPTIONS = ['Active', 'Inactive'];

/* ── Reusable field components (defined OUTSIDE to prevent re-render focus loss) ── */

const FieldLabel = React.memo(({ children }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
    {children}
  </label>
));

FieldLabel.displayName = 'FieldLabel';

const TextField = React.memo(({ id, name, type = 'text', value, onChange, placeholder, Icon, error }) => (
  <div>
    <FieldLabel>{name === 'name' ? 'Full Name' : name === 'email' ? 'Email Address' : name}</FieldLabel>
    <div className="relative">
      {Icon && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Icon size={15} />
        </span>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full rounded-xl border py-2.5 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-sm text-white placeholder-slate-500 bg-white/5 backdrop-blur-md transition focus:outline-none focus:ring-2 ${
          error ? 'border-rose-500 focus:ring-rose-500/30' : 'border-white/10 focus:ring-[#4F46E5]/40'
        }`}
      />
    </div>
    {error && <p className="mt-1 text-xs font-medium text-rose-400">{error}</p>}
  </div>
));

TextField.displayName = 'TextField';

const SelectField = React.memo(({ id, name, label, value, onChange, options, placeholder, Icon, error }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <div className="relative">
      {Icon && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Icon size={15} />
        </span>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full appearance-none rounded-xl border py-2.5 pl-10 pr-8 text-sm bg-[#1a1d27] backdrop-blur-md transition focus:outline-none focus:ring-2 ${
          value ? 'text-white' : 'text-slate-500'
        } ${error ? 'border-rose-500 focus:ring-rose-500/30' : 'border-white/10 focus:ring-[#4F46E5]/40'}`}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(o => (
          <option key={o} value={o} className="text-white bg-[#1a1d27]">{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
        <ChevronDown size={14} />
      </span>
    </div>
    {error && <p className="mt-1 text-xs font-medium text-rose-400">{error}</p>}
  </div>
));

SelectField.displayName = 'SelectField';

/* ─────────────────────────────────────────────────────────────────── */

const EmployeeModal = ({ isOpen, onClose, onSubmit, employee = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', designation: '',
    status: 'Active', joiningDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name:        employee.name        || '',
        email:       employee.email       || '',
        department:  employee.department  || '',
        designation: employee.designation || '',
        status:      employee.status      || 'Active',
        joiningDate: employee.joiningDate
          ? new Date(employee.joiningDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        name: '', email: '',
        department:  DEPARTMENTS[0],
        designation: DESIGNATIONS[0],
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const isEditMode = !!employee;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const validate = useCallback(() => {
    const e = {};
    if (!formData.name.trim())                          e.name        = 'Full name is required';
    if (!formData.email.trim())                         e.email       = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))     e.email       = 'Please provide a valid email';
    if (!formData.department)                           e.department  = 'Department is required';
    if (!formData.designation)                          e.designation = 'Designation is required';
    if (!formData.status)                               e.status      = 'Status is required';
    if (!formData.joiningDate)                          e.joiningDate = 'Joining date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [formData]);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  }, [formData, validate, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-[#0f1117]/80 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0f1117] shadow-2xl backdrop-blur-xl">

        {/* Purple/Indigo top glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-80 rounded-full bg-[#4F46E5]/20 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isEditMode
                ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                : 'bg-[#4F46E5]/20 text-[#818cf8] ring-1 ring-[#4F46E5]/30'
            }`}>
              {isEditMode ? <Edit size={17} /> : <UserPlus size={17} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isEditMode ? 'Edit Employee Profile' : 'Register New Employee'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditMode ? 'Update employee details below' : 'Fill in the employee details below'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/10 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4 p-6 max-h-[65vh] overflow-y-auto">

            {/* Full Name */}
            <TextField
              id="emp-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name (e.g. Alexander Pierce)"
              Icon={User}
              error={errors.name}
            />

            {/* Email */}
            <TextField
              id="emp-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email (e.g. alex@company.com)"
              Icon={Mail}
              error={errors.email}
            />



            {/* Department & Designation */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField
                id="emp-department"
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                options={DEPARTMENTS}
                placeholder="Select department"
                Icon={Briefcase}
                error={errors.department}
              />
              <SelectField
                id="emp-designation"
                name="designation"
                label="Designation"
                value={formData.designation}
                onChange={handleChange}
                options={DESIGNATIONS}
                placeholder="Select designation"
                Icon={Tag}
                error={errors.designation}
              />
            </div>

            {/* Status & Joining Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField
                id="emp-status"
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                options={STATUS_OPTIONS}
                Icon={Activity}
                error={errors.status}
              />
              <div>
                <FieldLabel>Joining Date</FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Calendar size={15} />
                  </span>
                  <input
                    type="date"
                    id="emp-joiningDate"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-white bg-white/5 backdrop-blur-md transition focus:outline-none focus:ring-2 ${
                      errors.joiningDate ? 'border-rose-500 focus:ring-rose-500/30' : 'border-white/10 focus:ring-[#4F46E5]/40'
                    }`}
                  />
                </div>
                {errors.joiningDate && <p className="mt-1 text-xs font-medium text-rose-400">{errors.joiningDate}</p>}
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 border-t border-white/10 bg-white/5 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-lg transition disabled:opacity-55 ${
                isEditMode
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  : 'bg-[#4F46E5] hover:bg-[#4338CA] shadow-[#4F46E5]/30'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={15} />
                  {isEditMode ? 'Update Details' : 'Register Profile'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
