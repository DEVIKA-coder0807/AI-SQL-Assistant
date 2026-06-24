import { Bell, Lock, Moon, Sun, ToggleLeft } from 'lucide-react'
import { useAuthStore } from '../stores/authStore.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

export default function SettingsPage() {
  const theme = useAuthStore((state) => state.theme)
  const toggleTheme = useAuthStore((state) => state.toggleTheme)

  return (
    <div className="aurora-bg min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-5 xl:gap-7">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <Topbar title="Settings" subtitle="Workspace" />
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card title="Appearance" eyebrow="Theme">
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-primary/20 text-violet-100">
                    {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="font-semibold text-white">Application theme</p>
                    <p className="text-sm text-brand-muted">Current mode: {theme}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]"
                >
                  <ToggleLeft className="h-4 w-4" />
                  Switch mode
                </button>
              </div>
            </Card>

            <Card title="Platform settings" eyebrow="Status">
              <div className="space-y-3">
                {[
                  { label: 'Notifications', value: 'Email alerts enabled', icon: Bell },
                  { label: 'Security', value: 'JWT protected routes', icon: Lock },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <Icon className="h-5 w-5 text-brand-accent" />
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-sm text-brand-muted">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
