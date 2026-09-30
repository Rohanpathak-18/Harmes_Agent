import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import JobCard from "../jobs/JobCard";

const RecentJobs = ({ jobs = [] }) => {
  const navigate = useNavigate();

  const recentJobs = jobs.slice(0, 5);

  return (
    <section className="dashboard-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            WORK QUEUE
          </span>

          <h2>Recent jobs</h2>
        </div>

        <button
          type="button"
          className="text-button"
          onClick={() => navigate("/jobs")}
        >
          View all
          <ArrowRight size={15} />
        </button>
      </div>

      {recentJobs.length === 0 ? (
        <div className="dashboard-empty">
          <p>No jobs created yet.</p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/jobs/new")}
          >
            Create your first job
          </button>
        </div>
      ) : (
        <div className="job-list">
          {recentJobs.map((job) => (
            <JobCard
              key={job._id || job.id}
              job={job}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentJobs;