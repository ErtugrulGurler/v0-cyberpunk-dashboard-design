"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  ChevronDown,
  Server,
  Layers,
  Box,
  Plus,
  History,
  ExternalLink,
  FolderTree,
} from "lucide-react"
import {
  equipments,
  topLevelSoftware,
  components,
  getTopLevelSoftwareByEquipment,
  getComponentsByTopLevelSoftware,
  getRevisionsByComponent,
} from "@/lib/scm-store"
import type { Equipment, TopLevelSoftware, Component } from "@/lib/scm-types"

interface TreeNodeState {
  [key: string]: boolean
}

export default function SoftwareTreePage() {
  const [expandedNodes, setExpandedNodes] = useState<TreeNodeState>({})
  const [selectedItem, setSelectedItem] = useState<{
    type: "equipment" | "topLevelSoftware" | "component"
    data: Equipment | TopLevelSoftware | Component
  } | null>(null)

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }))
  }

  const expandAll = () => {
    const allNodes: TreeNodeState = {}
    equipments.forEach((eq) => {
      allNodes[eq.id] = true
      getTopLevelSoftwareByEquipment(eq.id).forEach((tls) => {
        allNodes[tls.id] = true
      })
    })
    setExpandedNodes(allNodes)
  }

  const collapseAll = () => {
    setExpandedNodes({})
  }

  const renderComponent = (component: Component) => {
    const revisions = getRevisionsByComponent(component.id)
    const latestRevision = revisions[revisions.length - 1]

    return (
      <div
        key={component.id}
        className={`flex items-center gap-2 p-2 ml-12 rounded cursor-pointer transition-colors ${
          selectedItem?.data.id === component.id
            ? "bg-orange-500/20 border border-orange-500/50"
            : "hover:bg-neutral-800"
        }`}
        onClick={() => setSelectedItem({ type: "component", data: component })}
      >
        <Box className="w-4 h-4 text-orange-500" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white font-mono">{component.partNumber}</span>
            <span className="text-sm text-neutral-400">{component.name}</span>
          </div>
        </div>
        {latestRevision && (
          <Badge className="bg-neutral-700 text-neutral-300 text-xs">v{latestRevision.revisionNumber}</Badge>
        )}
        <span className="text-xs text-neutral-500">{revisions.length} rev</span>
      </div>
    )
  }

  const renderTopLevelSoftware = (tls: TopLevelSoftware) => {
    const isExpanded = expandedNodes[tls.id]
    const tlsComponents = getComponentsByTopLevelSoftware(tls.id)

    return (
      <div key={tls.id}>
        <div
          className={`flex items-center gap-2 p-2 ml-6 rounded cursor-pointer transition-colors ${
            selectedItem?.data.id === tls.id
              ? "bg-orange-500/20 border border-orange-500/50"
              : "hover:bg-neutral-800"
          }`}
          onClick={() => setSelectedItem({ type: "topLevelSoftware", data: tls })}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleNode(tls.id)
            }}
            className="text-neutral-400 hover:text-white"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <Layers className="w-4 h-4 text-white" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-mono">{tls.partNumber}</span>
              <span className="text-sm text-neutral-400">{tls.name}</span>
            </div>
          </div>
          <span className="text-xs text-neutral-500">{tlsComponents.length} components</span>
        </div>
        {isExpanded && tlsComponents.map((cmp) => renderComponent(cmp))}
      </div>
    )
  }

  const renderEquipment = (equipment: Equipment) => {
    const isExpanded = expandedNodes[equipment.id]
    const eqTopLevelSoftware = getTopLevelSoftwareByEquipment(equipment.id)

    return (
      <div key={equipment.id} className="mb-2">
        <div
          className={`flex items-center gap-2 p-3 rounded cursor-pointer transition-colors ${
            selectedItem?.data.id === equipment.id
              ? "bg-orange-500/20 border border-orange-500/50"
              : "hover:bg-neutral-800"
          }`}
          onClick={() => setSelectedItem({ type: "equipment", data: equipment })}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleNode(equipment.id)
            }}
            className="text-neutral-400 hover:text-white"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <Server className="w-5 h-5 text-orange-500" />
          <div className="flex-1">
            <div className="text-sm font-bold text-white tracking-wider">{equipment.name}</div>
            <div className="text-xs text-neutral-500">{equipment.id}</div>
          </div>
          <span className="text-xs text-neutral-500">{eqTopLevelSoftware.length} TLS</span>
        </div>
        {isExpanded && eqTopLevelSoftware.map((tls) => renderTopLevelSoftware(tls))}
      </div>
    )
  }

  const renderDetailPanel = () => {
    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-neutral-500">
            <FolderTree className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Select an item from the tree to view details</p>
          </div>
        </div>
      )
    }

    if (selectedItem.type === "equipment") {
      const eq = selectedItem.data as Equipment
      const eqTls = getTopLevelSoftwareByEquipment(eq.id)
      const totalComponents = eqTls.reduce((acc, tls) => acc + getComponentsByTopLevelSoftware(tls.id).length, 0)

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-orange-500" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-wider">{eq.name}</h2>
              <p className="text-sm text-neutral-400 font-mono">{eq.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">TOP LEVEL SOFTWARE</div>
              <div className="text-2xl font-bold text-white font-mono">{eqTls.length}</div>
            </div>
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">TOTAL COMPONENTS</div>
              <div className="text-2xl font-bold text-white font-mono">{totalComponents}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DESCRIPTION</h3>
            <p className="text-sm text-neutral-400">{eq.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">CREATED</h3>
            <p className="text-sm text-white font-mono">{eq.createdAt}</p>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-700">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Top Level Software
            </Button>
          </div>
        </div>
      )
    }

    if (selectedItem.type === "topLevelSoftware") {
      const tls = selectedItem.data as TopLevelSoftware
      const tlsComponents = getComponentsByTopLevelSoftware(tls.id)

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Layers className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-wider">{tls.name}</h2>
              <p className="text-sm text-neutral-400 font-mono">{tls.partNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">COMPONENTS</div>
              <div className="text-2xl font-bold text-white font-mono">{tlsComponents.length}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DESCRIPTION</h3>
            <p className="text-sm text-neutral-400">{tls.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">CREATED</h3>
            <p className="text-sm text-white font-mono">{tls.createdAt}</p>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-700">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          </div>
        </div>
      )
    }

    if (selectedItem.type === "component") {
      const cmp = selectedItem.data as Component
      const revisions = getRevisionsByComponent(cmp.id)
      const latestRevision = revisions[revisions.length - 1]

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Box className="w-8 h-8 text-orange-500" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-wider">{cmp.name}</h2>
              <p className="text-sm text-neutral-400 font-mono">{cmp.partNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">REVISIONS</div>
              <div className="text-2xl font-bold text-white font-mono">{revisions.length}</div>
            </div>
            <div className="bg-neutral-800 rounded p-4">
              <div className="text-xs text-neutral-400 tracking-wider mb-1">LATEST VERSION</div>
              <div className="text-2xl font-bold text-orange-500 font-mono">
                {latestRevision ? `v${latestRevision.revisionNumber}` : "N/A"}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DESCRIPTION</h3>
            <p className="text-sm text-neutral-400">{cmp.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">REPOSITORY</h3>
            <a
              href={cmp.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-400"
            >
              <ExternalLink className="w-4 h-4" />
              {cmp.repositoryUrl}
            </a>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">CREATED</h3>
            <p className="text-sm text-white font-mono">{cmp.createdAt}</p>
          </div>

          {latestRevision && (
            <div>
              <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">LATEST REVISION</h3>
              <div className="bg-neutral-800 rounded p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Version:</span>
                  <span className="text-white font-mono">{latestRevision.revisionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Commit:</span>
                  <span className="text-orange-500 font-mono">{latestRevision.commitHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Artifact:</span>
                  <span className="text-white font-mono">{latestRevision.buildArtifact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Created By:</span>
                  <span className="text-white font-mono">{latestRevision.createdBy}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-neutral-700">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => (window.location.href = `/component-history?id=${cmp.id}`)}
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Revision
            </Button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SOFTWARE TREE</h1>
          <p className="text-sm text-neutral-400">Equipment, Top Level Software, and Component hierarchy</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            onClick={expandAll}
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            onClick={collapseAll}
          >
            Collapse All
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Equipment
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">EQUIPMENT</p>
                <p className="text-2xl font-bold text-white font-mono">{equipments.length}</p>
              </div>
              <Server className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOP LEVEL SOFTWARE</p>
                <p className="text-2xl font-bold text-white font-mono">{topLevelSoftware.length}</p>
              </div>
              <Layers className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">COMPONENTS</p>
                <p className="text-2xl font-bold text-white font-mono">{components.length}</p>
              </div>
              <Box className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tree View */}
        <Card className="lg:col-span-7 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              SOFTWARE STRUCTURE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {equipments.map((eq) => renderEquipment(eq))}
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <Card className="lg:col-span-5 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">DETAILS</CardTitle>
          </CardHeader>
          <CardContent>{renderDetailPanel()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
