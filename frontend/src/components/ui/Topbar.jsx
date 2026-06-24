import { Moon, Sun } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore.js'

export default function Topbar({ title, subtitle }) {
  const theme = useAuthStore((state) => state.theme)
  const toggleTheme = useAuthStore((state) => state.toggleTheme)

  return (
    <div className="sticky top-0 z-10 mb-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/85 px-6 py-5 shadow-glass backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">{subtitle}</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex items-center gap-2 self-start rounded-3xl bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700 md:self-center"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4 text-sky-300" /> : <Moon className="h-4 w-4 text-slate-200" />}
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </div>
  )
}
