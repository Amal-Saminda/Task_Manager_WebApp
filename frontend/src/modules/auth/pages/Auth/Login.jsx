import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, LogIn, Mail } from 'lucide-react';

import AuthLayout from '../../components/AuthLayout';
import FormInput from '../../../../shared/components/form/FormInput';
import PasswordInput from '../../../../shared/components/form/PasswordInput';
import SubmitButton from '../../../../shared/components/form/SubmitButton';

import useLogin from '../../hooks/useLogin';
import { PATHS } from '../../../../routes/paths';

export default function Login() {
  const { values, errors, serverError, loading, handleChange, handleSubmit } = useLogin();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <LogIn className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Login to your account</h1>
        <p className="mt-1.5 text-sm text-slate-500">Welcome back, please enter your details</p>
      </div>

      {justRegistered && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Account created. Please log in.
        </div>
      )}

      {serverError && (
        <div role="alert" className="mb-5 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormInput
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          required
          autoComplete="email"
          placeholder="name@website.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />

        <PasswordInput
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="pt-2">
          <SubmitButton loading={loading} loadingText="Logging in...">
            Log in
          </SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Not registered yet?{' '}
        <Link to={PATHS.SIGN_UP} className="font-semibold text-slate-900 underline underline-offset-4 hover:text-blue-600">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
