import type {
  Equipment,
  TopLevelSoftware,
  Component,
  ComponentRevision,
  ChangeRequest,
  SoftwarePackage,
  PackageContent,
} from "./scm-types"

// Sample Equipment Data
export const equipments: Equipment[] = [
  {
    id: "EQ-001",
    name: "IFE SERVER",
    description: "In-Flight Entertainment server system",
    createdAt: "2024-01-15",
  },
  {
    id: "EQ-002",
    name: "PRAM",
    description: "Passenger Remote Access Module",
    createdAt: "2024-02-20",
  },
  {
    id: "EQ-003",
    name: "CRAM",
    description: "Crew Remote Access Module",
    createdAt: "2024-03-10",
  },
  {
    id: "EQ-004",
    name: "SCU",
    description: "Seat Control Unit",
    createdAt: "2024-03-15",
  },
  {
    id: "EQ-005",
    name: "ACU",
    description: "Area Control Unit",
    createdAt: "2024-03-20",
  },
  {
    id: "EQ-006",
    name: "HCU",
    description: "Handset Control Unit",
    createdAt: "2024-04-01",
  },
]

// Sample Top Level Software Data
export const topLevelSoftware: TopLevelSoftware[] = [
  // IFE SERVER
  {
    id: "TLS-001",
    equipmentId: "EQ-001",
    partNumber: "IFE-SW-100",
    name: "SERVER APPLICATION",
    description: "",
    createdAt: "2024-01-20",
  },
  {
    id: "TLS-002",
    equipmentId: "EQ-001",
    partNumber: "IFE-SW-200",
    name: "MEDIA MANAGER",
    description: "",
    createdAt: "2024-01-25",
  },
  {
    id: "TLS-003",
    equipmentId: "EQ-001",
    partNumber: "IFE-SW-300",
    name: "CONTENT DELIVERY",
    description: "",
    createdAt: "2024-02-01",
  },
  // PRAM
  {
    id: "TLS-004",
    equipmentId: "EQ-002",
    partNumber: "PRAM-SW-100",
    name: "PRAM APPLICATION",
    description: "",
    createdAt: "2024-02-25",
  },
  {
    id: "TLS-005",
    equipmentId: "EQ-002",
    partNumber: "PRAM-SW-200",
    name: "PRAM BOOTLOADER",
    description: "",
    createdAt: "2024-03-01",
  },
  // CRAM
  {
    id: "TLS-006",
    equipmentId: "EQ-003",
    partNumber: "CRAM-SW-100",
    name: "CRAM APPLICATION",
    description: "",
    createdAt: "2024-03-15",
  },
  {
    id: "TLS-007",
    equipmentId: "EQ-003",
    partNumber: "CRAM-SW-200",
    name: "CRAM BOOTLOADER",
    description: "",
    createdAt: "2024-03-18",
  },
  // SCU
  {
    id: "TLS-008",
    equipmentId: "EQ-004",
    partNumber: "SCU-SW-100",
    name: "SCU FIRMWARE",
    description: "",
    createdAt: "2024-03-20",
  },
  // ACU
  {
    id: "TLS-009",
    equipmentId: "EQ-005",
    partNumber: "ACU-SW-100",
    name: "ACU FIRMWARE",
    description: "",
    createdAt: "2024-03-25",
  },
  // HCU
  {
    id: "TLS-010",
    equipmentId: "EQ-006",
    partNumber: "HCU-SW-100",
    name: "HCU FIRMWARE",
    description: "",
    createdAt: "2024-04-05",
  },
]

