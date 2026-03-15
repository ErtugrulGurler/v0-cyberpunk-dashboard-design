import { NextResponse } from "next/server"
import { getDb } from "@/lib/sqlite"

export function GET() {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, component_id as componentId, revision_number as revisionNumber,
           commit_hash as commitHash, build_artifact as buildArtifact,
           change_request_id as changeRequestId, description,
           created_by as createdBy, created_at as createdAt
    FROM component_revisions ORDER BY created_at DESC
  `).all()
  return NextResponse.json(rows)
}
