'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatMonthYear } from '@/lib/utils'
import { Wallet, FileText, Download, Loader2 } from 'lucide-react'
import { generatePayslipPDF } from '@/components/payslip-pdf'

export default function PayrollPage() {
  const [payrollRun, setPayrollRun] = useState<any>(null)
  const [details, setDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: run } = await supabase
        .from('payroll_runs')
        .select('*')
        .order('period_year', { ascending: false })
        .order('period_month', { ascending: false })
        .limit(1)
        .single()

      if (run) {
        setPayrollRun(run)
        const { data: det } = await supabase
          .from('payroll_details')
          .select('*, employee:employees(*, vessel:vessels(*))')
          .eq('payroll_run_id', run.id)
          .order('employee(name)', { ascending: true })
        setDetails(det || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const totalNetPay = details.reduce((sum, d) => sum + Number(d.net_pay), 0)
  const totalEarning = details.reduce((sum, d) => sum + Number(d.total_earning), 0)
  const totalDeduction = details.reduce((sum, d) => sum + Number(d.total_deduction), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-navy">Payroll</h2>
          <p className="text-sm text-slate-500">
            {payrollRun ? `Periode: ${formatMonthYear(payrollRun.period_month, payrollRun.period_year)}` : 'Belum ada payroll run'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            <Wallet className="w-4 h-4" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="glass-card rounded-xl p-2.5 md:rounded-2xl md:p-5">
          <p className="text-xs md:text-sm text-slate-500 mb-1">Gaji Kotor</p>
          <p className="text-sm md:text-2xl font-bold text-navy">{formatCurrency(totalEarning)}</p>
        </div>
        <div className="glass-card rounded-xl p-2.5 md:rounded-2xl md:p-5">
          <p className="text-xs md:text-sm text-slate-500 mb-1">Potongan</p>
          <p className="text-sm md:text-2xl font-bold text-red-600">{formatCurrency(totalDeduction)}</p>
        </div>
        <div className="glass-card rounded-xl p-2.5 md:rounded-2xl md:p-5">
          <p className="text-xs md:text-sm text-slate-500 mb-1">Take Home</p>
          <p className="text-sm md:text-2xl font-bold text-green-600">{formatCurrency(totalNetPay)}</p>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-sky-50/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">Karyawan</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Posisi</th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">Tipe</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Gaji Pokok</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Tunjangan</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Potongan</th>
                <th className="text-right py-3 px-4 font-medium text-slate-500">Take Home</th>
                <th className="text-center py-3 px-4 font-medium text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : details.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-slate-400">Belum ada data payroll</td></tr>
              ) : (
                details.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-800 font-medium">{d.employee?.name}</td>
                    <td className="py-3 px-4 text-slate-600">{d.employee?.position}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        d.employee?.employee_type === 'crew' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {d.employee?.employee_type === 'crew' ? 'Crew' : 'Staff'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(Number(d.basic_salary))}</td>
                    <td className="py-3 px-4 text-right text-green-600">{formatCurrency(Number(d.total_earning) - Number(d.basic_salary))}</td>
                    <td className="py-3 px-4 text-right text-red-600">{formatCurrency(Number(d.total_deduction))}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{formatCurrency(Number(d.net_pay))}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={async () => {
                          setGeneratingId(d.id)
                          await generatePayslipPDF({
                            employeeName: d.employee?.name || '',
                            position: d.employee?.position || '',
                            employeeType: d.employee?.employee_type || 'staff',
                            vesselName: d.employee?.vessel?.name || '',
                            joinDate: d.employee?.join_date || '',
                            periodMonth: payrollRun?.period_month || 0,
                            periodYear: payrollRun?.period_year || 0,
                            basicSalary: Number(d.basic_salary),
                            totalEarning: Number(d.total_earning),
                            totalDeduction: Number(d.total_deduction),
                            netPay: Number(d.net_pay),
                            details: d.details || [],
                          })
                          setGeneratingId(null)
                        }}
                        disabled={generatingId === d.id}
                        className="p-1.5 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
                        title="Download Payslip PDF"
                      >
                        {generatingId === d.id ? (
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden grid grid-cols-2 gap-2">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-slate-400">Loading...</div>
        ) : details.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-slate-400">Belum ada data payroll</div>
        ) : (
          details.map((d) => (
            <div key={d.id} className="glass-card rounded-xl p-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{d.employee?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{d.employee?.position}</p>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium shrink-0 ${
                  d.employee?.employee_type === 'crew' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  {d.employee?.employee_type === 'crew' ? 'Crew' : 'Staff'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                <div>
                  <span className="text-slate-400">Gaji</span>
                  <p className="text-slate-700 font-medium">{formatCurrency(Number(d.basic_salary))}</p>
                </div>
                <div>
                  <span className="text-slate-400">Tunjangan</span>
                  <p className="text-green-600 font-medium">{formatCurrency(Number(d.total_earning) - Number(d.basic_salary))}</p>
                </div>
                <div>
                  <span className="text-slate-400">Potongan</span>
                  <p className="text-red-600 font-medium">{formatCurrency(Number(d.total_deduction))}</p>
                </div>
                <div>
                  <span className="text-slate-400">Take Home</span>
                  <p className="text-navy font-bold">{formatCurrency(Number(d.net_pay))}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  setGeneratingId(d.id)
                  await generatePayslipPDF({
                    employeeName: d.employee?.name || '',
                    position: d.employee?.position || '',
                    employeeType: d.employee?.employee_type || 'staff',
                    vesselName: d.employee?.vessel?.name || '',
                    joinDate: d.employee?.join_date || '',
                    periodMonth: payrollRun?.period_month || 0,
                    periodYear: payrollRun?.period_year || 0,
                    basicSalary: Number(d.basic_salary),
                    totalEarning: Number(d.total_earning),
                    totalDeduction: Number(d.total_deduction),
                    netPay: Number(d.net_pay),
                    details: d.details || [],
                  })
                  setGeneratingId(null)
                }}
                disabled={generatingId === d.id}
                className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {generatingId === d.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                Payslip
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