// Sample Component Data
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
  {
    id: "CMP-003",
    topLevelSoftwareId: "TLS-001",
    partNumber: "IFE-SRV-003",
    name: "NETWORK STACK",
    repositoryUrl: "https://git.internal/ife/network-stack",
    description: "",
    createdAt: "2024-01-24",
  },
  // MEDIA MANAGER Components
  {
    id: "CMP-004",
    topLevelSoftwareId: "TLS-002",
    partNumber: "IFE-MM-001",
    name: "VIDEO DECODER",
    repositoryUrl: "https://git.internal/ife/video-decoder",
    description: "",
    createdAt: "2024-01-26",
  },
  {
    id: "CMP-005",
    topLevelSoftwareId: "TLS-002",
    partNumber: "IFE-MM-002",
    name: "AUDIO ENGINE",
    repositoryUrl: "https://git.internal/ife/audio-engine",
    description: "",
    createdAt: "2024-01-27",
  },
  // CONTENT DELIVERY Components
  {
    id: "CMP-006",
    topLevelSoftwareId: "TLS-003",
    partNumber: "IFE-CD-001",
    name: "CONTENT STREAMER",
    repositoryUrl: "https://git.internal/ife/content-streamer",
    description: "",
    createdAt: "2024-02-02",
  },
  {
    id: "CMP-007",
    topLevelSoftwareId: "TLS-003",
    partNumber: "IFE-CD-002",
    name: "DRM MODULE",
    repositoryUrl: "https://git.internal/ife/drm-module",
    description: "",
    createdAt: "2024-02-03",
  },
  // PRAM APPLICATION Components
  {
    id: "CMP-008",
    topLevelSoftwareId: "TLS-004",
    partNumber: "PRAM-APP-001",
    name: "UI FRAMEWORK",
    repositoryUrl: "https://git.internal/pram/ui-framework",
    description: "",
    createdAt: "2024-02-26",
  },
  {
    id: "CMP-009",
    topLevelSoftwareId: "TLS-004",
    partNumber: "PRAM-APP-002",
    name: "TOUCH HANDLER",
    repositoryUrl: "https://git.internal/pram/touch-handler",
    description: "",
    createdAt: "2024-02-27",
  },
  // PRAM BOOTLOADER Components
  {
    id: "CMP-010",
    topLevelSoftwareId: "TLS-005",
    partNumber: "PRAM-BL-001",
    name: "BOOT MANAGER",
    repositoryUrl: "https://git.internal/pram/boot-manager",
    description: "",
    createdAt: "2024-03-02",
  },
  // CRAM APPLICATION Components
  {
    id: "CMP-011",
    topLevelSoftwareId: "TLS-006",
    partNumber: "CRAM-APP-001",
    name: "CREW INTERFACE",
    repositoryUrl: "https://git.internal/cram/crew-interface",
    description: "",
    createdAt: "2024-03-16",
  },
  {
    id: "CMP-012",
    topLevelSoftwareId: "TLS-006",
    partNumber: "CRAM-APP-002",
    name: "PA CONTROLLER",
    repositoryUrl: "https://git.internal/cram/pa-controller",
    description: "",
    createdAt: "2024-03-17",
  },
  // CRAM BOOTLOADER Components
  {
    id: "CMP-013",
    topLevelSoftwareId: "TLS-007",
    partNumber: "CRAM-BL-001",
    name: "CRAM BOOT MANAGER",
    repositoryUrl: "https://git.internal/cram/boot-manager",
    description: "",
    createdAt: "2024-03-19",
  },
  // SCU FIRMWARE Components
  {
    id: "CMP-014",
    topLevelSoftwareId: "TLS-008",
    partNumber: "SCU-FW-001",
    name: "SEAT CONTROLLER",
    repositoryUrl: "https://git.internal/scu/seat-controller",
    description: "",
    createdAt: "2024-03-21",
  },
  {
    id: "CMP-015",
    topLevelSoftwareId: "TLS-008",
    partNumber: "SCU-FW-002",
    name: "LIGHT DRIVER",
    repositoryUrl: "https://git.internal/scu/light-driver",
    description: "",
    createdAt: "2024-03-22",
  },
  // ACU FIRMWARE Components
  {
    id: "CMP-016",
    topLevelSoftwareId: "TLS-009",
    partNumber: "ACU-FW-001",
    name: "AREA MANAGER",
    repositoryUrl: "https://git.internal/acu/area-manager",
    description: "",
    createdAt: "2024-03-26",
  },
  {
    id: "CMP-017",
    topLevelSoftwareId: "TLS-009",
    partNumber: "ACU-FW-002",
    name: "BUS CONTROLLER",
    repositoryUrl: "https://git.internal/acu/bus-controller",
    description: "",
    createdAt: "2024-03-27",
  },
  // HCU FIRMWARE Components
  {
    id: "CMP-018",
    topLevelSoftwareId: "TLS-010",
    partNumber: "HCU-FW-001",
    name: "HANDSET DRIVER",
    repositoryUrl: "https://git.internal/hcu/handset-driver",
    description: "",
    createdAt: "2024-04-06",
  },
  {
    id: "CMP-019",
    topLevelSoftwareId: "TLS-010",
    partNumber: "HCU-FW-002",
    name: "INPUT HANDLER",
    repositoryUrl: "https://git.internal/hcu/input-handler",
    description: "",
    createdAt: "2024-04-07",
  },
]

