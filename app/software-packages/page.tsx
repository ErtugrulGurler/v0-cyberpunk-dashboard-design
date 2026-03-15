"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Search, Server, Lock, Unlock, FileText, Download, CheckCircle } from "lucide-react"
import type { SoftwarePackage, Equipment } from "@/lib/scm-types"
import NewPackageModal from "@/components/new-package-modal"

export default function SoftwarePackagesPage() {
  const [softwarePackages, setSoftwarePackages] = useState<SoftwarePackage[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [selectedPackage, setSelectedPackage] = useState<SoftwarePackage | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [equipmentFilter, setEquipmentFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)

  const loadData = () => {
    Promise.all([
      fetch("/api/packages").then((r) => r.json()),
      fetch("/api/equipment").then((r) => r.json()),
    ]).then(([pkgs, eq]) => { setSoftwarePackages(pkgs); setEquipment(eq) })
  }

  useEffect(() => { loadData() }, [])

  const filtered = softwarePackages.filter((pkg) => {
    const q = searchQuery.toLowerCase()
    const matchSearch = pkg.version.toLowerCase().includes(q) || pkg.description.toLowerCase().includes(q)
    const matchStatus = statusFilter === "all" || pkg.status === statusFilter
    const matchEquip = equipmentFilter === "all" || String(pkg.equipmentId) === equipmentFilter
    return matchSearch && matchStatus && matchEquip
  })

  const draftCount = softwarePackages.filter((p) => p.status === "draft").length
  const releasedCount = softwarePackages.filter((p) => p.status === "released").length
  const getEquipment = (id: number) => equipment.find((e) => e.id === id)

  const getStatusColor = (status: string) => status === "draft" ? "bg-orange-500/20 text-orange-500" : "bg-white/20 text-white"
  const getStatusIcon = (status: string) => status === "draft" ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SOFTWARE PACKAGES</h1>
          <p className="text-sm text-neutral-400">Manage software release baselines</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Package
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL PACKAGES", value: softwarePackages.length, icon: <Package className="w-8 h-8 text-orange-500" /> },
          { label: "DRAFT",          value: draftCount,              icon: <Unlock className="w-8 h-8 text-orange-500" /> },
          { label: "RELEASED",       value: releasedCount,           icon: <Lock className="w-8 h-8 text-white" /> },
          { label: "EQUIPMENT",      value: equipment.length,        icon: <Server className="w-8 h-8 text-neutral-400" /> },
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

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packages..."
            className="pl-9 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-neutral-800 border-neutral-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            <SelectItem value="all" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">ALL STATUS</SelectItem>
            <SelectItem value="draft" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">DRAFT</SelectItem>
            <SelectItem value="released" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">RELEASED</SelectItem>
          </SelectContent>
        </Select>
        <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
          <SelectTrigger className="w-48 bg-neutral-800 border-neutral-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            <SelectItem value="all" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">ALL EQUIPMENT</SelectItem>
            {equipment.map((e) => (
              <SelectItem key={e.id} value={String(e.id)} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              PACKAGES ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {filtered.map((pkg) => {
                const eq = getEquipment(pkg.equipmentId)
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 border-b border-neutral-800 cursor-pointer transition-colors ${selectedPackage?.id === pkg.id ? "bg-orange-500/10 border-l-2 border-l-orange-500" : "hover:bg-neutral-800"}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-mono font-bold text-white">{pkg.version}</span>
                      <Badge className={`${getStatusColor(pkg.status)} flex items-center gap-1 text-xs`}>
                        {getStatusIcon(pkg.status)}
                        {pkg.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Server className="w-3 h-3 text-neutral-500" />
                      <span className="text-xs text-neutral-400">{eq?.name ?? "—"}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{pkg.createdAt}</p>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-neutral-500">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No packages found</p>
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
            {selectedPackage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-xs text-neutral-500">PACKAGE</p>
                    <h3 className="text-xl font-bold text-white font-mono">{selectedPackage.version}</h3>
                  </div>
                  <Badge className={`${getStatusColor(selectedPackage.status)} flex items-center gap-1`}>
                    {getStatusIcon(selectedPackage.status)}
                    {selectedPackage.status.toUpperCase()}
                  </Badge>
                </div>

                {selectedPackage.description && (
                  <p className="text-sm text-neutral-400 bg-neutral-800 rounded p-3">{selectedPackage.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-neutral-800 rounded">
                    <div className="text-neutral-500 mb-1">ID (PK)</div>
                    <div className="text-white font-mono">{selectedPackage.id}</div>
                  </div>
                  <div className="p-3 bg-neutral-800 rounded">
                    <div className="text-neutral-500 mb-1">EQUIPMENT</div>
                    <div className="text-white">{getEquipment(selectedPackage.equipmentId)?.name ?? "—"}</div>
                  </div>
                  <div className="p-3 bg-neutral-800 rounded">
                    <div className="text-neutral-500 mb-1">CREATED</div>
                    <div className="text-white font-mono">{selectedPackage.createdAt}</div>
                  </div>
                  <div className="p-3 bg-neutral-800 rounded">
                    <div className="text-neutral-500 mb-1">STATUS</div>
                    <div className="text-white">{selectedPackage.status.toUpperCase()}</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-700">
                  {selectedPackage.status === "draft" ? (
                    <>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Release Package
                      </Button>
                      <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
                        Edit Contents
                      </Button>
                    </>
                  ) : (
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download Package
                    </Button>
                  )}
                  <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-neutral-500">
                  <Package className="w-14 h-14 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a package to view details</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <NewPackageModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadData}
        equipment={equipment}
      />
    </div>
  )
}
