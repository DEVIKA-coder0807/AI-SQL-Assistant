import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BrainCircuit, DatabaseZap, LineChart, Lock, Sparkles, WandSparkles } from 'lucide-react'
import heroImage from '../assets/hero.png'

const features = [
  { title: 'Natural language to SQL', icon: WandSparkles, copy: 'Convert intent into structured queries for real analysis workflows.' },
  { title: 'Explain every query', icon: BrainCircuit, copy: 'Understand joins, filters, grouping, and risk before execution.' },
  { title: 'Optimize with context', icon: DatabaseZap, copy: 'Surface index, cost, and rewrite suggestions for cleaner SQL.' },
]

const benefits = [
  { label: 'Query governance', value: 'JWT secured', icon: Lock },
  { label: 'Usage analytics', value: 'Live trends', icon: LineChart },
  { label: 'Assistant memory', value: 'Saved SQL', icon: Sparkles },
]

export default function LandingPage() {
  return (
    <main className="aurora-bg min-h-screen overflow-hidden text-brand-text">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-2xl">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient shadow-glow">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white">AI SQL Assistant</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-2xl px-4 py-2 text-sm font-medium text-brand-muted transition hover:text-white">
              Sign in
            </Link>
            <Link to="/register" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
              Start
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-cyan-100 shadow-cyan backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-brand-accent" />
              AI-native query workspace
            </span>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                AI SQL Assistant
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-brand-muted sm:text-xl">
                Generate, explain, validate, optimize, execute, and save SQL from one polished assistant workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]"
              >
                Create workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Open dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-brand-gradient opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-glass backdrop-blur-2xl">
              <img src={heroImage} alt="AI SQL Assistant dashboard preview" className="h-48 w-full rounded-xl object-cover opacity-90 sm:h-64" />
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                  <DatabaseZap className="h-4 w-4" />
                  Generated SQL
                </div>
                <pre className="mt-4 overflow-auto text-sm leading-6 text-slate-200">{`SELECT region, COUNT(*) AS queries
FROM QueryHistory
WHERE createdAt >= NOW() - INTERVAL 30 DAY
GROUP BY region
ORDER BY queries DESC;`}</pre>
              </div>
            </div>
          </motion.div>
        </div>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="surface-hover rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-2xl"
              >
                <Icon className="h-6 w-6 text-brand-accent" />
                <h2 className="mt-5 text-lg font-semibold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{feature.copy}</p>
              </motion.article>
            )
          })}
        </section>

        <section className="grid gap-4 border-t border-white/10 py-8 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div key={benefit.label} className="flex items-center gap-4 rounded-2xl bg-white/[0.035] p-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-primary/20 text-violet-100">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-brand-muted">{benefit.label}</p>
                  <p className="font-semibold text-white">{benefit.value}</p>
                </div>
              </div>
            )
          })}
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <span>AI SQL Assistant</span>
          <span>Built for fast, explainable database work.</span>
        </footer>
      </section>
    </main>
  )
}
