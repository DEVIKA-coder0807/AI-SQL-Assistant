import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Copy, Search, SlidersHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'
import { historyService } from '../services/historyService.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

export default function SavedQueriesPage() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const { data } = useQuery({
    queryKey: ['saved-queries', search],
    queryFn: () => historyService.getSaved({ search }),
  })

  const savedQueries = useMemo(() => {
    const items = data?.data?.items || data?.items || []
    return [...items].sort((a, b) => {
      if (sort === 'name') return String(a.title || a.name || '').localeCompare(String(b.title || b.name || ''))
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  }, [data, sort])

  const copySql = async (sql) => {
    await navigator.clipboard.writeText(sql)
    toast.success('Saved SQL copied')
  }

  return (
    <div className="aurora-bg min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-5 xl:gap-7">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <Topbar title="Saved queries" subtitle="Reusable library" />

          <Card title="Find saved SQL" eyebrow="Library controls">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="premium-ring w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-white placeholder:text-slate-600"
                  placeholder="Search saved queries"
                />
              </label>
              <label className="relative block">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="premium-ring w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-white"
                >
                  <option value="newest">Newest first</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
          </Card>

          {savedQueries.length > 0 ? (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {savedQueries.map((query) => {
                const tags = Array.isArray(query.tags) ? query.tags : []
                return (
                  <Card key={query.id} className="surface-hover">
                    <div className="flex h-full flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold text-white">{query.title || query.name || 'Untitled query'}</h2>
                          <p className="mt-1 text-sm text-brand-muted">{query.description || query.category || 'General'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copySql(query.sql)}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/[0.09]"
                          aria-label="Copy SQL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <pre className="max-h-48 overflow-auto rounded-2xl border border-white/10 bg-slate-950/75 p-4 text-xs leading-6 text-slate-200">{query.sql}</pre>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {(tags.length > 0 ? tags : ['general']).map((tag) => (
                          <span key={tag} className="rounded-full bg-brand-primary/15 px-3 py-1 text-xs font-semibold text-violet-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </section>
          ) : (
            <Card>
              <div className="py-14 text-center text-sm text-brand-muted">No saved queries yet.</div>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
