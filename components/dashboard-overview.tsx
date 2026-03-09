"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Server,
  Layers,
  Box,
  FileText,
  Package,
  History,
  AlertCircle,
  CheckCircle,
  Clock,
  GitCommit,
} from "lucide-react"
import {
  equipments,
  topLevelSoftware,
  components,
  componentRevisions,
  changeRequests,
  softwarePackages,
  getComponentById,
  getChangeRequestById,
} from "@/lib/scm-store"

export default function DashboardOverview() {
  const openCRs = changeRequests.filter((cr) => cr.status === "open").length
  const inProgressCRs = changeRequests.filter((cr) => cr.status === "in_progress").length
  const closedCRs = changeRequests.filter((cr) => cr.status === "closed").length

  const draftPackages = softwarePackages.filter((pkg) => pkg.status === "draft").length
  const releasedPackages = softwarePackages.filter((pkg) => pkg.status === "released").length

  // Get recent revisions
  const recentRevisions = [...componentRevisions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Get recent CRs
  const recentCRs = [...changeRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

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
        return <AlertCircle className="w-3 h-3" />
      case "in_progress":
        return <Clock className="w-3 h-3" />
      case "closed":
        return <CheckCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider">SCM DASHBOARD</h1>
        <p className="text-sm text-neutral-400">Software Configuration Management Overview</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">EQUIPMENT</p>
                <p className="text-2xl font-bold text-white font-mono">{equipments.length}</p>
              </div>
              <Server className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOP LEVEL SW</p>
                <p className="text-2xl font-bold text-white font-mono">{topLevelSoftware.length}</p>
              </div>
              <Layers className="w-6 h-6 text-white" />
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
              <Box className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">REVISIONS</p>
                <p className="text-2xl font-bold text-white font-mono">{componentRevisions.length}</p>
              </div>
              <History className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CHANGE REQS</p>
                <p className="text-2xl font-bold text-white font-mono">{changeRequests.length}</p>
              </div>
              <FileText className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">PACKAGES</p>
                <p className="text-2xl font-bold text-white font-mono">{softwarePackages.length}</p>
              </div>
              <Package className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Revisions */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              RECENT REVISIONS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRevisions.map((revision) => {
                const component = getComponentById(revision.componentId)
                const relatedCR = revision.changeRequestId
                  ? getChangeRequestById(revision.changeRequestId)
                  : null

                return (
                  <div
                    key={revision.id}
                    className="flex items-center justify-between p-3 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <GitCommit className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-mono text-orange-500">{revision.commitHash}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-mono">{component?.partNumber}</span>
                          <Badge className="bg-neutral-700 text-neutral-300 text-xs">
                            v{revision.revisionNumber}
                          </Badge>
                        </div>
                        <div className="text-xs text-neutral-400">{component?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      {relatedCR && (
                        <span className="text-orange-500 font-mono">{relatedCR.crNumber}</span>
                      )}
                      <span className="text-neutral-500 font-mono">{revision.createdAt}</span>
                      <span className="text-neutral-400 font-mono">{revision.createdBy}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* CR Status */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              CHANGE REQUEST STATUS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-neutral-800 rounded">
                  <div className="text-lg font-bold text-neutral-300 font-mono">{openCRs}</div>
                  <div className="text-xs text-neutral-500">Open</div>
                </div>
                <div className="text-center p-3 bg-neutral-800 rounded">
                  <div className="text-lg font-bold text-orange-500 font-mono">{inProgressCRs}</div>
                  <div className="text-xs text-neutral-500">In Progress</div>
                </div>
                <div className="text-center p-3 bg-neutral-800 rounded">
                  <div className="text-lg font-bold text-white font-mono">{closedCRs}</div>
                  <div className="text-xs text-neutral-500">Closed</div>
                </div>
              </div>

              <div className="space-y-2">
                {recentCRs.map((cr) => (
                  <div
                    key={cr.id}
                    className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(cr.status)}
                      <span className="text-xs font-mono text-orange-500">{cr.crNumber}</span>
                    </div>
                    <Badge className={`${getStatusColor(cr.status)} text-xs`}>
                      {cr.status.toUpperCase().replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Status */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              PACKAGE STATUS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-neutral-800 rounded">
                <div className="text-2xl font-bold text-orange-500 font-mono">{draftPackages}</div>
                <div className="text-xs text-neutral-500">Draft</div>
              </div>
              <div className="text-center p-4 bg-neutral-800 rounded">
                <div className="text-2xl font-bold text-white font-mono">{releasedPackages}</div>
                <div className="text-xs text-neutral-500">Released</div>
              </div>
            </div>

            <div className="space-y-2">
              {softwarePackages.slice(0, 4).map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-mono text-white">{pkg.version}</span>
                  </div>
                  <Badge
                    className={
                      pkg.status === "released"
                        ? "bg-white/20 text-white text-xs"
                        : "bg-orange-500/20 text-orange-500 text-xs"
                    }
                  >
                    {pkg.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipment Overview */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              EQUIPMENT OVERVIEW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {equipments.map((eq) => {
                const tlsCount = topLevelSoftware.filter((tls) => tls.equipmentId === eq.id).length
                const componentCount = topLevelSoftware
                  .filter((tls) => tls.equipmentId === eq.id)
                  .reduce(
                    (acc, tls) =>
                      acc + components.filter((c) => c.topLevelSoftwareId === tls.id).length,
                    0
                  )
                const packageCount = softwarePackages.filter(
                  (pkg) => pkg.equipmentId === eq.id
                ).length

                return (
                  <div
                    key={eq.id}
                    className="p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-orange-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Server className="w-5 h-5 text-orange-500" />
                      <h3 className="text-sm font-bold text-white tracking-wider">{eq.name}</h3>
                    </div>
                    <p className="text-xs text-neutral-400 mb-3 line-clamp-2">{eq.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-neutral-900 rounded">
                        <div className="font-bold text-white font-mono">{tlsCount}</div>
                        <div className="text-neutral-500">TLS</div>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded">
                        <div className="font-bold text-white font-mono">{componentCount}</div>
                        <div className="text-neutral-500">CMP</div>
                      </div>
                      <div className="p-2 bg-neutral-900 rounded">
                        <div className="font-bold text-white font-mono">{packageCount}</div>
                        <div className="text-neutral-500">PKG</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
