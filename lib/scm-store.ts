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
    name: "AVIONICS CONTROL SYSTEM",
    description: "Primary flight control avionics system for advanced aircraft",
    createdAt: "2024-01-15",
  },
  {
    id: "EQ-002",
    name: "RADAR PROCESSING UNIT",
    description: "Advanced radar signal processing and tracking system",
    createdAt: "2024-02-20",
  },
  {
    id: "EQ-003",
    name: "MISSION COMPUTER",
    description: "Central mission planning and execution computer system",
    createdAt: "2024-03-10",
  },
]

// Sample Top Level Software Data
export const topLevelSoftware: TopLevelSoftware[] = [
  {
    id: "TLS-001",
    equipmentId: "EQ-001",
    partNumber: "ACS-SW-100",
    name: "FLIGHT CONTROL SOFTWARE",
    description: "Primary flight control algorithms and interfaces",
    createdAt: "2024-01-20",
  },
  {
    id: "TLS-002",
    equipmentId: "EQ-001",
    partNumber: "ACS-SW-200",
    name: "NAVIGATION SOFTWARE",
    description: "GPS and INS navigation processing software",
    createdAt: "2024-01-25",
  },
  {
    id: "TLS-003",
    equipmentId: "EQ-002",
    partNumber: "RPU-SW-100",
    name: "SIGNAL PROCESSOR",
    description: "Radar signal processing and filtering algorithms",
    createdAt: "2024-02-25",
  },
  {
    id: "TLS-004",
    equipmentId: "EQ-002",
    partNumber: "RPU-SW-200",
    name: "TARGET TRACKER",
    description: "Multi-target tracking and classification system",
    createdAt: "2024-03-01",
  },
  {
    id: "TLS-005",
    equipmentId: "EQ-003",
    partNumber: "MC-SW-100",
    name: "MISSION PLANNER",
    description: "Mission planning and waypoint management software",
    createdAt: "2024-03-15",
  },
]

// Sample Component Data
export const components: Component[] = [
  {
    id: "CMP-001",
    topLevelSoftwareId: "TLS-001",
    partNumber: "FCS-CMP-001",
    name: "AUTOPILOT MODULE",
    repositoryUrl: "https://git.internal/avionics/autopilot",
    description: "Autopilot control and engagement logic",
    createdAt: "2024-01-22",
  },
  {
    id: "CMP-002",
    topLevelSoftwareId: "TLS-001",
    partNumber: "FCS-CMP-002",
    name: "FLIGHT ENVELOPE",
    repositoryUrl: "https://git.internal/avionics/flight-envelope",
    description: "Flight envelope protection algorithms",
    createdAt: "2024-01-23",
  },
  {
    id: "CMP-003",
    topLevelSoftwareId: "TLS-001",
    partNumber: "FCS-CMP-003",
    name: "ACTUATOR DRIVER",
    repositoryUrl: "https://git.internal/avionics/actuator-driver",
    description: "Control surface actuator interface driver",
    createdAt: "2024-01-24",
  },
  {
    id: "CMP-004",
    topLevelSoftwareId: "TLS-002",
    partNumber: "NAV-CMP-001",
    name: "GPS INTERFACE",
    repositoryUrl: "https://git.internal/avionics/gps-interface",
    description: "GPS receiver interface and data processing",
    createdAt: "2024-01-26",
  },
  {
    id: "CMP-005",
    topLevelSoftwareId: "TLS-002",
    partNumber: "NAV-CMP-002",
    name: "INS PROCESSOR",
    repositoryUrl: "https://git.internal/avionics/ins-processor",
    description: "Inertial navigation system data processing",
    createdAt: "2024-01-27",
  },
  {
    id: "CMP-006",
    topLevelSoftwareId: "TLS-003",
    partNumber: "SIG-CMP-001",
    name: "FFT ENGINE",
    repositoryUrl: "https://git.internal/radar/fft-engine",
    description: "Fast Fourier Transform processing engine",
    createdAt: "2024-02-27",
  },
  {
    id: "CMP-007",
    topLevelSoftwareId: "TLS-003",
    partNumber: "SIG-CMP-002",
    name: "FILTER BANK",
    repositoryUrl: "https://git.internal/radar/filter-bank",
    description: "Digital filter bank for signal conditioning",
    createdAt: "2024-02-28",
  },
  {
    id: "CMP-008",
    topLevelSoftwareId: "TLS-004",
    partNumber: "TRK-CMP-001",
    name: "KALMAN FILTER",
    repositoryUrl: "https://git.internal/radar/kalman-filter",
    description: "Extended Kalman filter for target tracking",
    createdAt: "2024-03-02",
  },
  {
    id: "CMP-009",
    topLevelSoftwareId: "TLS-004",
    partNumber: "TRK-CMP-002",
    name: "CLASSIFIER",
    repositoryUrl: "https://git.internal/radar/classifier",
    description: "Target classification neural network",
    createdAt: "2024-03-03",
  },
  {
    id: "CMP-010",
    topLevelSoftwareId: "TLS-005",
    partNumber: "MSN-CMP-001",
    name: "WAYPOINT MANAGER",
    repositoryUrl: "https://git.internal/mission/waypoint-manager",
    description: "Mission waypoint creation and management",
    createdAt: "2024-03-16",
  },
]

