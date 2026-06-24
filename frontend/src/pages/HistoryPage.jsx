import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { historyService } from '../services/historyService.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const { data } = useQuery(['history', search, status], () => historyService.getHistory({ search, status }))

  const filteredHistory = useMemo(() => {
    if (!data?.items) return []
    return data.items.filter((item) => {
      const matchesSearch = `${item.prompt} ${item.sql} ${item.user}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = status === 'all' || item.status === status
      return matchesSearch && matchesStatus
    })
  }, [data, search, status])

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl gap-6 xl:gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar title="Query history" subtitle="Review what you generated" />
          <section className="grid gap-6 xl:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              <Card title="Search history">
                <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    placeholder="Search prompts, SQL, or topics"
                  />
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  >
                    <option value="all">All statuses</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </Card>
              <Card title="Recent queries">
                <div className="space-y-4">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-slate-400">{format(new Date(item.createdAt), 'PPpp')}</p>
                            <p className="mt-2 text-lg font-semibold text-white">{item.prompt}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'success' ? 'bg-emerald-500/15 text-emerald-200' : item.status === 'error' ? 'bg-rose-500/15 text-rose-200' : 'bg-sky-500/15 text-sky-200'}`}>
                            {item.status}
                          </span>
                        </div>
                        <pre className="mt-4 max-h-40 overflow-auto rounded-3xl bg-slate-950/95 p-4 text-sm text-slate-200">
                          {item.sql}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-slate-400">No history matches your filters yet. Generate a query in the assistant to populate this page.</p>
                  )}
                </div>
              </Card>
            </div>
            <Card title="Activity details">
              <div className="space-y-4 text-slate-300">
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Use filters to find past SQL generations and execution artifacts.</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Status breakdown</p>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex items-center justify-between text-white">
                      <span>Success</span>
                      <span>{data?.summary?.successCount ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Error</span>
                      <span>{data?.summary?.errorCount ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Pending</span>
                      <span>{data?.summary?.pendingCount ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
