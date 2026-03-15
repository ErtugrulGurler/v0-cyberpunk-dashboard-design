import { NextResponse } from "next/server"
import { getDb } from "@/lib/sqlite"

export function GET() {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, top_level_software_id as topLevelSoftwareId, part_number as partNumber,
           version, name, repository_url as repositoryUrl, description, status,
           created_at as createdAt
    FROM components ORDER BY id
  `).all()
  return NextResponse.json(rows)
}
