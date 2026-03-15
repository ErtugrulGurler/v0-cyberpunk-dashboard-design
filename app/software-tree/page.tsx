"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, Server, Layers, Box, Plus, History, FolderTree } from "lucide-react"
import type { Equipment, TopLevelSoftware, Component, ComponentRevision } from "@/lib/scm-types"
import NewEquipmentModal from "@/components/new-equipment-modal"

function StatusBadge({ status }: { status: "DEV" | "REL" }) {
  return status === "DEV"
    ? <Badge className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs px-1.5 py-0">DEV</Badge>
    : <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-1.5 py-0">REL</Badge>
}

interface TreeNodeState { [key: string]: boolean }

export default function SoftwareTreePage() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [topLevelSoftware, setTopLevelSoftware] = useState<TopLevelSoftware[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [revisions, setRevisions] = useState<ComponentRevision[]>([])
  const [expandedNodes, setExpandedNodes] = useState<TreeNodeState>({})
  const [selectedItem, setSelectedItem] = useState<{ type: string; data: Equipment | TopLevelSoftware | Component } | null>(null)
  const [showNewEquipment, setShowNewEquipment] = useState(false)

  const loadData = () => {
    Promise.all([
      fetch("/api/equipment").then((r) => r.json()),
      fetch("/api/software").then((r) => r.json()),
      fetch("/api/components").then((r) => r.json()),
      fetch("/api/revisions").then((r) => r.json()),
    ]).then(([eq, tls, cmp, rev]) => {
      setEquipments(eq); setTopLevelSoftware(tls); setComponents(cmp); setRevisions(rev)
    })
  }

  useEffect(() => { loadData() }, [])

  const toggleNode = (id: string) => setExpandedNodes((p) => ({ ...p, [id]: !p[id] }))
  const expandAll = () => {
    const all: TreeNodeState = {}
    equipments.forEach((eq) => { all[`eq-${eq.id}`] = true; topLevelSoftware.filter((t) => t.equipmentId === eq.id).forEach((t) => { all[`tls-${t.id}`] = true }) })
    setExpandedNodes(all)
  }

  const renderComponent = (c: Component) => {
    const revs = revisions.filter((r) => r.componentId === c.id)
    const latest = revs[revs.length - 1]
    const isSelected = selectedItem?.data.id === c.id && selectedItem.type === "component"
    return (
      <div
        key={c.id}
        className={`flex items-center gap-2 p-2 ml-12 rounded cursor-pointer transition-colors ${isSelected ? "bg-orange-500/20 border border-orange-500/50" : "hover:bg-neutral-800"}`}
        onClick={() => setSelectedItem({ type: "component", data: c })}
      >
        <Box className="w-4 h-4 text-orange-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white font-mono">{c.partNumber}</span>
            <span className="text-xs text-neutral-400">{c.name}</span>
            <StatusBadge status={c.status} />
          </div>
          <div className="text-xs text-neutral-500 font-mono">v{c.version}</div>
        </div>
        {latest && <Badge className="bg-neutral-700 text-neutral-300 text-xs shrink-0">{latest.revisionNumber}</Badge>}
        <span className="text-xs text-neutral-500 shrink-0">{revs.length} rev</span>
      </div>
    )
  }

  const renderTopLevelSoftware = (tls: TopLevelSoftware) => {
    const key = `tls-${tls.id}`
    const isExpanded = expandedNodes[key]
    const tlsComponents = components.filter((c) => c.topLevelSoftwareId === tls.id)
    const isSelected = selectedItem?.data.id === tls.id && selectedItem.type === "topLevelSoftware"
    return (
      <div key={tls.id}>
        <div
          className={`flex items-center gap-2 p-2 ml-6 rounded cursor-pointer transition-colors ${isSelected ? "bg-orange-500/20 border border-orange-500/50" : "hover:bg-neutral-800"}`}
          onClick={() => setSelectedItem({ type: "topLevelSoftware", data: tls })}
        >
          <button onClick={(e) => { e.stopPropagation(); toggleNode(key) }} className="text-neutral-400 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <Layers className="w-4 h-4 text-white shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-white font-mono">{tls.partNumber}</span>
              <span className="text-xs text-neutral-400">{tls.name}</span>
              <StatusBadge status={tls.status} />
            </div>
          </div>
          <Badge className="bg-orange-500/20 text-orange-400 text-xs border border-orange-500/30 shrink-0">v{tls.version}</Badge>
        </div>
        {isExpanded && tlsComponents.map(renderComponent)}
      </div>
    )
  }

  const renderEquipment = (eq: Equipment) => {
    const key = `eq-${eq.id}`
    const isExpanded = expandedNodes[key]
    const tlsList = topLevelSoftware.filter((t) => t.equipmentId === eq.id)
    const isSelected = selectedItem?.data.id === eq.id && selectedItem.type === "equipment"
    return (
      <div key={eq.id}>
        <div
          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${isSelected ? "bg-orange-500/20 border border-orange-500/50" : "hover:bg-neutral-800"}`}
          onClick={() => setSelectedItem({ type: "equipment", data: eq })}
        >
          <button onClick={(e) => { e.stopPropagation(); toggleNode(key) }} className="text-neutral-400 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <Server className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="text-sm font-bold text-white tracking-wider flex-1">{eq.name}</span>
          <span className="text-xs text-neutral-500">{tlsList.length} TLS</span>
        </div>
        {isExpanded && tlsList.map(renderTopLevelSoftware)}
      </div>
    )
  }

  const renderDetailPanel = () => {
    if (!selectedItem) return (
      <div className="flex items-center justify-center h-48 text-neutral-500">
        <div className="text-center">
          <FolderTree className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Select an item to view details</p>
        </div>
      </div>
    )

    const { type, data } = selectedItem

    if (type === "equipment") {
      const eq = data as Equipment
      const tlsList = topLevelSoftware.filter((t) => t.equipmentId === eq.id)
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-bold text-white tracking-wider">{eq.name}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">ID</div><div className="text-white font-mono">{eq.id}</div></div>
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">CREATED</div><div className="text-white font-mono">{eq.createdAt}</div></div>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-2">TOP LEVEL SOFTWARE ({tlsList.length})</p>
            {tlsList.map((t) => (
              <div key={t.id} className="flex items-center gap-2 p-2 bg-neutral-800 rounded mb-1">
                <span className="text-xs font-mono text-orange-500">{t.partNumber}</span>
                <span className="text-xs text-neutral-300">{t.name}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (type === "topLevelSoftware") {
      const tls = data as TopLevelSoftware
      const tlsComponents = components.filter((c) => c.topLevelSoftwareId === tls.id)
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Layers className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold text-white tracking-wider">{tls.name}</h3>
            <StatusBadge status={tls.status} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">ID (PK)</div><div className="text-white font-mono">{tls.id}</div></div>
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">PART NUMBER</div><div className="text-white font-mono">{tls.partNumber}</div></div>
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">VERSION</div><div className="text-white font-mono">v{tls.version}</div></div>
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">CREATED</div><div className="text-white font-mono">{tls.createdAt}</div></div>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-2">COMPONENTS ({tlsComponents.length})</p>
            {tlsComponents.map((c) => (
              <div key={c.id} className="flex items-center gap-2 p-2 bg-neutral-800 rounded mb-1">
                <span className="text-xs font-mono text-orange-500">{c.partNumber}</span>
                <span className="text-xs text-neutral-300">{c.name}</span>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (type === "component") {
      const c = data as Component
      const cmpRevisions = revisions.filter((r) => r.componentId === c.id).slice(0, 5)
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Box className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-bold text-white tracking-wider">{c.name}</h3>
            <StatusBadge status={c.status} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">ID (PK)</div><div className="text-white font-mono">{c.id}</div></div>
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">PART NUMBER</div><div className="text-white font-mono">{c.partNumber}</div></div>
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">VERSION</div><div className="text-white font-mono">v{c.version}</div></div>
            <div className="p-2 bg-neutral-800 rounded"><div className="text-neutral-500">CREATED</div><div className="text-white font-mono">{c.createdAt}</div></div>
          </div>
          <div className="p-2 bg-neutral-800 rounded text-xs">
            <div className="text-neutral-500 mb-1">REPOSITORY</div>
            <div className="text-orange-400 font-mono break-all">{c.repositoryUrl}</div>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-2">RECENT REVISIONS</p>
            {cmpRevisions.map((r) => (
              <div key={r.id} className="flex items-center gap-2 p-2 bg-neutral-800 rounded mb-1">
                <span className="text-xs font-mono text-neutral-500 w-14 shrink-0">{r.commitHash.slice(0, 7)}</span>
                <Badge className="bg-neutral-700 text-neutral-300 text-xs">{r.revisionNumber}</Badge>
                <span className="text-xs text-neutral-400 truncate">{r.description}</span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white bg-transparent text-xs"
            onClick={() => window.location.href = `/component-history?id=${c.id}`}
          >
            <History className="w-3 h-3 mr-2" />
            VIEW FULL HISTORY
          </Button>
        </div>
      )
    }

    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SOFTWARE TREE</h1>
          <p className="text-sm text-neutral-400">Hierarchical view of equipment and software</p>
        </div>
        <Button onClick={() => setShowNewEquipment(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Equipment
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "EQUIPMENT", value: equipments.length, icon: <Server className="w-8 h-8 text-orange-500" /> },
          { label: "TOP LEVEL SOFTWARE", value: topLevelSoftware.length, icon: <Layers className="w-8 h-8 text-white" /> },
          { label: "COMPONENTS", value: components.length, icon: <Box className="w-8 h-8 text-orange-500" /> },
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SOFTWARE STRUCTURE</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 h-7">EXPAND ALL</Button>
                <Button variant="ghost" size="sm" onClick={() => setExpandedNodes({})} className="text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 h-7">COLLAPSE</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {equipments.map(renderEquipment)}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">DETAILS</CardTitle>
          </CardHeader>
          <CardContent>{renderDetailPanel()}</CardContent>
        </Card>
      </div>

      <NewEquipmentModal
        open={showNewEquipment}
        onClose={() => setShowNewEquipment(false)}
        onCreated={loadData}
      />
    </div>
  )
}