// Sample Component Revision Data - All components have at least one revision with build
export const componentRevisions: ComponentRevision[] = [
  // CMP-001 CORE ENGINE
  { id: "REV-001", componentId: "CMP-001", revisionNumber: "1.0.0", commitHash: "a1b2c3d4", buildArtifact: "core_engine_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_alpha", createdAt: "2024-02-01" },
  { id: "REV-002", componentId: "CMP-001", revisionNumber: "1.1.0", commitHash: "e5f6g7h8", buildArtifact: "core_engine_v1.1.0.bin", changeRequestId: "CR-001", description: "", createdBy: "eng_beta", createdAt: "2024-02-15" },
  // CMP-002 SESSION MANAGER
  { id: "REV-003", componentId: "CMP-002", revisionNumber: "1.0.0", commitHash: "m3n4o5p6", buildArtifact: "session_manager_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_gamma", createdAt: "2024-02-05" },
  // CMP-003 NETWORK STACK
  { id: "REV-004", componentId: "CMP-003", revisionNumber: "1.0.0", commitHash: "u1v2w3x4", buildArtifact: "network_stack_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_delta", createdAt: "2024-02-10" },
  // CMP-004 VIDEO DECODER
  { id: "REV-005", componentId: "CMP-004", revisionNumber: "1.0.0", commitHash: "y5z6a7b8", buildArtifact: "video_decoder_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_epsilon", createdAt: "2024-02-08" },
  { id: "REV-006", componentId: "CMP-004", revisionNumber: "1.1.0", commitHash: "b9c0d1e2", buildArtifact: "video_decoder_v1.1.0.bin", changeRequestId: "CR-002", description: "", createdBy: "eng_epsilon", createdAt: "2024-03-01" },
  // CMP-005 AUDIO ENGINE
  { id: "REV-007", componentId: "CMP-005", revisionNumber: "1.0.0", commitHash: "c9d0e1f2", buildArtifact: "audio_engine_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_zeta", createdAt: "2024-02-12" },
  // CMP-006 CONTENT STREAMER
  { id: "REV-008", componentId: "CMP-006", revisionNumber: "1.0.0", commitHash: "g3h4i5j6", buildArtifact: "content_streamer_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_eta", createdAt: "2024-03-05" },
  // CMP-007 DRM MODULE
  { id: "REV-009", componentId: "CMP-007", revisionNumber: "1.0.0", commitHash: "w9x0y1z2", buildArtifact: "drm_module_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_kappa", createdAt: "2024-03-08" },
  // CMP-008 UI FRAMEWORK
  { id: "REV-010", componentId: "CMP-008", revisionNumber: "1.0.0", commitHash: "o1p2q3r4", buildArtifact: "ui_framework_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_theta", createdAt: "2024-03-10" },
  // CMP-009 TOUCH HANDLER
  { id: "REV-011", componentId: "CMP-009", revisionNumber: "1.0.0", commitHash: "a3b4c5d6", buildArtifact: "touch_handler_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_lambda", createdAt: "2024-03-12" },
  // CMP-010 BOOT MANAGER
  { id: "REV-012", componentId: "CMP-010", revisionNumber: "1.0.0", commitHash: "s5t6u7v8", buildArtifact: "boot_manager_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_iota", createdAt: "2024-03-15" },
  // CMP-011 CREW INTERFACE
  { id: "REV-013", componentId: "CMP-011", revisionNumber: "1.0.0", commitHash: "f7g8h9i0", buildArtifact: "crew_interface_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_mu", createdAt: "2024-03-20" },
  // CMP-012 PA CONTROLLER
  { id: "REV-014", componentId: "CMP-012", revisionNumber: "1.0.0", commitHash: "j1k2l3m4", buildArtifact: "pa_controller_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_nu", createdAt: "2024-03-22" },
  // CMP-013 CRAM BOOT MANAGER
  { id: "REV-015", componentId: "CMP-013", revisionNumber: "1.0.0", commitHash: "n5o6p7q8", buildArtifact: "cram_boot_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_xi", createdAt: "2024-03-24" },
  // CMP-014 SEAT CONTROLLER
  { id: "REV-016", componentId: "CMP-014", revisionNumber: "1.0.0", commitHash: "r9s0t1u2", buildArtifact: "seat_controller_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_omicron", createdAt: "2024-03-26" },
  // CMP-015 LIGHT DRIVER
  { id: "REV-017", componentId: "CMP-015", revisionNumber: "1.0.0", commitHash: "v3w4x5y6", buildArtifact: "light_driver_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_pi", createdAt: "2024-03-28" },
  // CMP-016 AREA MANAGER
  { id: "REV-018", componentId: "CMP-016", revisionNumber: "1.0.0", commitHash: "z7a8b9c0", buildArtifact: "area_manager_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_rho", createdAt: "2024-04-01" },
  // CMP-017 BUS CONTROLLER
  { id: "REV-019", componentId: "CMP-017", revisionNumber: "1.0.0", commitHash: "d1e2f3g4", buildArtifact: "bus_controller_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_sigma", createdAt: "2024-04-03" },
  // CMP-018 HANDSET DRIVER
  { id: "REV-020", componentId: "CMP-018", revisionNumber: "1.0.0", commitHash: "h5i6j7k8", buildArtifact: "handset_driver_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_tau", createdAt: "2024-04-08" },
  // CMP-019 INPUT HANDLER
  { id: "REV-021", componentId: "CMP-019", revisionNumber: "1.0.0", commitHash: "l9m0n1o2", buildArtifact: "input_handler_v1.0.0.bin", changeRequestId: null, description: "", createdBy: "eng_upsilon", createdAt: "2024-04-10" },
]

