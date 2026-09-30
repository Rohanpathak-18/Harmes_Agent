import {
  Activity,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
} from "lucide-react";

const getIcon = (status) => {
  if (
    status === "PUBLISHED" ||
    status === "LEARNED"
  ) {
    return CheckCircle2;
  }

  if (
    status === "RESEARCHING" ||
    status === "SCRIPTING" ||
    status === "PRODUCTION"
  ) {
    return Search;
  }

  if (
    status === "WAITING_APPROVAL" ||
    status === "SCHEDULED"
  ) {
    return Clock3;
  }

  return FileText;
};

const ActivityFeed = ({ jobs = [] }) => {
  const activities = jobs.slice(0, 6);

  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            SYSTEM ACTIVITY
          </span>

          <h2>Recent activity</h2>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="dashboard-empty">
          <Activity size={20} />

          <p>
            Hermes activity will appear here.
          </p>
        </div>
      ) : (
        <div className="activity-list">
          {activities.map((job) => {
            const Icon = getIcon(job.status);

            return (
              <div
                className="activity-item"
                key={job._id || job.id}
              >
                <div className="activity-icon">
                  <Icon size={15} />
                </div>

                <div className="activity-content">
                  <strong>
                    {job.objective ||
                      "Job updated"}
                  </strong>

                  <span>
                    Hermes moved this job to{" "}
                    {job.status || "unknown"}.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ActivityFeed;