// Sample Component Revision Data
export const componentRevisions: ComponentRevision[] = [
  {
    id: "REV-001",
    componentId: "CMP-001",
    revisionNumber: "1.0.0",
    commitHash: "a1b2c3d4",
    buildArtifact: "autopilot_v1.0.0.exe",
    changeRequestId: null,
    description: "Initial release of autopilot module",
    createdBy: "eng_alpha",
    createdAt: "2024-02-01",
  },
  {
    id: "REV-002",
    componentId: "CMP-001",
    revisionNumber: "1.1.0",
    commitHash: "e5f6g7h8",
    buildArtifact: "autopilot_v1.1.0.exe",
    changeRequestId: "CR-001",
    description: "Added altitude hold feature",
    createdBy: "eng_beta",
    createdAt: "2024-02-15",
  },
  {
    id: "REV-003",
    componentId: "CMP-001",
    revisionNumber: "1.2.0",
    commitHash: "i9j0k1l2",
    buildArtifact: "autopilot_v1.2.0.exe",
    changeRequestId: "CR-003",
    description: "Performance optimization for altitude hold",
    createdBy: "eng_alpha",
    createdAt: "2024-03-01",
  },
  {
    id: "REV-004",
    componentId: "CMP-002",
    revisionNumber: "1.0.0",
    commitHash: "m3n4o5p6",
    buildArtifact: "flight_envelope_v1.0.0.exe",
    changeRequestId: null,
    description: "Initial flight envelope protection",
    createdBy: "eng_gamma",
    createdAt: "2024-02-05",
  },
  {
    id: "REV-005",
    componentId: "CMP-002",
    revisionNumber: "1.0.1",
    commitHash: "q7r8s9t0",
    buildArtifact: "flight_envelope_v1.0.1.exe",
    changeRequestId: "CR-002",
    description: "Bug fix for stall protection",
    createdBy: "eng_gamma",
    createdAt: "2024-02-20",
  },
  {
    id: "REV-006",
    componentId: "CMP-003",
    revisionNumber: "1.0.0",
    commitHash: "u1v2w3x4",
    buildArtifact: "actuator_driver_v1.0.0.bin",
    changeRequestId: null,
    description: "Initial actuator driver release",
    createdBy: "eng_delta",
    createdAt: "2024-02-10",
  },
  {
    id: "REV-007",
    componentId: "CMP-004",
    revisionNumber: "1.0.0",
    commitHash: "y5z6a7b8",
    buildArtifact: "gps_interface_v1.0.0.exe",
    changeRequestId: null,
    description: "Initial GPS interface module",
    createdBy: "eng_epsilon",
    createdAt: "2024-02-08",
  },
  {
    id: "REV-008",
    componentId: "CMP-005",
    revisionNumber: "1.0.0",
    commitHash: "c9d0e1f2",
    buildArtifact: "ins_processor_v1.0.0.exe",
    changeRequestId: null,
    description: "Initial INS processor module",
    createdBy: "eng_zeta",
    createdAt: "2024-02-12",
  },
  {
    id: "REV-009",
    componentId: "CMP-006",
    revisionNumber: "1.0.0",
    commitHash: "g3h4i5j6",
    buildArtifact: "fft_engine_v1.0.0.bin",
    changeRequestId: null,
    description: "Initial FFT engine implementation",
    createdBy: "eng_eta",
    createdAt: "2024-03-05",
  },
  {
    id: "REV-010",
    componentId: "CMP-006",
    revisionNumber: "1.1.0",
    commitHash: "k7l8m9n0",
    buildArtifact: "fft_engine_v1.1.0.bin",
    changeRequestId: "CR-004",
    description: "Added support for higher sample rates",
    createdBy: "eng_eta",
    createdAt: "2024-03-20",
  },
  {
    id: "REV-011",
    componentId: "CMP-008",
    revisionNumber: "1.0.0",
    commitHash: "o1p2q3r4",
    buildArtifact: "kalman_filter_v1.0.0.exe",
    changeRequestId: null,
    description: "Initial Kalman filter implementation",
    createdBy: "eng_theta",
    createdAt: "2024-03-10",
  },
  {
    id: "REV-012",
    componentId: "CMP-010",
    revisionNumber: "1.0.0",
    commitHash: "s5t6u7v8",
    buildArtifact: "waypoint_manager_v1.0.0.exe",
    changeRequestId: null,
    description: "Initial waypoint manager release",
    createdBy: "eng_iota",
    createdAt: "2024-03-25",
  },
  {
    id: "REV-013",
    componentId: "CMP-007",
    revisionNumber: "1.0.0",
    commitHash: "w9x0y1z2",
    buildArtifact: "filter_bank_v1.0.0.bin",
    changeRequestId: null,
    description: "Initial filter bank release",
    createdBy: "eng_kappa",
    createdAt: "2024-03-08",
  },
  {
    id: "REV-014",
    componentId: "CMP-009",
    revisionNumber: "1.0.0",
    commitHash: "a3b4c5d6",
    buildArtifact: "classifier_v1.0.0.exe",
    changeRequestId: null,
    description: "Initial classifier release",
    createdBy: "eng_lambda",
    createdAt: "2024-03-12",
  },
]

