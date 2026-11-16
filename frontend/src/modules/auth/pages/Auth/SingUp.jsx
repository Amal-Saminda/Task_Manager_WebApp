import { Link } from 'react-router-dom';
import { KeyRound, Mail, UserRound } from 'lucide-react';

import AuthLayout from '../../components/AuthLayout';
import ProfileImageUpload from '../../components/ProfileImageUpload';

import FormInput from '../../../../shared/components/form/FormInput';
import PasswordInput from '../../../../shared/components/form/PasswordInput';
import SubmitButton from '../../../../shared/components/form/SubmitButton';

import useSignUp from '../../hooks/useSignUp';
import { PATHS } from '../../../../routes/paths';

export default function SingUp() {
  const { values, errors, serverError, loading, handleChange, handleImageChange, handleSubmit } =
    useSignUp();

  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-slate-500">Join TaskBuddy and organize your work</p>
      </div>

      {serverError && (
        <div role="alert" className="mb-5 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <ProfileImageUpload
          file={values.profileImage}
          onChange={handleImageChange}
          error={errors.profileImage}
        />

        <FormInput
          label="Full name"
          name="fullName"
          icon={UserRound}
          required
          autoComplete="name"
          placeholder="John Doe"
          value={values.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

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
          autoComplete="new-password"
          placeholder="Create a password"
          hint="At least 8 characters, with a letter and a number"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <FormInput
          label="Admin invite token (optional)"
          name="inviteToken"
          icon={KeyRound}
          autoComplete="off"
          placeholder="Enter your invite token"
          hint="Leave empty to sign up as a normal user"
          value={values.inviteToken}
          onChange={handleChange}
          error={errors.inviteToken}
        />

        <div className="pt-2">
          <SubmitButton loading={loading} loadingText="Creating account...">
            Create account
          </SubmitButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to={PATHS.LOGIN} className="font-semibold text-slate-900 underline underline-offset-4 hover:text-blue-600">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
