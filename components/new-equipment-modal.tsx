"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Server, Plus, Loader2 } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export default function NewEquipmentModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const reset = () => { setName(""); setDescription(""); setError("") }

  const handleClose = () => { reset(); onClose() }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError("Name is required"); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Failed"); }
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
            <Server className="w-4 h-4" />
            NEW EQUIPMENT
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs text-neutral-400 tracking-wider">NAME *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. IFE SERVER"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-orange-500 uppercase"
            />
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
              CREATE EQUIPMENT
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