// Sample Change Request Data
export const changeRequests: ChangeRequest[] = [
  { id: "CR-001", crNumber: "CR-2024-001", title: "Core Engine Memory Optimization", description: "", affectedComponentId: "CMP-001", status: "closed", createdAt: "2024-02-10" },
  { id: "CR-002", crNumber: "CR-2024-002", title: "Video Decoder 4K Support", description: "", affectedComponentId: "CMP-004", status: "closed", createdAt: "2024-02-25" },
  { id: "CR-003", crNumber: "CR-2024-003", title: "Touch Handler Latency Fix", description: "", affectedComponentId: "CMP-009", status: "in_progress", createdAt: "2024-03-28" },
  { id: "CR-004", crNumber: "CR-2024-004", title: "Seat Controller Power Management", description: "", affectedComponentId: "CMP-014", status: "open", createdAt: "2024-04-01" },
]

// Sample Software Package Data
export const softwarePackages: SoftwarePackage[] = [
  { id: "PKG-001", version: "IFE-1.0.0", equipmentId: "EQ-001", description: "", status: "released", createdAt: "2024-03-01" },
  { id: "PKG-002", version: "IFE-1.1.0", equipmentId: "EQ-001", description: "", status: "draft", createdAt: "2024-03-20" },
  { id: "PKG-003", version: "PRAM-1.0.0", equipmentId: "EQ-002", description: "", status: "released", createdAt: "2024-03-15" },
  { id: "PKG-004", version: "CRAM-1.0.0", equipmentId: "EQ-003", description: "", status: "released", createdAt: "2024-03-25" },
  { id: "PKG-005", version: "SCU-1.0.0", equipmentId: "EQ-004", description: "", status: "released", createdAt: "2024-04-01" },
  { id: "PKG-006", version: "ACU-1.0.0", equipmentId: "EQ-005", description: "", status: "draft", createdAt: "2024-04-05" },
  { id: "PKG-007", version: "HCU-1.0.0", equipmentId: "EQ-006", description: "", status: "draft", createdAt: "2024-04-12" },
]

