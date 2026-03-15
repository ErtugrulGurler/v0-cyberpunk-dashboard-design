export interface Equipment {
  id: number
  name: string
  description: string
  createdAt: string
}

export interface TopLevelSoftware {
  id: number
  equipmentId: number
  partNumber: string
  version: string
  name: string
  description: string
  status: "DEV" | "REL"
  createdAt: string
}

export interface Component {
  id: number
  topLevelSoftwareId: number
  partNumber: string
  version: string
  name: string
  repositoryUrl: string
  description: string
  status: "DEV" | "REL"
  createdAt: string
}

export interface ComponentRevision {
  id: number
  componentId: number
  revisionNumber: string
  commitHash: string
  buildArtifact: string
  changeRequestId: number | null
  description: string
  createdBy: string
  createdAt: string
}

export interface ChangeRequest {
  id: number
  crNumber: string
  title: string
  description: string
  affectedComponentId: number
  status: "open" | "in_progress" | "closed"
  createdAt: string
}

export interface SoftwarePackage {
  id: number
  version: string
  equipmentId: number
  description: string
  status: "draft" | "released"
  createdAt: string
}

export interface PackageContent {
  id: number
  packageId: number
  topLevelSoftwareId: number
  componentRevisionId: number
}
