import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/sqlite"

export function GET() {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, name, description, created_at as createdAt FROM equipment ORDER BY id
  `).all()
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const { name, description } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })

  const db = getDb()
  const result = db.prepare(
    `INSERT INTO equipment (name, description) VALUES (?, ?) RETURNING id, name, description, created_at as createdAt`
  ).get(name.trim(), (description ?? "").trim())

  return NextResponse.json(result, { status: 201 })
}
