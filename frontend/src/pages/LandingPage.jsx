import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-hero-gradient px-6 pb-20 pt-16 text-slate-100 sm:px-10 lg:px-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/15 px-4 py-2 text-sm font-semibold tracking-[0.18em] text-sky-200">
              <Sparkles className="h-4 w-4" /> AI SQL Assistant
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
                Build, explain, and optimize SQL with AI-powered intent.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
                Turn natural language into production-ready SQL, query impact insights, and analytics—all within a premium AI workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-glass">
            <div className="rounded-[1.75rem] border border-slate-700/80 bg-slate-900/80 p-8 shadow-inner shadow-slate-950/40">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Assistant preview</p>
              <div className="mt-6 space-y-6">
                <div className="rounded-3xl bg-slate-950/95 p-5">
                  <p className="text-sm text-slate-300">"Create a report showing monthly revenue and region breakdown from customers."</p>
                </div>
                <div className="rounded-3xl bg-slate-950/95 p-5">
                  <h3 className="text-sm font-semibold text-slate-100">Generated SQL</h3>
                  <pre className="mt-3 overflow-auto text-xs text-slate-200">
                    {`SELECT region, SUM(revenue) AS total_revenue
FROM sales
WHERE sale_date >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY region
ORDER BY total_revenue DESC;`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
