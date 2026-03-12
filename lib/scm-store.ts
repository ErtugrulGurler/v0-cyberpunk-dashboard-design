import type {
  Equipment,
  TopLevelSoftware,
  Component,
  ComponentRevision,
  ChangeRequest,
  SoftwarePackage,
  PackageContent,
} from "./scm-types"

// 2 Equipment
export const equipments: Equipment[] = [
  {
    id: "EQ-001",
    name: "IFE SERVER",
    description: "",
    createdAt: "2024-01-15",
  },
  {
    id: "EQ-002",
    name: "PRAM",
    description: "",
    createdAt: "2024-02-20",
  },
]

// 4 Top Level Software (2 per equipment) with versions
export const topLevelSoftware: TopLevelSoftware[] = [
  // IFE SERVER
  {
    id: "TLS-001",
    equipmentId: "EQ-001",
    partNumber: "IFE-SW-100",
    name: "SERVER APPLICATION",
    version: "2.1.0",
    description: "",
    createdAt: "2024-01-20",
  },
  {
    id: "TLS-002",
    equipmentId: "EQ-001",
    partNumber: "IFE-SW-200",
    name: "MEDIA MANAGER",
    version: "1.3.0",
    description: "",
    createdAt: "2024-01-25",
  },
  // PRAM
  {
    id: "TLS-003",
    equipmentId: "EQ-002",
    partNumber: "PRAM-SW-100",
    name: "PRAM APPLICATION",
    version: "3.0.0",
    description: "",
    createdAt: "2024-02-25",
  },
  {
    id: "TLS-004",
    equipmentId: "EQ-002",
    partNumber: "PRAM-SW-200",
    name: "PRAM BOOTLOADER",
    version: "1.0.2",
    description: "",
    createdAt: "2024-03-01",
  },
]

// Components (2 per TLS = 8 total)
export const components: Component[] = [
  // SERVER APPLICATION Components
  {
    id: "CMP-001",
    topLevelSoftwareId: "TLS-001",
    partNumber: "IFE-SRV-001",
    name: "CORE ENGINE",
    repositoryUrl: "https://git.internal/ife/core-engine",
    description: "",
    createdAt: "2024-01-22",
  },
  {
    id: "CMP-002",
    topLevelSoftwareId: "TLS-001",
    partNumber: "IFE-SRV-002",
    name: "SESSION MANAGER",
    repositoryUrl: "https://git.internal/ife/session-manager",
    description: "",
    createdAt: "2024-01-23",
  },
  // MEDIA MANAGER Components
  {
    id: "CMP-003",
    topLevelSoftwareId: "TLS-002",
    partNumber: "IFE-MM-001",
    name: "VIDEO DECODER",
    repositoryUrl: "https://git.internal/ife/video-decoder",
    description: "",
    createdAt: "2024-01-26",
  },
  {
    id: "CMP-004",
    topLevelSoftwareId: "TLS-002",
    partNumber: "IFE-MM-002",
    name: "AUDIO ENGINE",
    repositoryUrl: "https://git.internal/ife/audio-engine",
    description: "",
    createdAt: "2024-01-27",
  },
  // PRAM APPLICATION Components
  {
    id: "CMP-005",
    topLevelSoftwareId: "TLS-003",
    partNumber: "PRAM-APP-001",
    name: "UI FRAMEWORK",
    repositoryUrl: "https://git.internal/pram/ui-framework",
    description: "",
    createdAt: "2024-02-26",
  },
  {
    id: "CMP-006",
    topLevelSoftwareId: "TLS-003",
    partNumber: "PRAM-APP-002",
    name: "TOUCH HANDLER",
    repositoryUrl: "https://git.internal/pram/touch-handler",
    description: "",
    createdAt: "2024-02-27",
  },
  // PRAM BOOTLOADER Components
  {
    id: "CMP-007",
    topLevelSoftwareId: "TLS-004",
    partNumber: "PRAM-BL-001",
    name: "BOOT MANAGER",
    repositoryUrl: "https://git.internal/pram/boot-manager",
    description: "",
    createdAt: "2024-03-02",
  },
  {
    id: "CMP-008",
    topLevelSoftwareId: "TLS-004",
    partNumber: "PRAM-BL-002",
    name: "FLASH DRIVER",
    repositoryUrl: "https://git.internal/pram/flash-driver",
    description: "",
    createdAt: "2024-03-03",
  },
]

