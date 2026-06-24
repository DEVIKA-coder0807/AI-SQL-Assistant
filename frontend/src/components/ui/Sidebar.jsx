import { Link, NavLink } from 'react-router-dom'
import { Activity, Command, FileText, LayoutDashboard, Save, Settings, User, Sparkles } from 'lucide-react'
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
    <aside className="sticky top-0 z-20 hidden w-80 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-glass lg:block">
      <div className="flex flex-col gap-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-3 text-white">
            <Sparkles className="h-7 w-7 text-sky-400" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300/80">AI SQL Studio</p>
              <h1 className="text-xl font-semibold">SQL Assistant</h1>
            </div>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/80 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
          <p className="mt-2 text-lg font-semibold text-slate-50">{user?.name || 'Anonymous'}</p>
          <p className="text-sm text-slate-400">{user?.email || 'no-email@example.com'}</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-slate-800 text-white shadow-glow' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
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
          className="mt-auto inline-flex w-full items-center justify-center rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