// Sample Change Request Data
export const changeRequests: ChangeRequest[] = [
  {
    id: "CR-001",
    crNumber: "CR-2024-001",
    title: "Add Altitude Hold Feature",
    description: "Implement altitude hold functionality in the autopilot module to maintain current altitude when engaged",
    affectedComponentId: "CMP-001",
    status: "closed",
    createdAt: "2024-02-10",
  },
  {
    id: "CR-002",
    crNumber: "CR-2024-002",
    title: "Fix Stall Protection Bug",
    description: "Correct the stall protection logic that was triggering too early during high-G maneuvers",
    affectedComponentId: "CMP-002",
    status: "closed",
    createdAt: "2024-02-18",
  },
  {
    id: "CR-003",
    crNumber: "CR-2024-003",
    title: "Optimize Altitude Hold Performance",
    description: "Improve altitude hold response time and reduce overshoot during engagement",
    affectedComponentId: "CMP-001",
    status: "closed",
    createdAt: "2024-02-25",
  },
  {
    id: "CR-004",
    crNumber: "CR-2024-004",
    title: "Higher Sample Rate Support",
    description: "Add support for 100kHz sample rate in FFT engine for improved resolution",
    affectedComponentId: "CMP-006",
    status: "closed",
    createdAt: "2024-03-15",
  },
  {
    id: "CR-005",
    crNumber: "CR-2024-005",
    title: "Add Multi-Target Tracking",
    description: "Extend Kalman filter to support simultaneous tracking of up to 50 targets",
    affectedComponentId: "CMP-008",
    status: "in_progress",
    createdAt: "2024-03-28",
  },
  {
    id: "CR-006",
    crNumber: "CR-2024-006",
    title: "GPS Signal Loss Handling",
    description: "Implement graceful degradation when GPS signal is lost during navigation",
    affectedComponentId: "CMP-004",
    status: "open",
    createdAt: "2024-04-01",
  },
  {
    id: "CR-007",
    crNumber: "CR-2024-007",
    title: "Add Waypoint Import Feature",
    description: "Allow importing waypoints from external mission planning systems",
    affectedComponentId: "CMP-010",
    status: "open",
    createdAt: "2024-04-05",
  },
]

// Sample Software Package Data
export const softwarePackages: SoftwarePackage[] = [
  {
    id: "PKG-001",
    version: "ACS-1.0.0",
    equipmentId: "EQ-001",
    description: "Initial release package for Avionics Control System",
    status: "released",
    createdAt: "2024-02-15",
  },
  {
    id: "PKG-002",
    version: "ACS-1.1.0",
    equipmentId: "EQ-001",
    description: "Feature update with altitude hold capability",
    status: "released",
    createdAt: "2024-03-05",
  },
  {
    id: "PKG-003",
    version: "ACS-1.2.0",
    equipmentId: "EQ-001",
    description: "Performance improvements and bug fixes",
    status: "draft",
    createdAt: "2024-03-20",
  },
  {
    id: "PKG-004",
    version: "RPU-1.0.0",
    equipmentId: "EQ-002",
    description: "Initial release package for Radar Processing Unit",
    status: "released",
    createdAt: "2024-03-15",
  },
  {
    id: "PKG-005",
    version: "RPU-1.1.0",
    equipmentId: "EQ-002",
    description: "Enhanced signal processing capabilities",
    status: "draft",
    createdAt: "2024-03-30",
  },
]

// Sample Package Content Data
export const packageContents: PackageContent[] = [
  // PKG-001 (ACS-1.0.0)
  { id: "PC-001", packageId: "PKG-001", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-001" },
  { id: "PC-002", packageId: "PKG-001", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-004" },
  { id: "PC-003", packageId: "PKG-001", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-006" },
  { id: "PC-004", packageId: "PKG-001", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-007" },
  { id: "PC-005", packageId: "PKG-001", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-008" },
  // PKG-002 (ACS-1.1.0)
  { id: "PC-006", packageId: "PKG-002", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-002" },
  { id: "PC-007", packageId: "PKG-002", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-005" },
  { id: "PC-008", packageId: "PKG-002", topLevelSoftwareId: "TLS-001", componentRevisionId: "REV-006" },
  { id: "PC-009", packageId: "PKG-002", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-007" },
  { id: "PC-010", packageId: "PKG-002", topLevelSoftwareId: "TLS-002", componentRevisionId: "REV-008" },
  // PKG-004 (RPU-1.0.0)
  { id: "PC-011", packageId: "PKG-004", topLevelSoftwareId: "TLS-003", componentRevisionId: "REV-009" },
  { id: "PC-012", packageId: "PKG-004", topLevelSoftwareId: "TLS-004", componentRevisionId: "REV-011" },
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
