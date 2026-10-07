'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatMonthYear } from '@/lib/utils'
import { TrendingUp, TrendingDown, Wallet, Ship, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { SailingShip } from '@/components/ocean-anim'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'

interface DashboardData {
  totalIncome: number
  totalExpense: number
  netCashflow: number
  vesselCount: number
  monthlyData: { month: string; income: number; expense: number; net: number }[]
  vesselData: { name: string; income: number; expense: number }[]
  recentTransactions: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const [transactions, vessels] = await Promise.all([
        supabase
          .from('transactions')
          .select('*, category:transaction_categories(*), vessel:vessels(*)')
          .order('transaction_date', { ascending: false }),
        supabase.from('vessels').select('*'),
      ])

      const txns = transactions.data || []
      const vesselList = vessels.data || []

      const totalIncome = txns.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
      const totalExpense = txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)

      // Monthly aggregation
      const monthMap: Record<string, { income: number; expense: number }> = {}
      txns.forEach(t => {
        const d = new Date(t.transaction_date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 }
        if (t.type === 'income') monthMap[key].income += Number(t.amount)
        else monthMap[key].expense += Number(t.amount)
      })

      const monthlyData = Object.entries(monthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, val]) => {
          const [year, month] = key.split('-')
          return {
            month: formatMonthYear(Number(month), Number(year)),
            income: val.income,
            expense: val.expense,
            net: val.income - val.expense,
          }
        })

      // Vessel aggregation
      const vesselMap: Record<string, { name: string; income: number; expense: number }> = {}
      txns.forEach(t => {
        if (!t.vessel_id) return
        if (!vesselMap[t.vessel_id]) {
          vesselMap[t.vessel_id] = { name: t.vessel?.name || 'Unknown', income: 0, expense: 0 }
        }
        if (t.type === 'income') vesselMap[t.vessel_id].income += Number(t.amount)
        else vesselMap[t.vessel_id].expense += Number(t.amount)
      })

      const vesselData = Object.values(vesselMap)

      setData({
        totalIncome,
        totalExpense,
        netCashflow: totalIncome - totalExpense,
        vesselCount: vesselList.length,
        monthlyData,
        vesselData,
        recentTransactions: txns.slice(0, 5),
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hero Banner + Summary Cards side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hero Banner - takes 1 column */}
        <div className="glass-card rounded-2xl p-4 md:p-5 flex flex-col justify-center relative overflow-hidden lg:row-span-2">
          <div className="relative z-10">
            <h2 className="text-lg md:text-xl font-bold text-navy">PT Nusantara Maritime Charter</h2>
            <p className="text-xs md:text-sm text-sky-600 mt-1">Navigating Your Maritime Business</p>
          </div>
          <div className="relative z-10 w-24 h-14 md:w-32 md:h-20 mt-3">
            <SailingShip className="w-full h-full" />
          </div>
        </div>

        {/* Summary Cards - takes 2 columns, 2x2 grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
          <div className="glass-card rounded-2xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs md:text-sm text-slate-500 mb-1">Total Pemasukan</p>
            <p className="text-lg md:text-2xl font-bold text-navy">{formatCurrency(data.totalIncome)}</p>
          </div>

          <div className="glass-card rounded-2xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-red-600 flex items-center justify-center shadow-md">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-xs md:text-sm text-slate-500 mb-1">Total Pengeluaran</p>
            <p className="text-lg md:text-2xl font-bold text-navy">{formatCurrency(data.totalExpense)}</p>
          </div>

          <div className="glass-card rounded-2xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-ocean flex items-center justify-center shadow-md">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mb-1">Net Cashflow</p>
            <p className={`text-lg md:text-2xl font-bold ${data.netCashflow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(data.netCashflow)}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-navy flex items-center justify-center shadow-md">
                <Ship className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mb-1">Total Vessels</p>
            <p className="text-lg md:text-2xl font-bold text-navy">{data.vesselCount}</p>
          </div>
        </div>
      </div>

      {/* Charts - full width on desktop, 2 side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Cashflow Trend */}
        <div className="glass-card rounded-2xl p-4 md:p-5">
          <h3 className="text-base md:text-lg font-semibold text-navy mb-4">Trend Cashflow</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.monthlyData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#10b981" fill="url(#incomeGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#ef4444" fill="url(#expenseGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* P&L per Vessel */}
        <div className="glass-card rounded-2xl p-4 md:p-5">
          <h3 className="text-base md:text-lg font-semibold text-navy mb-4">P&L per Vessel</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.vesselData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions - full width on desktop */}
      <div className="glass-card rounded-2xl p-4 md:p-5">
        <h3 className="text-base md:text-lg font-semibold text-navy mb-4">Transaksi Terbaru</h3>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Tanggal</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Deskripsi</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Kategori</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Kapal</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(t.transaction_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-slate-800">{t.description || '-'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs">
                      {t.category?.name || '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{t.vessel?.name || '-'}</td>
                  <td className={`py-3 px-4 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(Number(t.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {data.recentTransactions.map((t) => (
            <div key={t.id} className="border border-sky-100 rounded-xl p-2.5 bg-white/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">
                  {new Date(t.transaction_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                </span>
                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(Number(t.amount))}
                </span>
              </div>
              <p className="text-sm text-slate-800 truncate">{t.description || '-'}</p>
              <div className="flex gap-1 mt-1">
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
                  {t.category?.name || '-'}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-700 text-xs">
                  {t.vessel?.name || '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
