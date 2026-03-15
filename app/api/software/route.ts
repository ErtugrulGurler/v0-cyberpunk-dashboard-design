import { NextResponse } from "next/server"
import { getDb } from "@/lib/sqlite"

export function GET() {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, equipment_id as equipmentId, part_number as partNumber,
           version, name, description, status, created_at as createdAt
    FROM top_level_software ORDER BY id
  `).all()
  return NextResponse.json(rows)
}
