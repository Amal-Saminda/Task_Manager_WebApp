import { useState } from 'react'
import { LoginPage, SignupPage } from './modules/auth'

export default function App() {
  const [page, setPage] = useState('login') // 'login' | 'signup'

  return page === 'login' ? (
    <LoginPage onGoSignup={() => setPage('signup')} />
  ) : (
    <SignupPage onGoLogin={() => setPage('login')} />
  )
}
