import pool from "./db"
import type {
  Equipment,
  TopLevelSoftware,
  Component,
  ComponentRevision,
  ChangeRequest,
  SoftwarePackage,
  PackageContent,
} from "./scm-types"

function row(r: Record<string, unknown>): Record<string, unknown> {
  return r
}

export async function getAllEquipment(): Promise<Equipment[]> {
  const { rows } = await pool.query(
    `SELECT id, name, description, created_at::text AS "createdAt" FROM equipment ORDER BY id`
  )
  return rows.map(row) as unknown as Equipment[]
}

export async function getAllTopLevelSoftware(): Promise<TopLevelSoftware[]> {
  const { rows } = await pool.query(
    `SELECT id, equipment_id AS "equipmentId", part_number AS "partNumber",
            name, version, description, status, created_at::text AS "createdAt"
     FROM top_level_software ORDER BY id`
  )
  return rows.map(row) as unknown as TopLevelSoftware[]
}

export async function getTopLevelSoftwareByEquipment(equipmentId: string): Promise<TopLevelSoftware[]> {
  const { rows } = await pool.query(
    `SELECT id, equipment_id AS "equipmentId", part_number AS "partNumber",
            name, version, description, status, created_at::text AS "createdAt"
     FROM top_level_software WHERE equipment_id = $1 ORDER BY id`,
    [equipmentId]
  )
  return rows.map(row) as unknown as TopLevelSoftware[]
}

export async function getTopLevelSoftwareById(id: string): Promise<TopLevelSoftware | undefined> {
  const { rows } = await pool.query(
    `SELECT id, equipment_id AS "equipmentId", part_number AS "partNumber",
            name, version, description, status, created_at::text AS "createdAt"
     FROM top_level_software WHERE id = $1`,
    [id]
  )
  return rows[0] as unknown as TopLevelSoftware | undefined
}

export async function getAllComponents(): Promise<Component[]> {
  const { rows } = await pool.query(
    `SELECT id, top_level_software_id AS "topLevelSoftwareId", part_number AS "partNumber",
            name, repository_url AS "repositoryUrl", description, status, created_at::text AS "createdAt"
     FROM components ORDER BY id`
  )
  return rows.map(row) as unknown as Component[]
}

export async function getComponentsByTopLevelSoftware(tlsId: string): Promise<Component[]> {
  const { rows } = await pool.query(
    `SELECT id, top_level_software_id AS "topLevelSoftwareId", part_number AS "partNumber",
            name, repository_url AS "repositoryUrl", description, status, created_at::text AS "createdAt"
     FROM components WHERE top_level_software_id = $1 ORDER BY id`,
    [tlsId]
  )
  return rows.map(row) as unknown as Component[]
}

export async function getComponentById(id: string): Promise<Component | undefined> {
  const { rows } = await pool.query(
    `SELECT id, top_level_software_id AS "topLevelSoftwareId", part_number AS "partNumber",
            name, repository_url AS "repositoryUrl", description, status, created_at::text AS "createdAt"
     FROM components WHERE id = $1`,
    [id]
  )
  return rows[0] as unknown as Component | undefined
}

export async function getAllRevisions(): Promise<ComponentRevision[]> {
  const { rows } = await pool.query(
    `SELECT id, component_id AS "componentId", revision_number AS "revisionNumber",
            commit_hash AS "commitHash", build_artifact AS "buildArtifact",
            change_request_id AS "changeRequestId", description,
            created_by AS "createdBy", created_at::text AS "createdAt"
     FROM component_revisions ORDER BY created_at DESC`
  )
  return rows.map(row) as unknown as ComponentRevision[]
}

export async function getRevisionsByComponent(componentId: string): Promise<ComponentRevision[]> {
  const { rows } = await pool.query(
    `SELECT id, component_id AS "componentId", revision_number AS "revisionNumber",
            commit_hash AS "commitHash", build_artifact AS "buildArtifact",
            change_request_id AS "changeRequestId", description,
            created_by AS "createdBy", created_at::text AS "createdAt"
     FROM component_revisions WHERE component_id = $1 ORDER BY created_at DESC`,
    [componentId]
  )
  return rows.map(row) as unknown as ComponentRevision[]
}

export async function getRevisionById(id: string): Promise<ComponentRevision | undefined> {
  const { rows } = await pool.query(
    `SELECT id, component_id AS "componentId", revision_number AS "revisionNumber",
            commit_hash AS "commitHash", build_artifact AS "buildArtifact",
            change_request_id AS "changeRequestId", description,
            created_by AS "createdBy", created_at::text AS "createdAt"
     FROM component_revisions WHERE id = $1`,
    [id]
  )
  return rows[0] as unknown as ComponentRevision | undefined
}

export async function getAllChangeRequests(): Promise<ChangeRequest[]> {
  const { rows } = await pool.query(
    `SELECT id, cr_number AS "crNumber", title, description,
            affected_component_id AS "affectedComponentId",
            status, created_at::text AS "createdAt"
     FROM change_requests ORDER BY created_at DESC`
  )
  return rows.map(row) as unknown as ChangeRequest[]
}

export async function getChangeRequestById(id: string): Promise<ChangeRequest | undefined> {
  const { rows } = await pool.query(
    `SELECT id, cr_number AS "crNumber", title, description,
            affected_component_id AS "affectedComponentId",
            status, created_at::text AS "createdAt"
     FROM change_requests WHERE id = $1`,
    [id]
  )
  return rows[0] as unknown as ChangeRequest | undefined
}

export async function getAllSoftwarePackages(): Promise<SoftwarePackage[]> {
  const { rows } = await pool.query(
    `SELECT id, version, equipment_id AS "equipmentId", description,
            status, created_at::text AS "createdAt"
     FROM software_packages ORDER BY created_at DESC`
  )
  return rows.map(row) as unknown as SoftwarePackage[]
}

export async function getPackagesByEquipment(equipmentId: string): Promise<SoftwarePackage[]> {
  const { rows } = await pool.query(
    `SELECT id, version, equipment_id AS "equipmentId", description,
            status, created_at::text AS "createdAt"
     FROM software_packages WHERE equipment_id = $1 ORDER BY created_at DESC`,
    [equipmentId]
  )
  return rows.map(row) as unknown as SoftwarePackage[]
}

export async function getPackageContents(packageId: string): Promise<PackageContent[]> {
  const { rows } = await pool.query(
    `SELECT id, package_id AS "packageId",
            top_level_software_id AS "topLevelSoftwareId",
            component_revision_id AS "componentRevisionId"
     FROM package_contents WHERE package_id = $1`,
    [packageId]
  )
  return rows.map(row) as unknown as PackageContent[]
}
