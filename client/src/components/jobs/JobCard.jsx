import { ArrowUpRight, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

import JobStatus from "./JobStatus";

const formatDate = (date) => {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  if (!job) {
    return null;
  }

  const jobId = job._id || job.id;

  return (
    <button
      type="button"
      className="job-card"
      onClick={() => navigate(`/jobs/${jobId}`)}
    >
      <div className="job-card-main">
        <div className="job-card-top">
          <JobStatus status={job.status} />

          <span className="job-priority">
            {job.priority || "normal"}
          </span>
        </div>

        <h3>
          {job.objective || "Untitled job"}
        </h3>

        <div className="job-card-meta">
          <span>
            <CalendarDays size={14} />

            {formatDate(
              job.createdAt || job.created_at
            )}
          </span>

          {jobId && (
            <span className="job-id">
              {String(jobId).slice(-8)}
            </span>
          )}
        </div>
      </div>

      <div className="job-card-arrow">
        <ArrowUpRight size={18} />
      </div>
    </button>
  );
};

export default JobCard;