// SCM Types - Software Configuration Management

export interface Equipment {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface TopLevelSoftware {
  id: string // Hidden primary key: topsw-01, topsw-02, etc.
  equipmentId: string
  partNumberVersion: string // PN + Version combined (e.g., "IFE-SW-100 v2.1.0")
  name: string // Display name only
  status: "DEV" | "REL" // Development or Released
  createdAt: string
}

export interface Component {
  id: string // Hidden primary key: sw-01, sw-02, etc.
  topLevelSoftwareId: string
  partNumberVersion: string // PN + Version combined (e.g., "IFE-SRV-001 v1.0.0")
  name: string // Display name only
  repositoryUrl: string
  status: "DEV" | "REL" // Development or Released
  createdAt: string
}

export interface ComponentRevision {
  id: string
  componentId: string
  revisionNumber: string
  commitHash: string
  buildArtifact: string
  changeRequestId: string | null
  description: string
  createdBy: string
  createdAt: string
}

export interface ChangeRequest {
  id: string
  crNumber: string
  title: string
  description: string
  affectedComponentId: string
  status: "open" | "in_progress" | "closed"
  createdAt: string
}

export interface SoftwarePackage {
  id: string
  version: string
  equipmentId: string
  description: string
  status: "draft" | "released"
  createdAt: string
}

export interface PackageContent {
  id: string
  packageId: string
  topLevelSoftwareId: string
  componentRevisionId: string
}

// Tree Node types for the software tree view
export interface TreeNode {
  id: string
  type: "equipment" | "topLevelSoftware" | "component"
  name: string
  partNumber?: string
  children?: TreeNode[]
  data?: Equipment | TopLevelSoftware | Component
}
