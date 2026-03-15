"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Loader2 } from "lucide-react"
import type { Equipment } from "@/lib/scm-types"

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
  equipment: Equipment[]
}

export default function NewPackageModal({ open, onClose, onCreated, equipment }: Props) {
  const [version, setVersion] = useState("")
  const [equipmentId, setEquipmentId] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const reset = () => { setVersion(""); setEquipmentId(""); setDescription(""); setError("") }
  const handleClose = () => { reset(); onClose() }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!version.trim()) { setError("Version is required"); return }
    if (!equipmentId) { setError("Select an equipment target"); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version, equipmentId: Number(equipmentId), description }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed") }
      reset()
      onCreated()
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-neutral-900 border border-neutral-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-500 tracking-wider text-sm font-bold">
            <Package className="w-4 h-4" />
            NEW SOFTWARE PACKAGE
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs text-neutral-400 tracking-wider">VERSION *</Label>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. IFE-3.0.0"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-orange-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-neutral-400 tracking-wider">TARGET EQUIPMENT *</Label>
            <Select value={equipmentId} onValueChange={setEquipmentId}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Select equipment..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                {equipment.map((eq) => (
                  <SelectItem key={eq.id} value={String(eq.id)} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                    {eq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-neutral-400 tracking-wider">DESCRIPTION</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-orange-500"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              CREATE PACKAGE
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white bg-transparent"
            >
              CANCEL
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
