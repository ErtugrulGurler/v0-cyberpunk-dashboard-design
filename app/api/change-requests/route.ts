import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/sqlite"

export function GET() {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, cr_number as crNumber, title, description,
           affected_component_id as affectedComponentId, status, created_at as createdAt
    FROM change_requests ORDER BY created_at DESC
  `).all()
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { title, description, affectedComponentId, status } = await req.json()
  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 })
  if (!affectedComponentId) return NextResponse.json({ error: "Affected component is required" }, { status: 400 })

  const db = getDb()

  const countRow = db.prepare("SELECT COUNT(*) as n FROM change_requests").get() as { n: number }
  const crNumber = `CR-${new Date().getFullYear()}-${String(countRow.n + 1).padStart(3, "0")}`

  const result = db.prepare(`
    INSERT INTO change_requests (cr_number, title, description, affected_component_id, status)
    VALUES (?, ?, ?, ?, ?)
    RETURNING id, cr_number as crNumber, title, description,
              affected_component_id as affectedComponentId, status, created_at as createdAt
  `).get(crNumber, title.trim(), (description ?? "").trim(), affectedComponentId, status ?? "open")

  return NextResponse.json(result, { status: 201 })
}
