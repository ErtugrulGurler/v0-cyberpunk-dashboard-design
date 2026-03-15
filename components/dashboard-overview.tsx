"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Layers, Box, FileText, Package, AlertCircle, CheckCircle, Clock } from "lucide-react"
import type { Equipment, TopLevelSoftware, Component, ComponentRevision, ChangeRequest, SoftwarePackage } from "@/lib/scm-types"

function StatusBadge({ status }: { status: "DEV" | "REL" }) {
  return status === "DEV"
    ? <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs px-1.5 py-0">DEV</Badge>
    : <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-1.5 py-0">REL</Badge>
}

export default function DashboardOverview() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [topLevelSoftware, setTopLevelSoftware] = useState<TopLevelSoftware[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [revisions, setRevisions] = useState<ComponentRevision[]>([])
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([])
  const [softwarePackages, setSoftwarePackages] = useState<SoftwarePackage[]>([])

  useEffect(() => {
    Promise.all([
      fetch("/api/equipment").then((r) => r.json()),
      fetch("/api/software").then((r) => r.json()),
      fetch("/api/components").then((r) => r.json()),
      fetch("/api/revisions").then((r) => r.json()),
      fetch("/api/change-requests").then((r) => r.json()),
      fetch("/api/packages").then((r) => r.json()),
    ]).then(([eq, tls, cmp, rev, cr, pkg]) => {
      setEquipments(eq); setTopLevelSoftware(tls); setComponents(cmp)
      setRevisions(rev); setChangeRequests(cr); setSoftwarePackages(pkg)
    })
  }, [])

  const openCRs = changeRequests.filter((cr) => cr.status === "open").length
  const inProgressCRs = changeRequests.filter((cr) => cr.status === "in_progress").length
  const closedCRs = changeRequests.filter((cr) => cr.status === "closed").length
  const draftPkgs = softwarePackages.filter((p) => p.status === "draft").length
  const releasedPkgs = softwarePackages.filter((p) => p.status === "released").length

  const getStatusBadgeClass = (status: string) => ({
    open: "bg-neutral-500/20 text-neutral-300",
    in_progress: "bg-orange-500/20 text-orange-500",
    closed: "bg-white/20 text-white",
  }[status] ?? "bg-neutral-500/20 text-neutral-300")

  const getStatusIcon = (status: string) => ({
    open: <AlertCircle className="w-3 h-3" />,
    in_progress: <Clock className="w-3 h-3" />,
    closed: <CheckCircle className="w-3 h-3" />,
  }[status] ?? <AlertCircle className="w-3 h-3" />)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider">SCM DASHBOARD</h1>
        <p className="text-sm text-neutral-400">Software Configuration Management Overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "EQUIPMENT",    value: equipments.length,       icon: <Server className="w-6 h-6 text-orange-500" /> },
          { label: "TOP LEVEL SW", value: topLevelSoftware.length, icon: <Layers className="w-6 h-6 text-white" /> },
          { label: "COMPONENTS",   value: components.length,       icon: <Box className="w-6 h-6 text-orange-500" /> },
          { label: "REVISIONS",    value: revisions.length,        icon: <FileText className="w-6 h-6 text-white" /> },
          { label: "CHANGE REQS",  value: changeRequests.length,   icon: <FileText className="w-6 h-6 text-orange-500" /> },
          { label: "PACKAGES",     value: softwarePackages.length, icon: <Package className="w-6 h-6 text-white" /> },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent revisions */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">RECENT REVISIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {revisions.slice(0, 5).map((rev) => {
                const cmp = components.find((c) => c.id === rev.componentId)
                return (
                  <div key={rev.id} className="flex items-center gap-3 p-2 rounded bg-neutral-800">
                    <div className="font-mono text-xs text-neutral-500 w-14 shrink-0">{rev.commitHash.slice(0, 7)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-orange-500">{cmp?.partNumber ?? "—"}</span>
                        <Badge className="bg-neutral-700 text-neutral-300 text-xs">{rev.revisionNumber}</Badge>
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{rev.description}</p>
                    </div>
                    <div className="text-xs text-neutral-500 font-mono shrink-0">{rev.createdBy}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Change request status */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">CHANGE REQUEST STATUS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Open",        value: openCRs,       cls: "text-neutral-300" },
                { label: "In Progress", value: inProgressCRs, cls: "text-orange-500" },
                { label: "Closed",      value: closedCRs,     cls: "text-white" },
              ].map(({ label, value, cls }) => (
                <div key={label} className="p-3 bg-neutral-800 rounded text-center">
                  <div className={`text-2xl font-bold font-mono ${cls}`}>{value}</div>
                  <div className="text-xs text-neutral-500">{label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {changeRequests.slice(0, 4).map((cr) => (
                <div key={cr.id} className="flex items-center gap-2 p-2 rounded bg-neutral-800">
                  <Badge className={`${getStatusBadgeClass(cr.status)} text-xs flex items-center gap-1 shrink-0`}>
                    {getStatusIcon(cr.status)}
                    {cr.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono text-orange-500 shrink-0">{cr.crNumber}</span>
                  <span className="text-xs text-neutral-300 truncate">{cr.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment overview */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">EQUIPMENT OVERVIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipments.map((eq) => {
              const tlsList = topLevelSoftware.filter((t) => t.equipmentId === eq.id)
              const cmpCount = tlsList.reduce((acc, tls) => acc + components.filter((c) => c.topLevelSoftwareId === tls.id).length, 0)
              const pkgCount = softwarePackages.filter((p) => p.equipmentId === eq.id).length
              return (
                <div key={eq.id} className="p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-orange-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-5 h-5 text-orange-500" />
                    <h3 className="text-sm font-bold text-white tracking-wider">{eq.name}</h3>
                  </div>
                  <div className="mb-3 space-y-1">
                    {tlsList.map((tls) => (
                      <div key={tls.id} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400">{tls.partNumber} v{tls.version}</span>
                        <StatusBadge status={tls.status} />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {[["TLS", tlsList.length], ["CMP", cmpCount], ["PKG", pkgCount]].map(([k, v]) => (
                      <div key={k} className="p-2 bg-neutral-900 rounded">
                        <div className="font-bold text-white font-mono">{v}</div>
                        <div className="text-neutral-500">{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bottom stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PACKAGES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-800 rounded text-center">
                <div className="text-2xl font-bold text-orange-500 font-mono">{draftPkgs}</div>
                <div className="text-xs text-neutral-500">DRAFT</div>
              </div>
              <div className="p-3 bg-neutral-800 rounded text-center">
                <div className="text-2xl font-bold text-white font-mono">{releasedPkgs}</div>
                <div className="text-xs text-neutral-500">RELEASED</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">COMPONENT STATUS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-800 rounded text-center">
                <div className="text-2xl font-bold text-orange-400 font-mono">{components.filter((c) => c.status === "DEV").length}</div>
                <div className="text-xs text-neutral-500">IN DEV</div>
              </div>
              <div className="p-3 bg-neutral-800 rounded text-center">
                <div className="text-2xl font-bold text-emerald-400 font-mono">{components.filter((c) => c.status === "REL").length}</div>
                <div className="text-xs text-neutral-500">RELEASED</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
