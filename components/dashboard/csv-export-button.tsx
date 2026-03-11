'use client'

import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { RsvpRow } from '@/lib/supabase/types'
import { format } from 'date-fns'

interface CsvExportButtonProps {
  rsvps: RsvpRow[]
}

export function CsvExportButton({ rsvps }: CsvExportButtonProps) {
  const exportCsv = () => {
    if (rsvps.length === 0) {
      toast.error('No hay datos para exportar')
      return
    }

    const headers = ['Nombre', 'Evento', 'Asistencia', 'Invitados', 'Email', 'Fecha']
    const rows = rsvps.map((r) => [
      (r.data.name as string) ?? '',
      r.event_id,
      r.data.attendance === 'yes' ? 'Sí' : r.data.attendance === 'no' ? 'No' : '',
      (r.data.guests as string) ?? '1',
      (r.data.email as string) ?? '',
      format(new Date(r.created_at), 'dd/MM/yyyy HH:mm'),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rsvps-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
    URL.revokeObjectURL(url)

    toast.success('CSV descargado correctamente')
  }

  return (
    <Button variant="outline" onClick={exportCsv} className="gap-2 rounded-xl">
      <Download className="w-4 h-4" />
      Exportar CSV
    </Button>
  )
}
