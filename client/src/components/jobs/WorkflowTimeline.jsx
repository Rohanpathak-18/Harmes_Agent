import {
  Check,
  Circle,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

const WORKFLOW_STATES = [
  "DISCOVERED",
  "RESEARCHING",
  "RESEARCH_READY",
  "SCRIPTING",
  "PRODUCTION",
  "FINAL_QA",
  "WAITING_APPROVAL",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
  "ANALYZING",
  "LEARNED",
];

const LABELS = {
  DISCOVERED: "Discovered",
  RESEARCHING: "Researching",
  RESEARCH_READY: "Research ready",
  SCRIPTING: "Scripting",
  PRODUCTION: "Production",
  FINAL_QA: "Final QA",
  WAITING_APPROVAL: "Waiting approval",
  APPROVED: "Approved",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ANALYZING: "Analyzing",
  LEARNED: "Learned",
};

const WorkflowTimeline = ({ currentStatus }) => {
  const currentIndex =
    WORKFLOW_STATES.indexOf(currentStatus);

  return (
    <div className="workflow-timeline">
      {WORKFLOW_STATES.map((state, index) => {
        const isCompleted =
          currentIndex >= 0 && index < currentIndex;

        const isCurrent =
          state === currentStatus;

        return (
          <div
            className={`workflow-step ${
              isCompleted
                ? "workflow-completed"
                : ""
            } ${
              isCurrent
                ? "workflow-current"
                : ""
            }`}
            key={state}
          >
            <div className="workflow-marker">
              {isCompleted ? (
                <Check size={14} />
              ) : isCurrent ? (
                <LoaderCircle
                  size={14}
                  className="status-spin"
                />
              ) : state === "WAITING_APPROVAL" ? (
                <LockKeyhole size={13} />
              ) : (
                <Circle size={10} />
              )}
            </div>

            <div className="workflow-step-content">
              <span>
                {LABELS[state]}
              </span>

              {isCurrent && (
                <small>Current stage</small>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowTimeline;