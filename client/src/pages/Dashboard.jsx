import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getJobs } from "../api/jobs";

import StatCard from "../components/dashboard/StatCard";
import RecentJobs from "../components/dashboard/RecentJobs";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import Loading from "../components/ui/Loading";

const Dashboard = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const loadJobs = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getJobs();

      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to load dashboard jobs:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const stats = useMemo(() => {
    const activeStatuses = [
      "DISCOVERED",
      "RESEARCHING",
      "RESEARCH_READY",
      "SCRIPTING",
      "PRODUCTION",
      "FINAL_QA",
      "ANALYZING",
    ];

    return {
      total: jobs.length,

      active: jobs.filter((job) =>
        activeStatuses.includes(job.status)
      ).length,

      approval: jobs.filter(
        (job) =>
          job.status === "WAITING_APPROVAL"
      ).length,

      completed: jobs.filter(
        (job) =>
          job.status === "PUBLISHED" ||
          job.status === "LEARNED"
      ).length,

      failed: jobs.filter(
        (job) => job.status === "FAILED"
      ).length,
    };
  }, [jobs]);

  if (loading) {
    return (
      <div className="page-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="page dashboard-page">

      <div className="page-header">
        <div>
          <span className="page-kicker">
            HERMES CONTROL CENTER
          </span>

          <h1>Dashboard</h1>

          <p>
            Monitor your content operations and
            workflow execution.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => loadJobs(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "status-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/jobs/new")}
          >
            <Plus size={17} />

            Create job
          </button>
        </div>
      </div>

      <div className="stats-grid">

        <StatCard
          label="Total jobs"
          value={stats.total}
          description="All content operations"
          icon={FolderKanban}
          onClick={() => navigate("/jobs")}
        />

        <StatCard
          label="Active"
          value={stats.active}
          description="Currently processing"
          icon={Clock3}
        />

        <StatCard
          label="Awaiting approval"
          value={stats.approval}
          description="Human review required"
          icon={AlertTriangle}
          onClick={() =>
            navigate("/approval")
          }
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          description="Published or learned"
          icon={CheckCircle2}
        />

      </div>

      {stats.failed > 0 && (
        <div className="dashboard-alert">
          <AlertTriangle size={18} />

          <div>
            <strong>
              {stats.failed} failed{" "}
              {stats.failed === 1
                ? "job"
                : "jobs"}
            </strong>

            <span>
              Review failed jobs before
              continuing the workflow.
            </span>
          </div>
        </div>
      )}

      <div className="dashboard-grid">

        <RecentJobs jobs={jobs} />

        <ActivityFeed jobs={jobs} />

      </div>

    </div>
  );
};

export default Dashboard;