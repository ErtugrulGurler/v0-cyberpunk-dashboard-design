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
  Package,
  Plus,
  Search,
  Filter,
  Server,
  Calendar,
  Lock,
  Unlock,
  FileText,
  Box,
  Layers,
  Download,
  CheckCircle,
} from "lucide-react"
import {
  softwarePackages,
  equipments,
  getEquipmentById,
  getPackageContents,
  getTopLevelSoftwareById,
  getRevisionById,
  getComponentById,
} from "@/lib/scm-store"
import type { SoftwarePackage, PackageContent } from "@/lib/scm-types"

export default function SoftwarePackagesPage() {
  const [selectedPackage, setSelectedPackage] = useState<SoftwarePackage | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all")

  const filteredPackages = softwarePackages.filter((pkg) => {
    const matchesSearch =
      pkg.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter
    const matchesEquipment = equipmentFilter === "all" || pkg.equipmentId === equipmentFilter

    return matchesSearch && matchesStatus && matchesEquipment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-orange-500/20 text-orange-500"
      case "released":
        return "bg-white/20 text-white"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Unlock className="w-4 h-4" />
      case "released":
        return <Lock className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const draftCount = softwarePackages.filter((pkg) => pkg.status === "draft").length
  const releasedCount = softwarePackages.filter((pkg) => pkg.status === "released").length

  // Group package contents by top level software
  const getGroupedContents = (packageId: string) => {
    const contents = getPackageContents(packageId)
    const grouped: { [tlsId: string]: PackageContent[] } = {}

    contents.forEach((content) => {
      if (!grouped[content.topLevelSoftwareId]) {
        grouped[content.topLevelSoftwareId] = []
      }
      grouped[content.topLevelSoftwareId].push(content)
    })

    return grouped
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SOFTWARE PACKAGES</h1>
          <p className="text-sm text-neutral-400">Manage software release baselines</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Package
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL PACKAGES</p>
                <p className="text-2xl font-bold text-white font-mono">{softwarePackages.length}</p>
              </div>
              <Package className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">DRAFT</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{draftCount}</p>
              </div>
              <Unlock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">RELEASED</p>
                <p className="text-2xl font-bold text-white font-mono">{releasedCount}</p>
              </div>
              <Lock className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

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
      </div>

      {/* Filters */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="all" className="text-white hover:bg-neutral-700">
                    All Status
                  </SelectItem>
                  <SelectItem value="draft" className="text-white hover:bg-neutral-700">
                    Draft
                  </SelectItem>
                  <SelectItem value="released" className="text-white hover:bg-neutral-700">
                    Released
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                <SelectTrigger className="w-48 bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue placeholder="Equipment" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="all" className="text-white hover:bg-neutral-700">
                    All Equipment
                  </SelectItem>
                  {equipments.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id} className="text-white hover:bg-neutral-700">
                      {eq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Package List */}
        <Card className="lg:col-span-5 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                PACKAGE LIST
              </CardTitle>
              <Badge className="bg-neutral-700 text-neutral-300">
                {filteredPackages.length} of {softwarePackages.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPackages.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No packages found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredPackages.map((pkg) => {
                  const equipment = getEquipmentById(pkg.equipmentId)
                  const contents = getPackageContents(pkg.id)

                  return (
                    <div
                      key={pkg.id}
                      className={`p-4 rounded cursor-pointer transition-colors border ${
                        selectedPackage?.id === pkg.id
                          ? "bg-orange-500/20 border-orange-500/50"
                          : "bg-neutral-800 border-neutral-700 hover:border-orange-500/30"
                      }`}
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white font-mono">{pkg.version}</span>
                          {getStatusIcon(pkg.status)}
                          <Badge className={getStatusColor(pkg.status)}>
                            {pkg.status.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-neutral-500 font-mono">{pkg.id}</span>
                      </div>

                      <p className="text-sm text-neutral-400 mb-3">{pkg.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-neutral-400">
                            <Server className="w-3 h-3" />
                            <span>{equipment?.name || "Unknown"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            <span className="font-mono">{pkg.createdAt}</span>
                          </div>
                        </div>
                        <Badge className="bg-neutral-700 text-neutral-300 text-xs">
                          {contents.length} item{contents.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Package Details */}
        <Card className="lg:col-span-7 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              PACKAGE DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPackage ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-10 h-10 text-orange-500" />
                    <div>
                      <h2 className="text-2xl font-bold text-white font-mono">
                        {selectedPackage.version}
                      </h2>
                      <p className="text-sm text-neutral-400 font-mono">{selectedPackage.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedPackage.status)}
                    <Badge className={getStatusColor(selectedPackage.status)}>
                      {selectedPackage.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-800 rounded p-4">
                    <div className="text-xs text-neutral-400 tracking-wider mb-1">EQUIPMENT</div>
                    <div className="text-white">
                      {getEquipmentById(selectedPackage.equipmentId)?.name || "Unknown"}
                    </div>
                  </div>
                  <div className="bg-neutral-800 rounded p-4">
                    <div className="text-xs text-neutral-400 tracking-wider mb-1">CREATED</div>
                    <div className="text-white font-mono">{selectedPackage.createdAt}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                    DESCRIPTION
                  </h3>
                  <p className="text-sm text-neutral-400">{selectedPackage.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-3">
                    PACKAGE CONTENTS
                  </h3>
                  {(() => {
                    const groupedContents = getGroupedContents(selectedPackage.id)
                    const tlsIds = Object.keys(groupedContents)

                    if (tlsIds.length === 0) {
                      return (
                        <div className="text-center py-4 text-neutral-500">
                          <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No contents in this package</p>
                        </div>
                      )
                    }

                    return (
                      <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {tlsIds.map((tlsId) => {
                          const tls = getTopLevelSoftwareById(tlsId)
                          const contents = groupedContents[tlsId]

                          return (
                            <div key={tlsId} className="bg-neutral-800 rounded p-3">
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-700">
                                <Layers className="w-4 h-4 text-white" />
                                <span className="text-sm text-orange-500 font-mono">
                                  {tls?.partNumber}
                                </span>
                                <span className="text-sm text-white">{tls?.name}</span>
                              </div>

                              <div className="space-y-2">
                                {contents.map((content) => {
                                  const revision = getRevisionById(content.componentRevisionId)
                                  const component = revision
                                    ? getComponentById(revision.componentId)
                                    : null

                                  if (!revision || !component) return null

                                  return (
                                    <div
                                      key={content.id}
                                      className="flex items-center justify-between p-2 bg-neutral-900 rounded"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Box className="w-4 h-4 text-orange-500" />
                                        <span className="text-xs text-orange-500 font-mono">
                                          {component.partNumber}
                                        </span>
                                        <span className="text-xs text-neutral-400">
                                          {component.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-neutral-700 text-neutral-300 text-xs">
                                          v{revision.revisionNumber}
                                        </Badge>
                                        <span className="text-xs text-neutral-500 font-mono">
                                          {revision.commitHash}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-700">
                  {selectedPackage.status === "draft" ? (
                    <>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Release Package
                      </Button>
                      <Button
                        variant="outline"
                        className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                      >
                        Edit Contents
                      </Button>
                    </>
                  ) : (
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download Package
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center text-neutral-500">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No Package Selected</p>
                  <p className="text-sm">Select a package from the list to view its contents</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