// Sample Package Content Data
export const packageContents: PackageContent[] = [
  // PKG-001 (IFE-1.0.0) - IFE Server released package
  { id: "PC-001", packageId: "PKG-001", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-001" },
  { id: "PC-002", packageId: "PKG-001", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-003" },
  { id: "PC-003", packageId: "PKG-001", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-004" },
  { id: "PC-004", packageId: "PKG-001", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-005" },
  { id: "PC-005", packageId: "PKG-001", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-007" },
  { id: "PC-006", packageId: "PKG-001", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-008" },
  { id: "PC-007", packageId: "PKG-001", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-009" },
  // PKG-002 (IFE-1.1.0) - IFE Server draft package with updates
  { id: "PC-008", packageId: "PKG-002", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-002" },
  { id: "PC-009", packageId: "PKG-002", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-003" },
  { id: "PC-010", packageId: "PKG-002", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-004" },
  { id: "PC-011", packageId: "PKG-002", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-006" },
  { id: "PC-012", packageId: "PKG-002", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-007" },
  { id: "PC-013", packageId: "PKG-002", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-008" },
  { id: "PC-014", packageId: "PKG-002", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-009" },
  // PKG-003 (PRAM-1.0.0)
  { id: "PC-015", packageId: "PKG-003", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-010" },
  { id: "PC-016", packageId: "PKG-003", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-011" },
  { id: "PC-017", packageId: "PKG-003", topLevelSoftwareId: "TLS-005", componentRevisionId: "REV-012" },
  // PKG-004 (CRAM-1.0.0)
  { id: "PC-018", packageId: "PKG-004", topLevelSoftwareId: "TLS-006", componentRevisionId: "REV-013" },
  { id: "PC-019", packageId: "PKG-004", topLevelSoftwareId: "TLS-006", componentRevisionId: "REV-014" },
  { id: "PC-020", packageId: "PKG-004", topLevelSoftwareId: "TLS-007", componentRevisionId: "REV-015" },
  // PKG-005 (SCU-1.0.0)
  { id: "PC-021", packageId: "PKG-005", topLevelSoftwareId: "TLS-008", componentRevisionId: "REV-016" },
  { id: "PC-022", packageId: "PKG-005", topLevelSoftwareId: "TLS-008", componentRevisionId: "REV-017" },
  // PKG-006 (ACU-1.0.0) - draft
  { id: "PC-023", packageId: "PKG-006", topLevelSoftwareId: "TLS-009", componentRevisionId: "REV-018" },
  { id: "PC-024", packageId: "PKG-006", topLevelSoftwareId: "TLS-009", componentRevisionId: "REV-019" },
  // PKG-007 (HCU-1.0.0) - draft
  { id: "PC-025", packageId: "PKG-007", topLevelSoftwareId: "TLS-010", componentRevisionId: "REV-020" },
  { id: "PC-026", packageId: "PKG-007", topLevelSoftwareId: "TLS-010", componentRevisionId: "REV-021" },
]

// Helper functions to get related data
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
