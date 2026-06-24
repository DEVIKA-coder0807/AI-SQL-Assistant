import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { analyticsService } from '../services/analyticsService.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

const metrics = [
  { label: 'SQLs generated', value: 184 },
  { label: 'Executions', value: 114 },
  { label: 'Saved queries', value: 29 },
  { label: 'Success rate', value: '92%' },
]

export default function DashboardPage() {
  const { data: dashboard } = useQuery(['dashboard-metrics'], analyticsService.getDashboard)
  const { data: trendData } = useQuery(['query-trends'], analyticsService.getTrends)
  const { data: tableUsage } = useQuery(['table-usage'], analyticsService.getTables)

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl gap-6 xl:gap-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar title="Dashboard" subtitle="Overview" />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {metrics.map((metric) => (
                  <div key={metric.label} className="glass-card rounded-[2rem] p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{metric.label}</p>
                    <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
              <Card title="Query trends">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData || []} margin={{ top: 8, right: 0, left: -12, bottom: 0 }}>
                      <CartesianGrid stroke="#334155" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: 16, border: '1px solid #334155' }} />
                      <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
                      <Bar name="Generated queries" dataKey="queries" fill="#38bdf8" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card title="Usage summary">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-900/80 p-5">
                    <div>
                      <p className="text-sm text-slate-400">Most used table</p>
                      <p className="mt-2 text-xl font-semibold text-white">{tableUsage?.mostUsed || 'customers'}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-sky-300">+{tableUsage?.usageIncrease || 18}%</div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                      <p className="text-sm text-slate-400">Active users</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{dashboard?.activeUsers || 52}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                      <p className="text-sm text-slate-400">Avg response time</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{dashboard?.avgLatency || '420ms'}</p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Activity snapshot">
                <div className="space-y-3 text-slate-300">
                  <p>Review the latest query execution performance and system health.</p>
                  <div className="grid gap-3">
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Query success rate</p>
                      <p className="mt-2 text-lg font-semibold text-white">{dashboard?.successRate || '92%'} </p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/80 p-4">
                      <p className="text-sm text-slate-400">Average cost estimate</p>
                      <p className="mt-2 text-lg font-semibold text-white">{dashboard?.cost || '$0.13/query'}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
