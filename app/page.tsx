"use client"

import { useState } from "react"
import { ChevronRight, FolderTree, History, FileText, Package, Bell, RefreshCw, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import SoftwareTreePage from "./software-tree/page"
import ComponentHistoryPage from "./component-history/page"
import ChangeRequestsPage from "./change-requests/page"
import SoftwarePackagesPage from "./software-packages/page"
import DashboardOverview from "@/components/dashboard-overview"

export default function SCMDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const getSectionTitle = () => {
    switch (activeSection) {
      case "overview":
        return "DASHBOARD"
      case "tree":
        return "SOFTWARE TREE"
      case "history":
        return "COMPONENT HISTORY"
      case "change-requests":
        return "CHANGE REQUESTS"
      case "packages":
        return "SOFTWARE PACKAGES"
      default:
        return "OVERVIEW"
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-orange-500 font-bold text-lg tracking-wider">SCM CONTROL</h1>
              <p className="text-neutral-500 text-xs">Software Configuration Management</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-orange-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", icon: LayoutDashboard, label: "DASHBOARD" },
              { id: "tree", icon: FolderTree, label: "SOFTWARE TREE" },
              { id: "history", icon: History, label: "COMPONENT HISTORY" },
              { id: "change-requests", icon: FileText, label: "CHANGE REQUESTS" },
              { id: "packages", icon: Package, label: "SOFTWARE PACKAGES" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs text-white">SYSTEM ONLINE</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>EQUIPMENT: 3 ACTIVE</div>
                <div>COMPONENTS: 10 TRACKED</div>
                <div>PACKAGES: 5 TOTAL</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              SCM CONTROL / <span className="text-orange-500">{getSectionTitle()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">
              LAST UPDATE: {currentDate} {currentTime} UTC
            </div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "overview" && <DashboardOverview />}
          {activeSection === "tree" && <SoftwareTreePage />}
          {activeSection === "history" && <ComponentHistoryPage />}
          {activeSection === "change-requests" && <ChangeRequestsPage />}
          {activeSection === "packages" && <SoftwarePackagesPage />}
        </div>
      </div>
    </div>
  )
}
