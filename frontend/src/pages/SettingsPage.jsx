import { useAuthStore } from '../stores/authStore.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

export default function SettingsPage() {
  const theme = useAuthStore((state) => state.theme)
  const toggleTheme = useAuthStore((state) => state.toggleTheme)

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl gap-6 xl:gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar title="Settings" subtitle="Configure your workspace" />
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card title="Theme settings">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm font-medium text-slate-200">Application theme</p>
                  <p className="mt-2 text-sm text-slate-400">Select a theme for your AI SQL workspace.</p>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="mt-4 inline-flex items-center gap-2 rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Switch to {theme === 'dark' ? 'light' : 'dark'} mode
                  </button>
                </div>
              </div>
            </Card>
            <Card title="Platform settings">
              <div className="space-y-4 text-slate-300">
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Notifications</p>
                  <p className="mt-2 text-sm">Email alerts for query failures and usage milestones are currently enabled.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Security</p>
                  <p className="mt-2 text-sm">JWT authentication secures all protected pages and API requests.</p>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
