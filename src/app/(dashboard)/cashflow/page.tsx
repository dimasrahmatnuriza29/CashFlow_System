'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'

export default function CashflowPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data } = await supabase
        .from('transactions')
        .select('*, category:transaction_categories(*), vessel:vessels(*)')
        .order('transaction_date', { ascending: false })
      setTransactions(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-navy">Cashflow</h2>
          <p className="text-sm text-slate-500">Kelola pemasukan dan pengeluaran</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors w-fit">
          <Plus className="w-4 h-4" />
          Tambah Transaksi
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </button>
        ))}
      </div>

      {/* Table - Desktop */}
      <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-sky-50/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Tanggal</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Deskripsi</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Kategori</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Kapal</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Tipe</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Tidak ada transaksi</td></tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600">{formatDate(t.transaction_date)}</td>
                    <td className="py-3 px-4 text-slate-800">{t.description || '-'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs">
                        {t.category?.name || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{t.vessel?.name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        t.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(Number(t.amount))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-400">Tidak ada transaksi</div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="glass-card rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{formatDate(t.transaction_date)}</span>
                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(Number(t.amount))}
                </span>
              </div>
              <p className="text-sm text-slate-800 mb-2">{t.description || '-'}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
                  {t.category?.name || '-'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 text-xs">
                  {t.vessel?.name || '-'}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  t.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
