import { Link, NavLink } from 'react-router-dom'
import { Command, FileText, LayoutDashboard, LogOut, Save, Settings, User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/authStore.js'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assistant', label: 'Assistant', icon: Command },
  { to: '/history', label: 'History', icon: FileText },
  { to: '/saved', label: 'Saved', icon: Save },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-5 z-20 hidden h-[calc(100vh-2.5rem)] w-72 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-glass backdrop-blur-2xl lg:block"
      >
        <div className="flex h-full flex-col gap-5">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-3 text-white">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">AI SQL</p>
                <h1 className="text-lg font-semibold">Assistant</h1>
              </div>
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-secondary/20 text-sm font-bold text-violet-100">
                {(user?.name || 'A').slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-50">{user?.name || 'Anonymous'}</p>
                <p className="truncate text-xs text-brand-muted">{user?.email || 'no-email@example.com'}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-white/[0.09] text-white shadow-glow ring-1 ring-white/10'
                        : 'text-brand-muted hover:bg-white/[0.06] hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09]"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </motion.aside>

      <nav className="fixed bottom-3 left-3 right-3 z-30 grid grid-cols-5 rounded-2xl border border-white/10 bg-slate-950/85 p-2 shadow-glass backdrop-blur-2xl lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition ${
                  isActive ? 'bg-white/[0.09] text-white' : 'text-brand-muted'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
