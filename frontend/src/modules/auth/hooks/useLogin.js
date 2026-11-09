import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { getDashboardPath } from '../../../routes/paths';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { validateLogin } from '../utils/validators';

export default function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      const user = await login({ email: values.email.trim(), password: values.password });
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, serverError, loading, handleChange, handleSubmit };
}
