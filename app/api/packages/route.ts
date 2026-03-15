import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/sqlite"

export function GET() {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, version, equipment_id as equipmentId, description, status, created_at as createdAt
    FROM software_packages ORDER BY created_at DESC
  `).all()
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { version, equipmentId, description } = await req.json()
  if (!version?.trim()) return NextResponse.json({ error: "Version is required" }, { status: 400 })
  if (!equipmentId) return NextResponse.json({ error: "Equipment is required" }, { status: 400 })

  const db = getDb()
  const result = db.prepare(`
    INSERT INTO software_packages (version, equipment_id, description, status)
    VALUES (?, ?, ?, 'draft')
    RETURNING id, version, equipment_id as equipmentId, description, status, created_at as createdAt
  `).get(version.trim(), equipmentId, (description ?? "").trim())

  return NextResponse.json(result, { status: 201 })
}
