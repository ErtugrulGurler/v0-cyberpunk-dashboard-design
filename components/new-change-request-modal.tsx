"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Loader2 } from "lucide-react"
import type { Component } from "@/lib/scm-types"

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
  components: Component[]
}

export default function NewChangeRequestModal({ open, onClose, onCreated, components }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [affectedComponentId, setAffectedComponentId] = useState("")
  const [status, setStatus] = useState("open")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const reset = () => { setTitle(""); setDescription(""); setAffectedComponentId(""); setStatus("open"); setError("") }
  const handleClose = () => { reset(); onClose() }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError("Title is required"); return }
    if (!affectedComponentId) { setError("Select an affected component"); return }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/change-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, affectedComponentId: Number(affectedComponentId), status }),
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
            <FileText className="w-4 h-4" />
            NEW CHANGE REQUEST
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs text-neutral-400 tracking-wider">TITLE *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix memory leak in core engine"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-orange-500"
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

          <div className="space-y-1">
            <Label className="text-xs text-neutral-400 tracking-wider">AFFECTED COMPONENT *</Label>
            <Select value={affectedComponentId} onValueChange={setAffectedComponentId}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Select component..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                {components.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)} className="text-white hover:bg-neutral-700 focus:bg-neutral-700">
                    <span className="font-mono text-orange-500 text-xs">{c.partNumber}</span>
                    <span className="ml-2 text-neutral-300">{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-neutral-400 tracking-wider">INITIAL STATUS</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="open" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">OPEN</SelectItem>
                <SelectItem value="in_progress" className="text-white hover:bg-neutral-700 focus:bg-neutral-700">IN PROGRESS</SelectItem>
              </SelectContent>
            </Select>
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
              CREATE CR
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
