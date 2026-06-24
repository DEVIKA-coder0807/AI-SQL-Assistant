import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar, Crown, Fingerprint, Mail, Save, User } from 'lucide-react'
import { useAuthStore } from '../stores/authStore.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name || '', email: user?.email || '' } })

  const updatedFields = useMemo(
    () => ({ name: user?.name || '', email: user?.email || '' }),
    [user],
  )

  const initials = (updatedFields.name || updatedFields.email || 'A').slice(0, 1).toUpperCase()

  const onSubmit = (data) => {
    console.log('Profile update', data)
  }

  return (
    <div className="aurora-bg min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-5 xl:gap-7">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <Topbar title="Profile" subtitle="Account" />

          <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
            <Card>
              <div className="text-center">
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-[2rem] bg-brand-gradient text-4xl font-semibold text-white shadow-glow">
                  {initials}
                </div>
                <h1 className="mt-5 text-2xl font-semibold text-white">{updatedFields.name || 'Anonymous'}</h1>
                <p className="mt-1 text-sm text-brand-muted">{updatedFields.email || 'no-email@example.com'}</p>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { label: 'User ID', value: user?.id || 'N/A', icon: Fingerprint },
                  { label: 'Current plan', value: 'Pro', icon: Crown },
                  { label: 'Member since', value: updatedFields.name ? 'Today' : 'N/A', icon: Calendar },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <Icon className="h-5 w-5 text-brand-accent" />
                      <div className="min-w-0">
                        <p className="text-xs text-brand-muted">{item.label}</p>
                        <p className="truncate text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card title="Account settings" eyebrow="Personal details">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-sm font-medium text-slate-200">
                  Full name
                  <span className="relative mt-2 block">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                    <input
                      {...register('name')}
                      className="premium-ring w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-white"
                    />
                  </span>
                </label>
                <label className="block text-sm font-medium text-slate-200">
                  Email
                  <span className="relative mt-2 block">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                    <input
                      {...register('email')}
                      disabled
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/50 py-3 pl-11 pr-4 text-brand-muted"
                    />
                  </span>
                </label>
                <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]">
                  <Save className="h-4 w-4" />
                  Save changes
                </button>
              </form>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