// Component Revisions - each component has at least one revision with build
export const componentRevisions: ComponentRevision[] = [
  // CMP-001 CORE ENGINE
  { id: "REV-001", componentId: "CMP-001", revisionNumber: "1.0.0", commitHash: "a1b2c3d4", buildArtifact: "core_engine_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_alpha", createdAt: "2024-02-01" },
  { id: "REV-002", componentId: "CMP-001", revisionNumber: "2.0.0", commitHash: "e5f6g7h8", buildArtifact: "core_engine_v2.0.0.bin", changeRequestId: "CR-001", description: "", createdBy: "eng_beta", createdAt: "2024-02-15" },
  { id: "REV-003", componentId: "CMP-001", revisionNumber: "2.1.0", commitHash: "i9j0k1l2", buildArtifact: "core_engine_v2.1.0.bin", changeRequestId: null, description: "", createdBy: "eng_alpha", createdAt: "2024-03-01" },
  // CMP-002 SESSION MANAGER
  { id: "REV-004", componentId: "CMP-002", revisionNumber: "1.0.0", commitHash: "m3n4o5p6", buildArtifact: "session_manager_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_gamma", createdAt: "2024-02-05" },
  { id: "REV-005", componentId: "CMP-002", revisionNumber: "1.1.0", commitHash: "q7r8s9t0", buildArtifact: "session_manager_v1.1.0.bin", changeRequestId: null, description: "", createdBy: "eng_gamma", createdAt: "2024-02-20" },
  // CMP-003 VIDEO DECODER
  { id: "REV-006", componentId: "CMP-003", revisionNumber: "1.0.0", commitHash: "u1v2w3x4", buildArtifact: "video_decoder_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_delta", createdAt: "2024-02-10" },
  { id: "REV-007", componentId: "CMP-003", revisionNumber: "1.2.0", commitHash: "y5z6a7b8", buildArtifact: "video_decoder_v1.2.0.bin", changeRequestId: "CR-002", description: "", createdBy: "eng_delta", createdAt: "2024-03-05" },
  { id: "REV-008", componentId: "CMP-003", revisionNumber: "1.3.0", commitHash: "c9d0e1f2", buildArtifact: "video_decoder_v1.3.0.bin", changeRequestId: null, description: "", createdBy: "eng_delta", createdAt: "2024-03-15" },
  // CMP-004 AUDIO ENGINE
  { id: "REV-009", componentId: "CMP-004", revisionNumber: "1.0.0", commitHash: "g3h4i5j6", buildArtifact: "audio_engine_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_epsilon", createdAt: "2024-02-08" },
  { id: "REV-010", componentId: "CMP-004", revisionNumber: "1.1.0", commitHash: "k7l8m9n0", buildArtifact: "audio_engine_v1.1.0.bin", changeRequestId: null, description: "", createdBy: "eng_epsilon", createdAt: "2024-02-25" },
  // CMP-005 UI FRAMEWORK
  { id: "REV-011", componentId: "CMP-005", revisionNumber: "1.0.0", commitHash: "o1p2q3r4", buildArtifact: "ui_framework_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_zeta", createdAt: "2024-03-01" },
  { id: "REV-012", componentId: "CMP-005", revisionNumber: "2.0.0", commitHash: "s5t6u7v8", buildArtifact: "ui_framework_v2.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_zeta", createdAt: "2024-03-10" },
  { id: "REV-013", componentId: "CMP-005", revisionNumber: "3.0.0", commitHash: "w9x0y1z2", buildArtifact: "ui_framework_v3.0.0.bin", changeRequestId: "CR-003", description: "", createdBy: "eng_zeta", createdAt: "2024-03-20" },
  // CMP-006 TOUCH HANDLER
  { id: "REV-014", componentId: "CMP-006", revisionNumber: "1.0.0", commitHash: "a3b4c5d6", buildArtifact: "touch_handler_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_eta", createdAt: "2024-03-05" },
  { id: "REV-015", componentId: "CMP-006", revisionNumber: "1.1.0", commitHash: "e7f8g9h0", buildArtifact: "touch_handler_v1.1.0.bin", changeRequestId: null, description: "", createdBy: "eng_eta", createdAt: "2024-03-12" },
  // CMP-007 BOOT MANAGER
  { id: "REV-016", componentId: "CMP-007", revisionNumber: "1.0.0", commitHash: "i1j2k3l4", buildArtifact: "boot_manager_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_theta", createdAt: "2024-03-08" },
  { id: "REV-017", componentId: "CMP-007", revisionNumber: "1.0.2", commitHash: "m5n6o7p8", buildArtifact: "boot_manager_v1.0.2.bin", changeRequestId: null, description: "", createdBy: "eng_theta", createdAt: "2024-03-18" },
  // CMP-008 FLASH DRIVER
  { id: "REV-018", componentId: "CMP-008", revisionNumber: "1.0.0", commitHash: "q9r0s1t2", buildArtifact: "flash_driver_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_iota", createdAt: "2024-03-10" },
  { id: "REV-019", componentId: "CMP-008", revisionNumber: "1.0.1", commitHash: "u3v4w5x6", buildArtifact: "flash_driver_v1.0.1.bin", changeRequestId: null, description: "", createdBy: "eng_iota", createdAt: "2024-03-20" },
]

