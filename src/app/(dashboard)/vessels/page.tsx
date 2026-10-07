'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Ship, Plus } from 'lucide-react'

export default function VesselsPage() {
  const [vessels, setVessels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data } = await supabase.from('vessels').select('*').order('name')
      setVessels(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-navy">Vessels</h2>
          <p className="text-sm text-slate-500">Daftar kapal perusahaan</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors w-fit">
          <Plus className="w-4 h-4" />
          Tambah Kapal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-slate-400">Loading...</div>
        ) : vessels.map((v) => (
          <div key={v.id} className="glass-card rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-ocean flex items-center justify-center shadow-md">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-navy">{v.name}</h3>
                <p className="text-sm text-slate-500">{v.type}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Kapasitas</span>
                <span className="text-slate-800 font-medium">{v.capacity || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  v.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {v.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
