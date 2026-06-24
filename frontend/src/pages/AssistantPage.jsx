import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Check, Copy, Database, RefreshCcw, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { sqlService } from '../services/sqlService.js'
import { useQueryStore } from '../stores/queryStore.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

export default function AssistantPage() {
  const { register, handleSubmit, reset } = useForm()
  const [activePanel, setActivePanel] = useState('generated')
  const [impactResult, setImpactResult] = useState(null)
  const [executionResult, setExecutionResult] = useState(null)
  const { generatedSql, explanation, alternatives, setGeneratedSql, setExplanation, setImpact, setAlternatives, reset: resetQuery } = useQueryStore()

  const generateMutation = useMutation(sqlService.generateSql, {
    onSuccess: (response) => {
      const result = response.data
      setGeneratedSql(result.sql)
      setExplanation(result.explanation)
      setImpact(result.impact)
      setAlternatives(result.alternatives)
      toast.success('SQL generated successfully')
    },
    onError: () => toast.error('Unable to generate SQL. Try again later.'),
  })

  const executeMutation = useMutation(sqlService.execute, {
    onSuccess: (response) => {
      setExecutionResult(response.data)
      toast.success('Query executed successfully')
    },
    onError: () => toast.error('Execution failed. Check SQL or permissions.'),
  })

  const onSubmit = (data) => {
    const payload = {
      prompt: data.prompt,
      database: data.database,
    }
    generateMutation.mutate(payload)
  }

  const onExecute = () => {
    if (!generatedSql) {
      toast.error('Generate SQL before executing.')
      return
    }
    executeMutation.mutate({ sql: generatedSql })
  }

  const copySql = async () => {
    await navigator.clipboard.writeText(generatedSql)
    toast.success('SQL copied to clipboard')
  }

  const resetAssistant = () => {
    reset({ prompt: '' })
    resetQuery()
    setImpactResult(null)
    setExecutionResult(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl gap-6 xl:gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar title="SQL Assistant" subtitle="Natural language to SQL" />
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <Card title="Build a new SQL query">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
                  <label className="space-y-2 text-sm font-medium text-slate-300">
                    Query intent
                    <textarea
                      required
                      {...register('prompt')}
                      rows={5}
                      className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                      placeholder="Summarize sales by region for the last quarter and include top customers"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-300">
                    Database target
                    <select
                      {...register('database')}
                      className="mt-3 w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    >
                      <option value="analytics_db">analytics_db</option>
                      <option value="sales_db">sales_db</option>
                      <option value="users_db">users_db</option>
                    </select>
                  </label>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Generate SQL
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={resetAssistant}
                    className="inline-flex items-center gap-2 rounded-3xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
                  >
                    Reset
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </Card>
            <Card title="Assistant controls">
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-900/80 p-5 text-sm text-slate-300">
                  <p className="font-medium text-slate-100">Tip</p>
                  <p className="mt-2 leading-6">
                    Ask for table names, affected columns, and execution risk to improve generated SQL relevance.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Query health</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {impactResult?.summary || generatedSql ? 'Ready for analysis' : 'Awaiting SQL'}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Execution result</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{executionResult?.status || 'No execution yet'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onExecute}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Execute Query
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={copySql}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
                  >
                    Copy generated SQL
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <div className="space-y-6">
              <Card title="Generated SQL">
                <pre className="whitespace-pre-wrap rounded-3xl border border-slate-800 bg-slate-950/85 p-5 text-sm leading-6 text-slate-100">
                  {generatedSql || 'Generated SQL will appear here after you submit a prompt.'}
                </pre>
              </Card>
              <Card title="SQL explanation">
                <p className="text-sm leading-7 text-slate-300">{explanation || 'The assistant will break down the generated SQL and explain its structure, columns, and filters.'}</p>
              </Card>
            </div>
            <div className="space-y-6">
              <Card title="Query impact analysis">
                <div className="space-y-4 text-slate-300">
                  <div className="rounded-3xl bg-slate-900/85 p-5">
                    <p className="text-sm text-slate-400">Estimated cost</p>
                    <p className="mt-2 text-lg font-semibold text-white">{impactResult?.cost || impact?.estimatedCost || '$0.12'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/85 p-5">
                    <p className="text-sm text-slate-400">Affected tables</p>
                    <p className="mt-2 text-lg font-semibold text-white">{impactResult?.tables || impact?.tables?.join(', ') || 'N/A'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/85 p-5">
                    <p className="text-sm text-slate-400">Potential risk</p>
                    <p className="mt-2 text-lg font-semibold text-white">{impactResult?.risk || impact?.risk || 'Low'}</p>
                  </div>
                </div>
              </Card>
              <Card title="Alternative SQL queries">
                <div className="space-y-4">
                  {alternatives.length > 0 ? (
                    alternatives.map((alt, index) => (
                      <div key={index} className="rounded-3xl bg-slate-900/85 p-4 text-sm text-slate-200">
                        <p className="font-semibold text-slate-100">Alternative {index + 1}</p>
                        <pre className="mt-2 break-words text-slate-300">{alt}</pre>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-slate-400">Alternative SQL suggestions will appear here once generation completes.</p>
                  )}
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
