import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Sparkles, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService.js'
import { useAuthStore } from '../stores/authStore.js'

export default function RegisterPage() {
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
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      const { user, token: authToken } = response.data
      localStorage.setItem('aiSqlToken', authToken)
      setUser(user, authToken)
      toast.success('Account created successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to register. Please try again.')
    }
  }

  return (
    <main className="aurora-bg grid min-h-screen lg:grid-cols-[1fr_560px]">
      <section className="hidden min-h-screen flex-col justify-between p-10 lg:flex">
        <Link to="/" className="flex items-center gap-3 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.18em]">AI SQL Assistant</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-cyan-100">
            <UserPlus className="h-4 w-4 text-brand-accent" />
            New workspace
          </div>
          <h1 className="text-6xl font-semibold leading-[1.02] text-white">Create a sharper SQL workflow.</h1>
          <p className="text-lg leading-8 text-brand-muted">
            Bring AI generation, impact analysis, saved queries, and analytics into one calm interface.
          </p>
        </motion.div>
        <div className="space-y-3">
          {['JWT protected workspace', 'Query history and saved SQL', 'AI explanations and optimization'].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-semibold text-white">
              <CheckCircle2 className="h-5 w-5 text-brand-accent" />
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
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">Create account</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Start building</h1>
            <p className="mt-2 text-sm leading-6 text-brand-muted">Set up your AI SQL workspace in seconds.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium text-slate-200">
              Full name
              <input
                type="text"
                required
                {...register('name')}
                className="premium-ring mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-600"
                placeholder="Maria Wells"
              />
            </label>
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
                placeholder="Create a strong password"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Confirm password
              <input
                type="password"
                required
                {...register('confirmPassword')}
                className="premium-ring mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-600"
                placeholder="Confirm your password"
              />
            </label>
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-brand-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-cyan-100">
              Sign in
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  )
}
