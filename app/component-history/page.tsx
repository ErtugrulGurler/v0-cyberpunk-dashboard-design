"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  History,
  GitCommit,
  FileCode,
  User,
  Calendar,
  Link2,
  Box,
  ArrowLeft,
  Download,
  ExternalLink,
} from "lucide-react"
import {
  components,
  getRevisionsByComponent,
  getChangeRequestById,
  getComponentById,
  getTopLevelSoftwareById,
  getEquipmentById,
} from "@/lib/scm-store"
import type { ComponentRevision } from "@/lib/scm-types"

function ComponentHistoryContent() {
  const searchParams = useSearchParams()
  const initialComponentId = searchParams.get("id") || ""

  const [selectedComponentId, setSelectedComponentId] = useState(initialComponentId)
  const [selectedRevision, setSelectedRevision] = useState<ComponentRevision | null>(null)

  const selectedComponent = selectedComponentId ? getComponentById(selectedComponentId) : null
  const revisions = selectedComponentId ? getRevisionsByComponent(selectedComponentId) : []

  // Get parent info
  const topLevelSoftware = selectedComponent
    ? getTopLevelSoftwareById(selectedComponent.topLevelSoftwareId)
    : null
  const equipment = topLevelSoftware ? getEquipmentById(topLevelSoftware.equipmentId) : null

  const handleRevisionClick = (revision: ComponentRevision) => {
    setSelectedRevision(revision)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">COMPONENT HISTORY</h1>
          <p className="text-sm text-neutral-400">View revision history and build artifacts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            onClick={() => (window.location.href = "/software-tree")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tree
          </Button>
        </div>
      </div>

      {/* Component Selector */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-neutral-400">SELECT COMPONENT:</span>
            </div>
            <Select value={selectedComponentId} onValueChange={setSelectedComponentId}>
              <SelectTrigger className="w-full sm:w-96 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Choose a component..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                {components.map((cmp) => (
                  <SelectItem key={cmp.id} value={cmp.id} className="text-white hover:bg-neutral-700">
                    <span className="font-mono text-orange-500">{cmp.partNumber}</span>
                    <span className="ml-2 text-neutral-400">{cmp.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedComponent && (
        <>
          {/* Component Info */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                COMPONENT INFORMATION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-neutral-400 tracking-wider mb-1">PART NUMBER</div>
                  <div className="text-white font-mono">{selectedComponent.partNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400 tracking-wider mb-1">NAME</div>
                  <div className="text-white">{selectedComponent.name}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400 tracking-wider mb-1">PARENT</div>
                  <div className="text-sm">
                    <span className="text-neutral-400">{equipment?.name}</span>
                    <span className="text-neutral-600 mx-1">/</span>
                    <span className="text-white">{topLevelSoftware?.name}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-400 tracking-wider mb-1">REPOSITORY</div>
                  <a
                    href={selectedComponent.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-orange-500 hover:text-orange-400 text-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Repo
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revision List */}
            <Card className="lg:col-span-7 bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                    REVISION HISTORY
                  </CardTitle>
                  <Badge className="bg-neutral-700 text-neutral-300">{revisions.length} revisions</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {revisions.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No revisions found for this component</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {[...revisions].reverse().map((revision, index) => {
                      const relatedCR = revision.changeRequestId
                        ? getChangeRequestById(revision.changeRequestId)
                        : null

                      return (
                        <div
                          key={revision.id}
                          className={`p-4 rounded cursor-pointer transition-colors border ${
                            selectedRevision?.id === revision.id
                              ? "bg-orange-500/20 border-orange-500/50"
                              : "bg-neutral-800 border-neutral-700 hover:border-orange-500/30"
                          }`}
                          onClick={() => handleRevisionClick(revision)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${
                                  index === 0
                                    ? "bg-orange-500/20 text-orange-500"
                                    : "bg-neutral-700 text-neutral-300"
                                }`}
                              >
                                v{revision.revisionNumber}
                              </Badge>
                              {index === 0 && (
                                <Badge className="bg-white/20 text-white text-xs">LATEST</Badge>
                              )}
                            </div>
                            <span className="text-xs text-neutral-500 font-mono">{revision.id}</span>
                          </div>

                          <p className="text-sm text-neutral-300 mb-3">{revision.description}</p>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1 text-neutral-400">
                              <GitCommit className="w-3 h-3" />
                              <span className="font-mono text-orange-500">{revision.commitHash}</span>
                            </div>
                            <div className="flex items-center gap-1 text-neutral-400">
                              <FileCode className="w-3 h-3" />
                              <span className="font-mono">{revision.buildArtifact}</span>
                            </div>
                            <div className="flex items-center gap-1 text-neutral-400">
                              <User className="w-3 h-3" />
                              <span className="font-mono">{revision.createdBy}</span>
                            </div>
                            <div className="flex items-center gap-1 text-neutral-400">
                              <Calendar className="w-3 h-3" />
                              <span className="font-mono">{revision.createdAt}</span>
                            </div>
                          </div>

                          {relatedCR && (
                            <div className="mt-3 pt-3 border-t border-neutral-700">
                              <div className="flex items-center gap-2 text-xs">
                                <Link2 className="w-3 h-3 text-orange-500" />
                                <span className="text-neutral-400">Related CR:</span>
                                <span className="text-orange-500 font-mono">{relatedCR.crNumber}</span>
                                <span className="text-neutral-300">- {relatedCR.title}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revision Details */}
            <Card className="lg:col-span-5 bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                  REVISION DETAILS
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRevision ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <History className="w-8 h-8 text-orange-500" />
                      <div>
                        <h2 className="text-xl font-bold text-white font-mono">
                          v{selectedRevision.revisionNumber}
                        </h2>
                        <p className="text-sm text-neutral-400 font-mono">{selectedRevision.id}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                        DESCRIPTION
                      </h3>
                      <p className="text-sm text-neutral-400">{selectedRevision.description}</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-neutral-300 tracking-wider">
                        BUILD INFORMATION
                      </h3>

                      <div className="bg-neutral-800 rounded p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Commit Hash:</span>
                          <span className="text-orange-500 font-mono">{selectedRevision.commitHash}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Build Artifact:</span>
                          <span className="text-white font-mono">{selectedRevision.buildArtifact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Created By:</span>
                          <span className="text-white font-mono">{selectedRevision.createdBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Created At:</span>
                          <span className="text-white font-mono">{selectedRevision.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {selectedRevision.changeRequestId && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-neutral-300 tracking-wider">
                          RELATED CHANGE REQUEST
                        </h3>
                        {(() => {
                          const cr = getChangeRequestById(selectedRevision.changeRequestId)
                          if (!cr) return null
                          return (
                            <div className="bg-neutral-800 rounded p-3 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neutral-400">CR Number:</span>
                                <span className="text-orange-500 font-mono">{cr.crNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Title:</span>
                                <span className="text-white">{cr.title}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Status:</span>
                                <Badge
                                  className={
                                    cr.status === "closed"
                                      ? "bg-white/20 text-white"
                                      : cr.status === "in_progress"
                                        ? "bg-orange-500/20 text-orange-500"
                                        : "bg-neutral-500/20 text-neutral-300"
                                  }
                                >
                                  {cr.status.toUpperCase().replace("_", " ")}
                                </Badge>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-neutral-700">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Artifact
                      </Button>
                      <Button
                        variant="outline"
                        className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                      >
                        <GitCommit className="w-4 h-4 mr-2" />
                        View Commit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center text-neutral-500">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
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
          <CardContent className="p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-neutral-500">
                <Box className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No Component Selected</p>
                <p className="text-sm">Select a component from the dropdown to view its revision history</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ComponentHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 flex items-center justify-center h-screen">
          <div className="text-neutral-400">Loading...</div>
        </div>
      }
    >
      <ComponentHistoryContent />
    </Suspense>
  )
}
