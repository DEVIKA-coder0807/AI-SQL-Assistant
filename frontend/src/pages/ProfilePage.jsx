import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
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

  const onSubmit = (data) => {
    console.log('Profile update', data)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl gap-6 xl:gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar title="Profile" subtitle="Manage your account" />
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card title="Personal details">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-sm font-medium text-slate-300">
                  Full name
                  <input
                    {...register('name')}
                    className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  Email
                  <input
                    {...register('email')}
                    disabled
                    className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-400 outline-none"
                  />
                </label>
                <button type="submit" className="inline-flex items-center gap-2 rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
                  Save changes
                </button>
              </form>
            </Card>
            <Card title="Profile summary">
              <div className="space-y-4 text-slate-300">
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">User ID</p>
                  <p className="mt-2 text-lg font-semibold text-white">{user?.id || 'N/A'}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Current plan</p>
                  <p className="mt-2 text-lg font-semibold text-white">Pro</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Member since</p>
                  <p className="mt-2 text-lg font-semibold text-white">{updatedFields.name ? 'Today' : 'N/A'}</p>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
