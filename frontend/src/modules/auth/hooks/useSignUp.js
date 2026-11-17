import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { PATHS, getDashboardPath } from '../../../routes/paths';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { validateSignUp } from '../utils/validators';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  password: '',
  signupAs: 'member', // 'member' | 'admin'
  inviteToken: '',
  profileImage: null,
};

export default function useSignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleChange = (e) => setField(e.target.name, e.target.value);
  const handleRoleChange = (role) => {
    setField('signupAs', role);
    if (role === 'member') setField('inviteToken', '');
  };
  const handleImageChange = (file) => setField('profileImage', file);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignUp(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      const data = await register({
        ...values,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        // members never send a token; only admin signups do
        inviteToken: values.signupAs === 'admin' ? values.inviteToken.trim() : '',
      });

      // API returned a token -> already signed in. Otherwise go to login.
      if (data?.token) {
        navigate(getDashboardPath(data.role), { replace: true });
      } else {
        navigate(PATHS.LOGIN, { replace: true, state: { registered: true } });
      }
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not create your account'));
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, serverError, loading, handleChange, handleRoleChange, handleImageChange, handleSubmit };
}
