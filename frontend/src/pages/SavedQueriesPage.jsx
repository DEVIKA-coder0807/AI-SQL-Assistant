import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { historyService } from '../services/historyService.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

export default function SavedQueriesPage() {
  const [search, setSearch] = useState('')
  const { data } = useQuery(['saved-queries', search], () => historyService.getSaved({ search }))

  const savedQueries = data?.items || []

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl gap-6 xl:gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar title="Saved queries" subtitle="Reuse your best SQL" />
          <section className="grid gap-6 xl:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              <Card title="Search saved queries">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="Search saved queries"
                />
              </Card>
              <Card title="Saved query library">
                {savedQueries.length > 0 ? (
                  <div className="space-y-4">
                    {savedQueries.map((query) => (
                      <div key={query.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-lg font-semibold text-white">{query.name}</p>
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">{query.category || 'General'}</span>
                        </div>
                        <pre className="mt-4 overflow-auto rounded-3xl bg-slate-950/95 p-4 text-sm text-slate-200">{query.sql}</pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-slate-400">You haven't saved any queries yet. Save generated SQL in the assistant to revisit it later.</p>
                )}
              </Card>
            </div>
            <Card title="Saved query tips">
              <div className="space-y-4 text-slate-300">
                <p>Tags and naming make queries easier to reuse.</p>
                <p>Use relevant descriptions so your team can quickly find queries later.</p>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
