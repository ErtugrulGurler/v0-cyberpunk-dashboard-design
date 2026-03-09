"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Box,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react"
import {
  changeRequests,
  componentRevisions,
  getComponentById,
  getTopLevelSoftwareById,
  getEquipmentById,
} from "@/lib/scm-store"
import type { ChangeRequest } from "@/lib/scm-types"

export default function ChangeRequestsPage() {
  const [selectedCR, setSelectedCR] = useState<ChangeRequest | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredCRs = changeRequests.filter((cr) => {
    const matchesSearch =
      cr.crNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cr.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || cr.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-neutral-500/20 text-neutral-300"
      case "in_progress":
        return "bg-orange-500/20 text-orange-500"
      case "closed":
        return "bg-white/20 text-white"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4" />
      case "in_progress":
        return <Clock className="w-4 h-4" />
      case "closed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getRelatedRevisions = (crId: string) => {
    return componentRevisions.filter((rev) => rev.changeRequestId === crId)
  }

  const openCount = changeRequests.filter((cr) => cr.status === "open").length
  const inProgressCount = changeRequests.filter((cr) => cr.status === "in_progress").length
  const closedCount = changeRequests.filter((cr) => cr.status === "closed").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CHANGE REQUESTS</h1>
          <p className="text-sm text-neutral-400">Track and manage software change requests</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Change Request
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL CRS</p>
                <p className="text-2xl font-bold text-white font-mono">{changeRequests.length}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">OPEN</p>
                <p className="text-2xl font-bold text-neutral-300 font-mono">{openCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-neutral-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">IN PROGRESS</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{inProgressCount}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CLOSED</p>
                <p className="text-2xl font-bold text-white font-mono">{closedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search change requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="all" className="text-white hover:bg-neutral-700">
                    All Status
                  </SelectItem>
                  <SelectItem value="open" className="text-white hover:bg-neutral-700">
                    Open
                  </SelectItem>
                  <SelectItem value="in_progress" className="text-white hover:bg-neutral-700">
                    In Progress
                  </SelectItem>
                  <SelectItem value="closed" className="text-white hover:bg-neutral-700">
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CR List */}
        <Card className="lg:col-span-7 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                CHANGE REQUEST LIST
              </CardTitle>
              <Badge className="bg-neutral-700 text-neutral-300">
                {filteredCRs.length} of {changeRequests.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCRs.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No change requests found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredCRs.map((cr) => {
                  const affectedComponent = getComponentById(cr.affectedComponentId)
                  const relatedRevisions = getRelatedRevisions(cr.id)

                  return (
                    <div
                      key={cr.id}
                      className={`p-4 rounded cursor-pointer transition-colors border ${
                        selectedCR?.id === cr.id
                          ? "bg-orange-500/20 border-orange-500/50"
                          : "bg-neutral-800 border-neutral-700 hover:border-orange-500/30"
                      }`}
                      onClick={() => setSelectedCR(cr)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-orange-500">{cr.crNumber}</span>
                          {getStatusIcon(cr.status)}
                          <Badge className={getStatusColor(cr.status)}>
                            {cr.status.toUpperCase().replace("_", " ")}
                          </Badge>
                        </div>
                        <span className="text-xs text-neutral-500 font-mono">{cr.id}</span>
                      </div>

                      <h3 className="text-sm font-medium text-white mb-2">{cr.title}</h3>

                      <p className="text-xs text-neutral-400 mb-3 line-clamp-2">{cr.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-neutral-400">
                            <Box className="w-3 h-3" />
                            <span className="font-mono">
                              {affectedComponent?.partNumber || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            <span className="font-mono">{cr.createdAt}</span>
                          </div>
                        </div>
                        {relatedRevisions.length > 0 && (
                          <Badge className="bg-neutral-700 text-neutral-300 text-xs">
                            {relatedRevisions.length} revision{relatedRevisions.length > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CR Details */}
        <Card className="lg:col-span-5 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              CHANGE REQUEST DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCR ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-orange-500" />
                  <div>
                    <h2 className="text-xl font-bold text-orange-500 font-mono">{selectedCR.crNumber}</h2>
                    <p className="text-sm text-neutral-400 font-mono">{selectedCR.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedCR.status)}
                  <Badge className={getStatusColor(selectedCR.status)}>
                    {selectedCR.status.toUpperCase().replace("_", " ")}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">TITLE</h3>
                  <p className="text-white">{selectedCR.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                    DESCRIPTION
                  </h3>
                  <p className="text-sm text-neutral-400">{selectedCR.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                    AFFECTED COMPONENT
                  </h3>
                  {(() => {
                    const component = getComponentById(selectedCR.affectedComponentId)
                    if (!component) return <p className="text-neutral-500 text-sm">Unknown component</p>

                    const tls = getTopLevelSoftwareById(component.topLevelSoftwareId)
                    const eq = tls ? getEquipmentById(tls.equipmentId) : null

                    return (
                      <div className="bg-neutral-800 rounded p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Part Number:</span>
                          <span className="text-orange-500 font-mono">{component.partNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Name:</span>
                          <span className="text-white">{component.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Parent:</span>
                          <span className="text-neutral-300 text-xs">
                            {eq?.name} / {tls?.name}
                          </span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                    RELATED REVISIONS
                  </h3>
                  {(() => {
                    const revisions = getRelatedRevisions(selectedCR.id)
                    if (revisions.length === 0) {
                      return <p className="text-neutral-500 text-sm">No revisions linked to this CR</p>
                    }

                    return (
                      <div className="space-y-2">
                        {revisions.map((rev) => {
                          const component = getComponentById(rev.componentId)
                          return (
                            <div
                              key={rev.id}
                              className="bg-neutral-800 rounded p-3 text-sm flex items-center justify-between"
                            >
                              <div>
                                <span className="text-orange-500 font-mono">{component?.partNumber}</span>
                                <span className="text-neutral-400 mx-2">v{rev.revisionNumber}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-neutral-400 hover:text-white"
                                onClick={() =>
                                  (window.location.href = `/component-history?id=${rev.componentId}`)
                                }
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">CREATED</h3>
                  <p className="text-sm text-white font-mono">{selectedCR.createdAt}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-700">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Update Status</Button>
                  <Button
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Edit CR
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-neutral-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Select a change request to view details</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
