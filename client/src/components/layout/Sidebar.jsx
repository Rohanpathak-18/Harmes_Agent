import React from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Plus,
  FlaskConical,
  FileText,
  Clapperboard,
  ShieldCheck,
  Send,
  BarChart3,
  BrainCircuit,
  Settings,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Jobs",
    path: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Create",
    path: "/jobs/new",
    icon: Plus,
  },
  {
    label: "Research",
    path: "/research",
    icon: FlaskConical,
  },
  {
    label: "Content",
    path: "/content",
    icon: FileText,
  },
  {
    label: "Production",
    path: "/production",
    icon: Clapperboard,
  },
  {
    label: "Approval",
    path: "/approval",
    icon: ShieldCheck,
  },
  {
    label: "Publishing",
    path: "/publishing",
    icon: Send,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Learning",
    path: "/learning",
    icon: BrainCircuit,
  },
];

const Sidebar = ({
  open,
  onClose,
}) => {
  return (
    <>
      {open && (
        <button
          className="mobile-sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`sidebar ${
          open ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-mark">
            H
          </div>

          <div className="brand-copy">
            <div className="brand-name">
              HERMES
            </div>

            <div className="brand-subtitle">
              Content OS
            </div>
          </div>

          <button
            className="mobile-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-section-label">
          Workspace
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "sidebar-link",
                    isActive
                      ? "active"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              [
                "sidebar-link",
                isActive
                  ? "active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            <Settings
              size={18}
              strokeWidth={1.8}
            />

            <span>Settings</span>
          </NavLink>

          <div className="sidebar-footer">
            <span>HERMES</span>
            <span>v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;