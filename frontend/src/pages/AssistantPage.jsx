import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Copy, Database, FileText, Play, RefreshCcw, Save, Sparkles, WandSparkles, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { sqlService } from '../services/sqlService.js'
import { useQueryStore } from '../stores/queryStore.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const quickPrompts = [
  'Show weekly active users and growth rate',
  'Find customers with failed payments this month',
  'Rank saved queries by execution count',
]

export default function AssistantPage() {
  const { register, handleSubmit, reset, setValue } = useForm()
  const [activePanel, setActivePanel] = useState('generated')
  const [impactResult, setImpactResult] = useState(null)
  const [executionResult, setExecutionResult] = useState(null)
  const { generatedSql, explanation, impact, alternatives, setGeneratedSql, setExplanation, setImpact, setAlternatives, reset: resetQuery } = useQueryStore()

  const generateMutation = useMutation({
    mutationFn: sqlService.generateSql,
    onSuccess: (response) => {
      const result = response.data.data
      console.log("Generate API Response:", result);
     console.log("Generated SQL:", result.sql);
      setGeneratedSql(result.sql)
      setExplanation(result.explanation)
      setImpact(result.impact)
      setAlternatives(result.alternatives || [])
      setActivePanel('generated')
      toast.success('SQL generated successfully')
    },
    onError: () => toast.error('Unable to generate SQL. Try again later.'),
  })

  const optimizeMutation = useMutation({
  mutationFn: sqlService.optimizeSql,
  onSuccess: (response) => {
    console.log("Optimize response:", response.data);
    setAlternatives([response.data.data.optimization]);
    setActivePanel("optimize");
    toast.success("Optimization generated");
  },
  onError: () => {
    toast.error("Unable to optimize SQL");
  },
})

  const explainMutation = useMutation({
  mutationFn: sqlService.explainSql,

  onSuccess: (response) => {
  console.log("FULL RESPONSE");
    console.log(response);
    console.log(response.data);
    console.log(response.data.data);

    setExplanation(response.data.data.explanation);
    setActivePanel("explanation");
    toast.success("Explanation generated");
},

  onError: () => {
    console.log(error);
    toast.error("Unable to explain SQL")
  },
})

  const executeMutation = useMutation({
    mutationFn: sqlService.execute,
    onSuccess: (response) => {
      setExecutionResult(response.data)
      toast.success('Query executed successfully')
    },
    onError: () => toast.error('Execution failed. Check SQL or permissions.'),
  })

  const onSubmit = (data) => {
    const payload = {
      question: data.prompt,
      dialect: "MySQL",
    }
    generateMutation.mutate(payload)
  }

 const onExplain = () => {
  console.log("Explain button clicked");
  console.log("generatedSql =", generatedSql);

  if (!generatedSql) {
    toast.error("Generate SQL first.")
    return
  }

  explainMutation.mutate({
    sql: generatedSql,
  })
}

  const copySql = async () => {
    if (!generatedSql) {
      toast.error('No SQL to copy yet.')
      return
    }
    await navigator.clipboard.writeText(generatedSql)
    toast.success('SQL copied to clipboard')
  }

  const resetAssistant = () => {
    reset({ prompt: '' })
    resetQuery()
    setImpactResult(null)
    setExecutionResult(null)
    setActivePanel('generated')
  }

  const panelCopy = {
    generated: generatedSql || 'Generated SQL will appear here after you submit a prompt.',
    explanation: explanation || 'The assistant will explain the generated SQL structure after generation.',
   optimize: alternatives.length > 0 ? alternatives[0] : 'Click "Optimize Query" to get suggestions and optimized SQL.',
  }

  return (
    <div className="aurora-bg min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-5 xl:gap-7">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <Topbar title="SQL Assistant" subtitle="Natural language workspace" />

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card title="Ask the assistant" eyebrow="Prompt">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-sm font-medium text-slate-200">
                  Query intent
                  <textarea
                    required
                    {...register('prompt')}
                    rows={7}
                    className="premium-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-4 text-white placeholder:text-slate-600"
                    placeholder="Summarize sales by region for the last quarter and include top customers"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setValue('prompt', prompt)}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-brand-muted transition hover:bg-white/[0.09] hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <label className="text-sm font-medium text-slate-200">
                    Database target
                    <select
                      {...register('database')}
                      className="premium-ring mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-white"
                    >
                      <option value="analytics_db">analytics_db</option>
                      <option value="sales_db">sales_db</option>
                      <option value="users_db">users_db</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
                  >
                    <WandSparkles className="h-4 w-4" />
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={resetAssistant}
                    className="mt-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white transition hover:bg-white/[0.09]"
                    aria-label="Reset assistant"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </Card>

            <Card title="Query actions" eyebrow="Tools">
              <div className="grid gap-3">
                {[
                  {
                      label: 'Explain Query',
                      icon: FileText,
                     onClick: () => {
                      console.log("BUTTON PRESSED");
                     onExplain();
                    },
},
                 {
  label: 'Optimize Query',
  icon: Zap,
  onClick: () => {
    if (!generatedSql) {
      toast.error("Generate SQL first.");
      return;
    }
    optimizeMutation.mutate({ sql: generatedSql });
  }
},
                  {
  label: 'Save Query',
  icon: Save,
  onClick: async () => {
    if (!generatedSql) {
      toast.error("Generate SQL first.");
      return;
    }
    try {
      await sqlService.saveQuery({
        sql: generatedSql,
        title: `Query ${new Date().toLocaleString()}`,
        tags: [],
      });
      toast.success("Query saved successfully!");
    } catch (err) {
      toast.error("Failed to save query.");
    }
  }
},
                  { label: 'Execute Query', icon: Play, onClick: () => toast("Execute coming soon")   },
                ].map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.09]"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-brand-accent" />
                        {action.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-brand-muted" />
                    </button>
                  )
                })}
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-white/[0.04] p-4">
                  <p className="text-sm text-brand-muted">Query state</p>
                  <p className="mt-1 font-semibold text-white">{generatedSql ? 'Ready for review' : 'Waiting for prompt'}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.04] p-4">
                  <p className="text-sm text-brand-muted">Execution</p>
                  <p className="mt-1 font-semibold text-white">{executionResult?.status || executionResult?.message || 'Not executed'}</p>
                </div>
              </div>
            </Card>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card
              title="Assistant output"
              eyebrow={activePanel}
              action={
                <button
                  type="button"
                  onClick={copySql}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              }
            >
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  { id: 'generated', label: 'SQL' },
                  { id: 'explanation', label: 'Explain' },
                  { id: 'optimize', label: 'Optimize' },
                ].map((panel) => (
                  <button
                    key={panel.id}
                    type="button"
                    onClick={() => setActivePanel(panel.id)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      activePanel === panel.id ? 'bg-brand-secondary text-white' : 'bg-white/[0.05] text-brand-muted hover:text-white'
                    }`}
                  >
                    {panel.label}
                  </button>
                ))}
              </div>
              <motion.div
  key={activePanel}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  className="min-h-80 overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-sm leading-7 text-slate-100"
>
  {activePanel === 'explanation' || activePanel === 'optimize' ? (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({node, ...props}) => <h1 className="text-lg font-bold text-purple-400 mt-4 mb-2" {...props} />,
        p: ({node, ...props}) => <p className="mb-3 text-slate-200" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 text-slate-200" {...props} />,
        li: ({node, ...props}) => <li className="mb-1" {...props} />,
        strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
        table: ({node, ...props}) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse text-sm" {...props} />
          </div>
        ),
        thead: ({node, ...props}) => <thead className="bg-white/10" {...props} />,
        th: ({node, ...props}) => (
          <th className="border border-white/20 px-4 py-2 text-left font-semibold text-white" {...props} />
        ),
        td: ({node, ...props}) => (
          <td className="border border-white/20 px-4 py-2 text-slate-300" {...props} />
        ),
        tr: ({node, ...props}) => (
          <tr className="hover:bg-white/5 transition" {...props} />
        ),
        code: ({node, ...props}) => (
          <code className="bg-white/10 px-1 py-0.5 rounded text-purple-400 font-mono" {...props} />
        ),
      }}
    >
      {panelCopy[activePanel]}
    </ReactMarkdown>
  ) : (
    <pre className="whitespace-pre-wrap font-mono">{panelCopy[activePanel]}</pre>
  )}
</motion.div>
            </Card>

            <div className="space-y-5">
              <Card title="Impact analysis" eyebrow="Risk">
                <div className="space-y-3">
                  {[
                    { label: 'Estimated cost', value: impactResult?.cost || impact?.estimatedCost || '$0.12' },
                    { label: 'Affected tables', value: impactResult?.tables || impact?.tables?.join(', ') || 'N/A' },
                    { label: 'Potential risk', value: impactResult?.risk || impact?.risk || 'Low' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm text-brand-muted">{item.label}</p>
                      <p className="mt-1 font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="History panel" eyebrow="Recent">
                <div className="space-y-3">
                  {[generatedSql ? 'Generated query ready' : 'No generated query', executionResult ? 'Execution completed' : 'No execution yet'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 text-sm text-slate-200">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-primary/20">
                        <Check className="h-4 w-4 text-brand-accent" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
