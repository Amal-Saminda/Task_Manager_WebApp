import { useState } from 'react'
import { Input, PasswordInput, Button } from '../../../shared/components'
import { validateEmail, validatePassword } from '../utils/validators'

export default function LoginForm({ onSubmit }) {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    }
    setErrors(errs)
    if (!errs.email && !errs.password) onSubmit?.(values)

    //Login API Call
    
  }


  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
      <Input id="email" name="email" label="Email" type="email" placeholder="you@example.com"
        value={values.email} onChange={handleChange} error={errors.email} />
      <PasswordInput id="password" name="password" label="Password" placeholder="Please enter your password"
        value={values.password} onChange={handleChange} error={errors.password} />
      <Button type="submit" className="mt-2 sm:w-auto">LOGIN</Button>
    </form>
  )
}
