import LoginForm from '../components/LoginForm'
import womanImage from '../../../assets/login-woman.jpg'

export default function LoginPage({ onGoSignup }) {
  const handleLogin = (data) => {
    console.log('login', data) // TODO: connect API later
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-50 p-4 [--brand:#3b82f6]"
    >
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border-4 border-blue-800 bg-white shadow-xl md:grid-cols-2">
        {/* Form */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 md:py-16">
          <span className="mb-10 text-xs font-bold tracking-widest text-slate-900">BRAND</span>
          <h1 className="text-4xl font-bold text-slate-900">Login</h1>
          <p className="mt-2 text-xs text-slate-400">Welcome back! Log in to your account.</p>
          <LoginForm onSubmit={handleLogin} />
          <p className="mt-8 text-xs text-slate-500">
            Don't have an account?{' '}
            <button onClick={onGoSignup} className="font-semibold text-[var(--brand)] hover:underline">
              Sign up
            </button>
          </p>
        </div>

        {/* Image (hidden on mobile) */}
        <div className="relative hidden bg-blue-50 md:block">
          <img src={womanImage} alt="Woman working on laptop" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent" />
        </div>
      </section>
    </main>
  )
}
