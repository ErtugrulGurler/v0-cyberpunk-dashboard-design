"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Search, AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react"
import type { ChangeRequest, Component } from "@/lib/scm-types"
import NewChangeRequestModal from "@/components/new-change-request-modal"

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-neutral-500/20 text-neutral-300",
    in_progress: "bg-orange-500/20 text-orange-500",
    closed: "bg-white/20 text-white",
  }
  const icon = { open: <AlertCircle className="w-3 h-3" />, in_progress: <Clock className="w-3 h-3" />, closed: <CheckCircle className="w-3 h-3" /> }[status] ?? <AlertCircle className="w-3 h-3" />
  return (
    <Badge className={`${map[status] ?? map.open} flex items-center gap-1 text-xs`}>
      {icon}
      {status.replace("_", " ").toUpperCase()}
    </Badge>
  )
}

export default function ChangeRequestsPage() {
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [selectedCR, setSelectedCR] = useState<ChangeRequest | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)

  const loadData = () => {
    Promise.all([
      fetch("/api/change-requests").then((r) => r.json()),
      fetch("/api/components").then((r) => r.json()),
    ]).then(([cr, cmp]) => { setChangeRequests(cr); setComponents(cmp) })
  }

  useEffect(() => { loadData() }, [])

  const filtered = changeRequests.filter((cr) => {
    const q = searchQuery.toLowerCase()
    const matchSearch = cr.crNumber.toLowerCase().includes(q) || cr.title.toLowerCase().includes(q) || cr.description.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || cr.status === statusFilter
    return matchSearch && matchStatus
  })

  const openCount = changeRequests.filter((c) => c.status === "open").length
  const inProgressCount = changeRequests.filter((c) => c.status === "in_progress").length
  const closedCount = changeRequests.filter((c) => c.status === "closed").length

  const getComponent = (id: number) => components.find((c) => c.id === id)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CHANGE REQUESTS</h1>
          <p className="text-sm text-neutral-400">Track and manage software change requests</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Change Request
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL CRS",   value: changeRequests.length, icon: <FileText className="w-8 h-8 text-orange-500" /> },
          { label: "OPEN",        value: openCount,             icon: <AlertCircle className="w-8 h-8 text-neutral-400" /> },
          { label: "IN PROGRESS", value: inProgressCount,       icon: <Clock className="w-8 h-8 text-orange-500" /> },
          { label: "CLOSED",      value: closedCount,           icon: <CheckCircle className="w-8 h-8 text-white" /> },
        ].map(({ label, value, icon }) => (
          <Card key={label} className="bg-neutral-900 border-neutral-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400 tracking-wider">{label}</p>
                  <p className="text-2xl font-bold text-white font-mono">{value}</p>
                </div>
                {icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search change requests..."
            className="pl-9 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-neutral-800 border-neutral-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            <SelectItem value="all" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">ALL STATUS</SelectItem>
            <SelectItem value="open" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">OPEN</SelectItem>
            <SelectItem value="in_progress" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">IN PROGRESS</SelectItem>
            <SelectItem value="closed" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">CLOSED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              CHANGE REQUESTS ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {filtered.map((cr) => (
                <div
                  key={cr.id}
                  onClick={() => setSelectedCR(cr)}
                  className={`p-4 border-b border-neutral-800 cursor-pointer transition-colors ${selectedCR?.id === cr.id ? "bg-orange-500/10 border-l-2 border-l-orange-500" : "hover:bg-neutral-800"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-orange-500">{cr.crNumber}</span>
                    <StatusBadge status={cr.status} />
                  </div>
                  <p className="text-sm text-white font-medium mb-1 line-clamp-1">{cr.title}</p>
                  <p className="text-xs text-neutral-500">{cr.createdAt}</p>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-neutral-500">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No change requests found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">DETAILS</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCR ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-xs font-mono text-orange-500">{selectedCR.crNumber}</p>
                    <h3 className="text-lg font-bold text-white">{selectedCR.title}</h3>
                  </div>
                  <StatusBadge status={selectedCR.status} />
                </div>

                {selectedCR.description && (
                  <p className="text-sm text-neutral-400 bg-neutral-800 rounded p-3">{selectedCR.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-neutral-800 rounded">
                    <div className="text-neutral-500 mb-1">CR NUMBER</div>
                    <div className="text-white font-mono">{selectedCR.crNumber}</div>
                  </div>
                  <div className="p-3 bg-neutral-800 rounded">
                    <div className="text-neutral-500 mb-1">CREATED</div>
                    <div className="text-white font-mono">{selectedCR.createdAt}</div>
                  </div>
                </div>

                {(() => {
                  const cmp = getComponent(selectedCR.affectedComponentId)
                  return cmp ? (
                    <div className="p-3 bg-neutral-800 rounded">
                      <div className="text-xs text-neutral-500 mb-2">AFFECTED COMPONENT</div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-orange-500">{cmp.partNumber}</span>
                        <span className="text-sm text-neutral-300">{cmp.name}</span>
                        <Badge className={cmp.status === "DEV"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs"
                        }>{cmp.status}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-6 text-xs text-neutral-400 hover:text-white"
                          onClick={() => window.location.href = `/component-history?id=${cmp.id}`}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          HISTORY
                        </Button>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-neutral-500">
                  <FileText className="w-14 h-14 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a change request to view details</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NewChangeRequestModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadData}
        components={components}
      />
    </div>
  )
}
