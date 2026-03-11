'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { RsvpRow } from '@/lib/supabase/types'

interface RsvpTableProps {
  rsvps: RsvpRow[]
}

const PAGE_SIZE = 15

export function RsvpTable({ rsvps }: RsvpTableProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let result = rsvps

    // Search by name
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((r) => {
        const name = (r.data.name as string) ?? ''
        return name.toLowerCase().includes(q)
      })
    }

    // Filter by attendance
    if (filter !== 'all') {
      result = result.filter((r) => r.data.attendance === filter)
    }

    return result
  }, [rsvps, search, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Reset page when filters change
  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }
  const handleFilter = (value: 'all' | 'yes' | 'no') => {
    setFilter(value)
    setPage(0)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'yes', 'no'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilter(f)}
              className="rounded-xl"
            >
              {f === 'all' ? 'Todos' : f === 'yes' ? 'Asistirán' : 'No asistirán'}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      <div className="border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Asistencia</TableHead>
              <TableHead>Invitados</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No se encontraron confirmaciones
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell className="font-medium">
                    {(rsvp.data.name as string) ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {rsvp.event_id.replace(/^demo-/, '').replaceAll('-', ' ')}
                  </TableCell>
                  <TableCell>
                    {rsvp.data.attendance === 'yes' ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Sí</Badge>
                    ) : rsvp.data.attendance === 'no' ? (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">No</Badge>
                    ) : (
                      <Badge variant="secondary">—</Badge>
                    )}
                  </TableCell>
                  <TableCell>{(rsvp.data.guests as string) ?? '1'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(rsvp.created_at), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="rounded-xl"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="rounded-xl"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
