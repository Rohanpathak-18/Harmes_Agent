import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  LoaderCircle,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  DISCOVERED: {
    label: "Discovered",
    className: "status-neutral",
    icon: Clock3,
  },

  RESEARCHING: {
    label: "Researching",
    className: "status-info",
    icon: LoaderCircle,
  },

  RESEARCH_READY: {
    label: "Research ready",
    className: "status-info",
    icon: CheckCircle2,
  },

  SCRIPTING: {
    label: "Scripting",
    className: "status-info",
    icon: LoaderCircle,
  },

  PRODUCTION: {
    label: "Production",
    className: "status-warning",
    icon: LoaderCircle,
  },

  FINAL_QA: {
    label: "Final QA",
    className: "status-warning",
    icon: CircleAlert,
  },

  WAITING_APPROVAL: {
    label: "Waiting approval",
    className: "status-warning",
    icon: Clock3,
  },

  APPROVED: {
    label: "Approved",
    className: "status-success",
    icon: CheckCircle2,
  },

  SCHEDULED: {
    label: "Scheduled",
    className: "status-info",
    icon: Clock3,
  },

  PUBLISHED: {
    label: "Published",
    className: "status-success",
    icon: CheckCircle2,
  },

  ANALYZING: {
    label: "Analyzing",
    className: "status-info",
    icon: LoaderCircle,
  },

  LEARNED: {
    label: "Learned",
    className: "status-success",
    icon: CheckCircle2,
  },

  FAILED: {
    label: "Failed",
    className: "status-danger",
    icon: XCircle,
  },
};

const formatFallbackStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const JobStatus = ({ status }) => {
  const config =
    STATUS_CONFIG[status] || {
      label: formatFallbackStatus(status),
      className: "status-neutral",
      icon: Clock3,
    };

  const Icon = config.icon;

  return (
    <span className={`job-status ${config.className}`}>
      <Icon
        size={13}
        className={
          status === "RESEARCHING" ||
          status === "SCRIPTING" ||
          status === "PRODUCTION" ||
          status === "ANALYZING"
            ? "status-spin"
            : ""
        }
      />

      {config.label}
    </span>
  );
};

export default JobStatus;