import SignupForm from '../components/SignupForm'

export default function SignupPage({ onGoLogin }) {
  const handleSignup = (data) => {
    console.log('signup', data) // 
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-300/60 p-4 [--brand:#7fc4c9]">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-[2fr_3fr]">
        {/* Brand panel (hidden on mobile) */}
        <div className="relative hidden overflow-hidden bg-[#b7dde0] p-8 md:block">
          <span className="text-2xl font-black text-white">M</span>
          <p className="mt-4 max-w-[14rem] text-lg font-medium leading-snug text-white">
            Join your team workspace today.
          </p>
          <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-gradient-to-br from-pink-200 to-pink-300/70" />
          <div className="absolute bottom-28 right-6 h-24 w-24 rounded-full bg-white/60" />
          <div className="absolute bottom-10 right-10 h-40 w-14 rotate-12 rounded-full bg-teal-200/80" />
        </div>

        {/* Form */}
        <div className="px-6 py-10 sm:px-12 md:px-16">
          <div className="mx-auto max-w-sm">
            <h1 className="text-xl font-bold text-slate-900">Create Account</h1>
            <SignupForm onSubmit={handleSignup} />
            <p className="mt-6 text-xs text-slate-500">
              Already have an account?{' '}
              <button onClick={onGoLogin} className="text-[var(--brand)] hover:underline">
                Log in
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
