import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/authService.js'
import { useAuthStore } from '../stores/authStore.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const token = useAuthStore((state) => state.token)
  const { register, handleSubmit } = useForm()

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
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-glass backdrop-blur-xl">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/70">Welcome back</p>
          <h1 className="text-4xl font-semibold">Sign in to your workspace</h1>
          <p className="text-slate-400">Access your AI SQL assistant, analytics, and saved queries.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium text-slate-300">
            Email
            <input
              type="email"
              required
              {...register('email')}
              className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              type="password"
              required
              {...register('password')}
              className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              placeholder="Enter your password"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Continue
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          New to the platform?{' '}
          <Link to="/register" className="font-semibold text-slate-100 hover:text-white">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
