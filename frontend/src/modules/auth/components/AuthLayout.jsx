import { CheckCheck, Star } from 'lucide-react';
import heroImage from '../../../assets/images/auth-hero.jpg';

function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
        <CheckCheck className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">TaskBuddy</span>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="relative hidden p-3 lg:block">
      <div className="relative h-full overflow-hidden rounded-2xl">
        <img
          src={heroImage}
          alt="Woman working on her laptop by a bright window"
          className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <div className="mb-3 flex gap-1" aria-label="5 out of 5 stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-2xl font-medium leading-snug">
            TaskBuddy turned our scattered to-dos into one clear plan. It&apos;s a game-changer!
          </p>
          <p className="mt-5 text-sm font-semibold">Sarah Mitchell</p>
          <p className="text-xs text-white/70">Project Manager</p>

          <div className="mt-5 flex gap-1.5" aria-hidden="true">
            <span className="h-1 w-8 rounded-full bg-white" />
            <span className="h-1 w-3 rounded-full bg-white/40" />
            <span className="h-1 w-3 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-0 sm:p-6 lg:p-8">
      <div className="grid min-h-screen w-full max-w-6xl overflow-hidden bg-white shadow-xl shadow-slate-300/50 sm:min-h-[680px] sm:rounded-3xl lg:grid-cols-2">
        <div className="flex flex-col px-6 py-8 sm:px-12">
          <BrandLogo />

          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
            {children}
          </div>

          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} TaskBuddy. All rights reserved.
          </p>
        </div>

        <HeroPanel />
      </div>
    </div>
  );
}
