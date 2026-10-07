'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'crew' | 'staff'>('all')

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data } = await supabase
        .from('employees')
        .select('*, vessel:vessels(*)')
        .order('name')
      setEmployees(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = employees.filter(e => filter === 'all' || e.employee_type === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-navy">Employees</h2>
          <p className="text-sm text-slate-500">Daftar crew dan staff</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors w-fit">
          <Plus className="w-4 h-4" />
          Tambah Karyawan
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'crew', 'staff'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'crew' ? 'Crew' : 'Staff'}
          </button>
        ))}
      </div>

      {/* Table - Desktop */}
      <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-sky-50/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Posisi</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Tipe</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Kapal</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Join Date</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Gaji Pokok</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Tidak ada karyawan</td></tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                          {e.name.charAt(0)}
                        </div>
                        <span className="text-slate-800 font-medium">{e.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{e.position}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        e.employee_type === 'crew' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {e.employee_type === 'crew' ? 'Crew' : 'Staff'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{e.vessel?.name || '-'}</td>
                    <td className="py-3 px-4 text-slate-600">{formatDate(e.join_date)}</td>
                    <td className="py-3 px-4 text-right text-slate-800 font-medium">{formatCurrency(Number(e.basic_salary))}</td>
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
          <div className="text-center py-8 text-slate-400">Tidak ada karyawan</div>
        ) : (
          filtered.map((e) => (
            <div key={e.id} className="glass-card rounded-xl p-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sm font-semibold text-navy">
                  {e.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.position}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  e.employee_type === 'crew' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  {e.employee_type === 'crew' ? 'Crew' : 'Staff'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <div>
                  <span className="text-slate-400">Kapal</span>
                  <p className="text-slate-700">{e.vessel?.name || '-'}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Gaji Pokok</span>
                  <p className="text-navy font-medium">{formatCurrency(Number(e.basic_salary))}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
