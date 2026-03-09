// SCM Types - Software Configuration Management

export interface Equipment {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface TopLevelSoftware {
  id: string
  equipmentId: string
  partNumber: string
  name: string
  description: string
  createdAt: string
}

export interface Component {
  id: string
  topLevelSoftwareId: string
  partNumber: string
  name: string
  repositoryUrl: string
  description: string
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