// Change Requests
export const changeRequests: ChangeRequest[] = [
  { id: "CR-001", crNumber: "CR-2024-001", title: "Core Engine Memory Optimization", description: "", affectedComponentId: "CMP-001", status: "closed", createdAt: "2024-02-10" },
  { id: "CR-002", crNumber: "CR-2024-002", title: "Video Decoder 4K Support", description: "", affectedComponentId: "CMP-003", status: "closed", createdAt: "2024-02-25" },
  { id: "CR-003", crNumber: "CR-2024-003", title: "UI Framework Redesign", description: "", affectedComponentId: "CMP-005", status: "closed", createdAt: "2024-03-15" },
  { id: "CR-004", crNumber: "CR-2024-004", title: "Touch Latency Fix", description: "", affectedComponentId: "CMP-006", status: "in_progress", createdAt: "2024-03-28" },
]

// Software Packages
export const softwarePackages: SoftwarePackage[] = [
  { id: "PKG-001", version: "IFE-1.0.0", equipmentId: "EQ-001", description: "", status: "released", createdAt: "2024-03-01" },
  { id: "PKG-002", version: "IFE-2.0.0", equipmentId: "EQ-001", description: "", status: "released", createdAt: "2024-03-20" },
  { id: "PKG-003", version: "IFE-2.1.0", equipmentId: "EQ-001", description: "", status: "draft", createdAt: "2024-04-01" },
  { id: "PKG-004", version: "PRAM-1.0.0", equipmentId: "EQ-002", description: "", status: "released", createdAt: "2024-03-15" },
  { id: "PKG-005", version: "PRAM-2.0.0", equipmentId: "EQ-002", description: "", status: "released", createdAt: "2024-03-25" },
  { id: "PKG-006", version: "PRAM-3.0.0", equipmentId: "EQ-002", description: "", status: "draft", createdAt: "2024-04-05" },
]

// Package Contents
export const packageContents: PackageContent[] = [
  // PKG-001 (IFE-1.0.0)
  { id: "PC-001", packageId: "PKG-001", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-001" },
  { id: "PC-002", packageId: "PKG-001", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-004" },
  { id: "PC-003", packageId: "PKG-001", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-006" },
  { id: "PC-004", packageId: "PKG-001", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-009" },
  // PKG-002 (IFE-2.0.0)
  { id: "PC-005", packageId: "PKG-002", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-002" },
  { id: "PC-006", packageId: "PKG-002", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-005" },
  { id: "PC-007", packageId: "PKG-002", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-007" },
  { id: "PC-008", packageId: "PKG-002", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-010" },
  // PKG-003 (IFE-2.1.0) - draft
  { id: "PC-009", packageId: "PKG-003", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-003" },
  { id: "PC-010", packageId: "PKG-003", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-005" },
  { id: "PC-011", packageId: "PKG-003", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-008" },
  { id: "PC-012", packageId: "PKG-003", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-010" },
  // PKG-004 (PRAM-1.0.0)
  { id: "PC-013", packageId: "PKG-004", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-011" },
  { id: "PC-014", packageId: "PKG-004", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-014" },
  { id: "PC-015", packageId: "PKG-004", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-016" },
  { id: "PC-016", packageId: "PKG-004", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-018" },
  // PKG-005 (PRAM-2.0.0)
  { id: "PC-017", packageId: "PKG-005", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-012" },
  { id: "PC-018", packageId: "PKG-005", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-015" },
  { id: "PC-019", packageId: "PKG-005", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-017" },
  { id: "PC-020", packageId: "PKG-005", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-019" },
  // PKG-006 (PRAM-3.0.0) - draft
  { id: "PC-021", packageId: "PKG-006", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-013" },
  { id: "PC-022", packageId: "PKG-006", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-015" },
  { id: "PC-023", packageId: "PKG-006", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-017" },
  { id: "PC-024", packageId: "PKG-006", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-019" },
]

// Helper functions
export function getEquipmentById(id: string): Equipment | undefined {
  return equipments.find((eq) => eq.id === id)
}

export function getTopLevelSoftwareByEquipment(equipmentId: string): TopLevelSoftware[] {
  return topLevelSoftware.filter((tls) => tls.equipmentId === equipmentId)
}

export function getComponentsByTopLevelSoftware(tlsId: string): Component[] {
  return components.filter((cmp) => cmp.topLevelSoftwareId === tlsId)
}

export function getRevisionsByComponent(componentId: string): ComponentRevision[] {
  return componentRevisions.filter((rev) => rev.componentId === componentId)
}

export function getChangeRequestById(id: string): ChangeRequest | undefined {
  return changeRequests.find((cr) => cr.id === id)
}

export function getPackagesByEquipment(equipmentId: string): SoftwarePackage[] {
  return softwarePackages.filter((pkg) => pkg.equipmentId === equipmentId)
}

export function getPackageContents(packageId: string): PackageContent[] {
  return packageContents.filter((pc) => pc.packageId === packageId)
}

export function getComponentById(id: string): Component | undefined {
  return components.find((cmp) => cmp.id === id)
}

export function getTopLevelSoftwareById(id: string): TopLevelSoftware | undefined {
  return topLevelSoftware.find((tls) => tls.id === id)
}

export function getRevisionById(id: string): ComponentRevision | undefined {
  return componentRevisions.find((rev) => rev.id === id)
}
