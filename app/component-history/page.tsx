"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, GitCommit, FileCode, User, Calendar, Box, ArrowLeft, Download } from "lucide-react"
import type { Component, ComponentRevision } from "@/lib/scm-types"

function StatusBadge({ status }: { status: "DEV" | "REL" }) {
  return status === "DEV"
    ? <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs px-1.5 py-0">DEV</Badge>
    : <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-1.5 py-0">REL</Badge>
}

function ComponentHistoryContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") ?? ""

  const [components, setComponents] = useState<Component[]>([])
  const [allRevisions, setAllRevisions] = useState<ComponentRevision[]>([])
  const [selectedComponentId, setSelectedComponentId] = useState(initialId)
  const [selectedRevision, setSelectedRevision] = useState<ComponentRevision | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/components").then((r) => r.json()),
      fetch("/api/revisions").then((r) => r.json()),
    ]).then(([cmp, rev]) => { setComponents(cmp); setAllRevisions(rev) })
  }, [])

  const selectedComponent = selectedComponentId
    ? components.find((c) => String(c.id) === selectedComponentId) ?? null
    : null
  const revisions = selectedComponent
    ? allRevisions.filter((r) => r.componentId === selectedComponent.id)
    : []

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">COMPONENT HISTORY</h1>
          <p className="text-sm text-neutral-400">View revision history and build artifacts</p>
        </div>
        <Button
          variant="outline"
          className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-neutral-400">SELECT COMPONENT:</span>
            </div>
            <Select value={selectedComponentId} onValueChange={(v) => { setSelectedComponentId(v); setSelectedRevision(null) }}>
              <SelectTrigger className="w-full sm:w-96 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Choose a component..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                {components.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                    <span className="font-mono text-orange-500">{c.partNumber}</span>
                    <span className="ml-2 text-neutral-400">{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedComponent && (
        <>
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">COMPONENT INFORMATION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-neutral-800 rounded">
                  <div className="text-neutral-500 mb-1">ID (PK)</div>
                  <div className="text-white font-mono">{selectedComponent.id}</div>
                </div>
                <div className="p-3 bg-neutral-800 rounded">
                  <div className="text-neutral-500 mb-1">PART NUMBER</div>
                  <div className="text-white font-mono">{selectedComponent.partNumber}</div>
                </div>
                <div className="p-3 bg-neutral-800 rounded">
                  <div className="text-neutral-500 mb-1">VERSION</div>
                  <div className="text-white font-mono">v{selectedComponent.version}</div>
                </div>
                <div className="p-3 bg-neutral-800 rounded">
                  <div className="flex items-center gap-2 mb-1"><div className="text-neutral-500">STATUS</div></div>
                  <StatusBadge status={selectedComponent.status} />
                </div>
              </div>
              <div className="mt-3 p-3 bg-neutral-800 rounded text-xs">
                <div className="text-neutral-500 mb-1">REPOSITORY</div>
                <div className="text-orange-400 font-mono break-all">{selectedComponent.repositoryUrl}</div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-5 bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                  REVISIONS ({revisions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[480px] overflow-y-auto">
                  {revisions.map((rev) => (
                    <div
                      key={rev.id}
                      onClick={() => setSelectedRevision(rev)}
                      className={`p-4 border-b border-neutral-800 cursor-pointer transition-colors ${selectedRevision?.id === rev.id ? "bg-orange-500/10 border-l-2 border-l-orange-500" : "hover:bg-neutral-800"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-neutral-700 text-neutral-300 text-xs">{rev.revisionNumber}</Badge>
                        <span className="text-xs font-mono text-neutral-500">{rev.commitHash.slice(0, 7)}</span>
                      </div>
                      <p className="text-xs text-neutral-300 mb-1 line-clamp-2">{rev.description}</p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span className="font-mono">{rev.createdBy}</span>
                        <span>{rev.createdAt}</span>
                      </div>
                    </div>
                  ))}
                  {revisions.length === 0 && (
                    <div className="p-8 text-center text-neutral-500">
                      <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No revisions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-7 bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">REVISION DETAILS</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRevision ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className="bg-neutral-700 text-neutral-300">{selectedRevision.revisionNumber}</Badge>
                      <span className="text-xs font-mono text-neutral-500">{selectedRevision.commitHash}</span>
                    </div>
                    <p className="text-sm text-neutral-300 bg-neutral-800 rounded p-3">{selectedRevision.description}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-neutral-800 rounded">
                        <div className="flex items-center gap-1 text-neutral-500 mb-1"><User className="w-3 h-3" />AUTHOR</div>
                        <div className="text-white font-mono">{selectedRevision.createdBy}</div>
                      </div>
                      <div className="p-3 bg-neutral-800 rounded">
                        <div className="flex items-center gap-1 text-neutral-500 mb-1"><Calendar className="w-3 h-3" />DATE</div>
                        <div className="text-white font-mono">{selectedRevision.createdAt}</div>
                      </div>
                      <div className="p-3 bg-neutral-800 rounded">
                        <div className="flex items-center gap-1 text-neutral-500 mb-1"><GitCommit className="w-3 h-3" />COMMIT</div>
                        <div className="text-white font-mono break-all">{selectedRevision.commitHash}</div>
                      </div>
                      <div className="p-3 bg-neutral-800 rounded">
                        <div className="flex items-center gap-1 text-neutral-500 mb-1"><FileCode className="w-3 h-3" />BUILD</div>
                        <div className="text-white font-mono break-all">{selectedRevision.buildArtifact}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-neutral-700">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Artifact
                      </Button>
                      <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white bg-transparent">
                        <GitCommit className="w-4 h-4 mr-2" />
                        View Commit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <div className="text-center text-neutral-500">
                      <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Select a revision to view details</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!selectedComponent && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-8 flex items-center justify-center h-64">
            <div className="text-center text-neutral-500">
              <Box className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a component to view its revision history</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ComponentHistoryPage() {
  return (
    <Suspense fallback={<div className="p-6 flex items-center justify-center h-screen"><div className="text-neutral-400">Loading...</div></div>}>
      <ComponentHistoryContent />
    </Suspense>
  )
}
