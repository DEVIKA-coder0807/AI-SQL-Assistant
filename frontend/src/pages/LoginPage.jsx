import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Database, LockKeyhole, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService.js'
import { useAuthStore } from '../stores/authStore.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const token = useAuthStore((state) => state.token)
  const { register, handleSubmit, formState } = useForm()

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [token, navigate])

  const onSubmit = async (data) => {
    try {
      const response = await authService.login(data)
      const { user, token: authToken } = response.data
      localStorage.setItem('aiSqlToken', authToken)
      setUser(user, authToken)
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to sign in. Please check your credentials.')
    }
  }

  return (
    <main className="aurora-bg grid min-h-screen lg:grid-cols-[1fr_520px]">
      <section className="hidden min-h-screen flex-col justify-between p-10 lg:flex">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.18em]">AI SQL Assistant</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-cyan-100">
            <Database className="h-4 w-4 text-brand-accent" />
            Secure query workspace
          </div>
          <h1 className="text-6xl font-semibold leading-[1.02] text-white">Return to your SQL command center.</h1>
          <p className="text-lg leading-8 text-brand-muted">
            Pick up saved queries, review analytics, and continue generating production-focused SQL.
          </p>
        </motion.div>
        <div className="grid grid-cols-3 gap-3">
          {['Generate', 'Explain', 'Optimize'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-semibold text-white">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-glass backdrop-blur-2xl sm:p-8"
        >
          <div className="mb-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
              <LockKeyhole className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Sign in</h1>
            <p className="mt-2 text-sm leading-6 text-brand-muted">Access your dashboard and assistant workspace.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium text-slate-200">
              Email
              <input
                type="email"
                required
                {...register('email')}
                className="premium-ring mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-600"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                type="password"
                required
                {...register('password')}
                className="premium-ring mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-600"
                placeholder="Enter your password"
              />
            </label>
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-brand-muted">
            New to the platform?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-cyan-100">
              Create an account
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  )
}
