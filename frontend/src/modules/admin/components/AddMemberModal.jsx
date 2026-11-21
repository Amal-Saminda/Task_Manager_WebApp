import { useState } from 'react';
import toast from 'react-hot-toast';
import Field from './createTask/Field';
import { inputClass } from './createTask/formStyles';
import SubmitButton from '../../../shared/components/form/SubmitButton';
import axiosInstance from '../../../shared/api/axiosInstance';
import { API_PATHS } from '../../../shared/api/apipaths';
import { getErrorMessage } from '../../../utils/getErrorMessage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, email, password }) => {
  const errors = {};

  if (!name.trim()) errors.name = 'Full name is required';

  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email address';

  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Use at least 8 characters';

  return errors;
};

export default function AddMemberModal({ onClose, onCreated }) {

  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.USERS.CREATE_USER, {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      toast.success('Team member added');
      onCreated(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to add team member'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-slate-900">Add Team Member</h3>

        <Field label="Full Name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={values.name}
            onChange={handleChange}
            className={`${inputClass(errors.name)} h-11`}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={values.email}
            onChange={handleChange}
            className={`${inputClass(errors.email)} h-11`}
          />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Min 8 characters"
            value={values.password}
            onChange={handleChange}
            className={`${inputClass(errors.password)} h-11`}
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl px-4 py-2.5 text-sm text-slate-600"
          >
            Cancel
          </button>

          <div className="w-36">
            <SubmitButton loading={loading} loadingText="Adding...">
              Add Member
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}
