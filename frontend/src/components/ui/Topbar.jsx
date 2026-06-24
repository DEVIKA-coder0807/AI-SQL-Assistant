import { Menu, Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/authStore.js'

export default function Topbar({ title, subtitle }) {
  const theme = useAuthStore((state) => state.theme)
  const toggleTheme = useAuthStore((state) => state.toggleTheme)

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-4 z-10 mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/75 px-5 py-4 shadow-glass backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">{subtitle}</p>
        <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 transition hover:bg-white/[0.09] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200 transition hover:bg-white/[0.09]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-brand-accent" /> : <Moon className="h-4 w-4 text-slate-200" />}
        </button>
      </div>
    </motion.div>
  )
}
