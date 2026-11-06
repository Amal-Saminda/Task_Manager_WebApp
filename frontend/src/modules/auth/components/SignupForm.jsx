import { useState } from 'react'
import { Input, PasswordInput, Button } from '../../../shared/components'
import AvatarUpload from './AvatarUpload'
import { validateName, validateEmail, validatePassword, validateToken } from '../utils/validators'

export default function SignupForm({ onSubmit }) {
  const [values, setValues] = useState({ fullName: '', email: '', password: '', inviteToken: '' })
  const [avatar, setAvatar] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === 'inviteToken') value = value.replace(/\D/g, '').slice(0, 6) // digits only
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {
      fullName: validateName(values.fullName),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      inviteToken: validateToken(values.inviteToken),
    }
    setErrors(errs)
    if (Object.values(errs).every((v) => !v)) onSubmit?.({ ...values, avatar })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
      <AvatarUpload onChange={setAvatar} />
      <Input id="fullName" name="fullName" label="Full Name" value={values.fullName}
        onChange={handleChange} error={errors.fullName} />
      <Input id="email" name="email" label="Email Address" type="email" value={values.email}
        onChange={handleChange} error={errors.email} />
      <PasswordInput id="password" name="password" label="Password (min 8 characters)" value={values.password}
        onChange={handleChange} error={errors.password} />
      <Input id="inviteToken" name="inviteToken" label="Admin Invite Token (6 digits)" inputMode="numeric"
        maxLength={6} value={values.inviteToken} onChange={handleChange} error={errors.inviteToken} />
      <Button type="submit" className="mt-2">Create Account</Button>
    </form>
  )
}
