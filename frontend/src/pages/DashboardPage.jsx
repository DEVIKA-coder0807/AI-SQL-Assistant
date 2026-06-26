import { useQuery } from '@tanstack/react-query'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, Clock3, Database, Save, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { analyticsService } from '../services/analyticsService.js'
import Topbar from '../components/ui/Topbar.jsx'
import Sidebar from '../components/ui/Sidebar.jsx'
import Card from '../components/ui/Card.jsx'

const fallbackTrend = [
  { date: 'Mon', queries: 18, executions: 12 },
  { date: 'Tue', queries: 28, executions: 21 },
  { date: 'Wed', queries: 34, executions: 24 },
  { date: 'Thu', queries: 30, executions: 18 },
  { date: 'Fri', queries: 44, executions: 31 },
  { date: 'Sat', queries: 22, executions: 15 },
  { date: 'Sun', queries: 38, executions: 29 },
]



const metricItems = [
  { label: 'SQLs generated', key: 'totalGenerated', value: '0', icon: Sparkles, tone: 'text-violet-200' },
  { label: 'Executions', key: 'totalExecuted', value: '0', icon: Zap, tone: 'text-cyan-200' },
  { label: 'Saved queries', key: 'totalSaved', value: '0', icon: Save, tone: 'text-emerald-200' },
  { label: 'Success rate', key: 'successRate', value: '0%', icon: TrendingUp, tone: 'text-amber-200' },
]

export default function DashboardPage() {
  const { data: dashboard } = useQuery({ 
  queryKey: ['dashboard-metrics'], 
  queryFn: analyticsService.getDashboard,
  staleTime: 0,
  cacheTime: 0,
})
const { data: trendData } = useQuery({ 
  queryKey: ['query-trends'], 
  queryFn: analyticsService.getTrends,
  staleTime: 0,
  cacheTime: 0,
})
const { data: tableUsage } = useQuery({ 
  queryKey: ['table-usage'], 
  queryFn: analyticsService.getTables,
  staleTime: 0,
  cacheTime: 0,
})
  const trends = Array.isArray(trendData?.data?.data) 
  ? trendData.data.data 
  : Array.isArray(trendData?.data) 
    ? trendData.data 
    : fallbackTrend
  const dashboardData = dashboard?.data?.data || dashboard?.data || {}
  const tableData = tableUsage?.data || {}

  const total = (dashboardData.totalExecuted || 0) + (dashboardData.totalSaved || 0)
const successVal = total > 0 ? Math.round(((dashboardData.totalExecuted || 0) / total) * 100) : 0
const savedVal = total > 0 ? Math.round(((dashboardData.totalSaved || 0) / total) * 100) : 0
const failedVal = total > 0 ? Math.max(0, 100 - successVal - savedVal) : 0

const statusData = [
  { name: 'Success', value: successVal || 72, color: '#06B6D4' },
  { name: 'Saved', value: savedVal || 18, color: '#8B5CF6' },
  { name: 'Failed', value: failedVal || 10, color: '#F43F5E' },
]

  return (
    <div className="aurora-bg min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-5 xl:gap-7">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <Topbar title="Dashboard" subtitle="Analytics overview" />

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricItems.map((metric) => {
              const Icon = metric.icon
              return (
                <Card key={metric.label} className="surface-hover">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-brand-muted">{metric.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{dashboardData[metric.key] ?? metric.value}</p>
                    </div>
                    <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
                      <Icon className={`h-5 w-5 ${metric.tone}`} />
                    </span>
                  </div>
                </Card>
              )
            })}
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card title="Query trends" eyebrow="7 day usage">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="queriesGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, color: '#F8FAFC' }} />
                    <Area type="monotone" dataKey="queries" stroke="#8B5CF6" fill="url(#queriesGradient)" strokeWidth={3} />
                    <Area type="monotone" dataKey="executions" stroke="#06B6D4" fill="transparent" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Success mix" eyebrow="Execution health">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={5}>
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, color: '#F8FAFC' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-2">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 text-sm">
                    <span className="flex items-center gap-2 text-brand-muted">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-semibold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
            <Card title="Activity overview" eyebrow="Workspace">
              <div className="space-y-3">
                {[
                  { label: 'Most used table', value: tableData?.data?.mostUsed || tableData?.mostUsed || 'N/A', icon: Database },
                  { label: 'Total queries', value: dashboardData.totalGenerated || 0, icon: Activity },
                  { label: 'Avg response time', value: dashboardData.avgLatency || 'N/A', icon: Clock3 },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div>
                        <p className="text-sm text-brand-muted">{item.label}</p>
                        <p className="mt-1 font-semibold text-white">{item.value}</p>
                      </div>
                      <Icon className="h-5 w-5 text-brand-accent" />
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card title="Query statistics" eyebrow="Volume by workflow">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B1020', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, color: '#F8FAFC' }} />
                    <Bar dataKey="queries" fill="#7C3AED" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="executions" fill="#06B6D4" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
