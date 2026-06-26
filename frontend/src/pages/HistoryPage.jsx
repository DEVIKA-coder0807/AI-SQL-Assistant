import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { historyService } from '../services/historyService.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

const statusClasses = {
  success: 'bg-emerald-400/10 text-emerald-200 ring-emerald-400/20',
  error: 'bg-rose-400/10 text-rose-200 ring-rose-400/20',
  pending: 'bg-cyan-400/10 text-cyan-200 ring-cyan-400/20',
  GENERATED: 'bg-violet-400/10 text-violet-200 ring-violet-400/20',
  VALIDATED: 'bg-cyan-400/10 text-cyan-200 ring-cyan-400/20',
  EXECUTED: 'bg-emerald-400/10 text-emerald-200 ring-emerald-400/20',
  FAILED: 'bg-rose-400/10 text-rose-200 ring-rose-400/20',
  SAVED: 'bg-amber-400/10 text-amber-200 ring-amber-400/20',
}

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const { data } = useQuery({
    queryKey: ['history', search, status, page],
    queryFn: () => historyService.getHistory({ search, status, page }),
  })
  const payload = data?.data ||  {}

  const filteredHistory = useMemo(() => {
    const items = payload.items ||  payload.data?.items || []
    return items.filter((item) => {
      const matchesSearch = `${item.prompt || ''} ${item.sql || ''} ${item.user || ''}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || item.status === status
      return matchesSearch && matchesStatus
    })
  }, [payload.items, search, status])

  return (
    <div className="aurora-bg min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-5 xl:gap-7">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <Topbar title="Query history" subtitle="Audit trail" />

          <Card title="Search and filter" eyebrow="History controls">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="premium-ring w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-600"
                  placeholder="Search prompts, SQL, or topics"
                />
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="premium-ring w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white"
              >
                <option value="all">All statuses</option>
                <option value="GENERATED">Generated</option>
                <option value="VALIDATED">Validated</option>
                <option value="EXECUTED">Executed</option>
                <option value="FAILED">Failed</option>
                <option value="SAVED">Saved</option>
              </select>
            </div>
          </Card>

          <Card title="Recent queries" eyebrow="Table">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="hidden grid-cols-[1.1fr_1.5fr_140px_180px] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted md:grid">
                <span>Prompt</span>
                <span>SQL</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              <div className="divide-y divide-white/10">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <article key={item.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1.1fr_1.5fr_140px_180px] md:items-center">
                      <div>
                        <p className="line-clamp-2 text-sm font-medium text-white">{item.prompt || 'Manual SQL'}</p>
                        <p className="mt-1 text-xs text-brand-muted">{item.id}</p>
                      </div>
                      <pre className="max-h-24 overflow-auto rounded-xl bg-slate-950/70 p-3 text-xs leading-5 text-slate-200">{item.sql}</pre>
                      <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClasses[item.status] || 'bg-white/10 text-slate-200 ring-white/10'}`}>
                        {item.status || 'pending'}
                      </span>
                      <p className="text-sm text-brand-muted">{item.createdAt ? format(new Date(item.createdAt), 'PP p') : 'N/A'}</p>
                    </article>
                  ))
                ) : (
                  <div className="px-5 py-12 text-center text-sm text-brand-muted">No history matches your filters yet.</div>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-brand-muted">
                Page {page} of {payload.pagination?.pages || 1}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.09]"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.09]"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
