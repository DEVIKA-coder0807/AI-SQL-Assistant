import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-12 text-center shadow-glass">
        <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">404</p>
        <h1 className="mt-6 text-5xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-base text-slate-400">The page you're looking for doesn't exist, or it may have moved.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
