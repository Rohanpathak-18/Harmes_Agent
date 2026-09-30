import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Play,
  RefreshCw,
  CalendarDays,
  Flag,
  Fingerprint,
  RotateCcw,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getJob,
  runJobWorkflow,
  retryJob,
} from "../api/jobs";

import JobStatus from "../components/jobs/JobStatus";
import WorkflowTimeline from "../components/jobs/WorkflowTimeline";
import Loading from "../components/ui/Loading";

const formatDate = (date) => {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return value.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [refreshing, setRefreshing] =
    useState(false);

  const loadJob = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getJob(jobId);

      setJob(data);
    } catch (error) {
      console.error(
        "Failed to load job:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load job"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const handleRunWorkflow = async () => {
    if (!jobId) return;

    setRunning(true);

    try {
      const result =
        await runJobWorkflow(jobId);

      if (result) {
        setJob((current) => ({
          ...(current || {}),
          ...result,
        }));
      }

      toast.success(
        "Hermes workflow started"
      );

      await loadJob(true);
    } catch (error) {
      console.error(
        "Workflow start failed:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to start workflow"
      );
    } finally {
      setRunning(false);
    }
  };

  const handleRetry = async () => {
    setRunning(true);
    try {
      await retryJob(jobId);
      toast.success("Job queued for retry");
      await loadJob(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to retry job");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <Loading />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate("/jobs")}
        >
          <ArrowLeft size={15} />
          Back to jobs
        </button>

        <div className="not-found-card">
          <h1>Job not found</h1>

          <p>
            Hermes could not find the requested
            job.
          </p>
        </div>
      </div>
    );
  }

  const currentStatus =
    job.status || "DISCOVERED";

  const canRun =
    currentStatus === "DISCOVERED";

  return (
    <div className="page job-details-page">

      <Link
        to="/jobs"
        className="back-link"
      >
        <ArrowLeft size={15} />

        Back to jobs
      </Link>

      <div className="job-details-header">

        <div className="job-details-title">

          <div className="job-details-status-row">
            <JobStatus
              status={currentStatus}
            />

            <span className="job-priority">
              {job.priority || "normal"} priority
            </span>
          </div>

          <h1>
            {job.objective ||
              "Untitled Hermes job"}
          </h1>

          <p>
            Job created{" "}
            {formatDate(job.createdAt)}
          </p>

        </div>

        <div className="page-header-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => loadJob(true)}
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

          {canRun && (
            <button
              type="button"
              className="primary-button"
              onClick={handleRunWorkflow}
              disabled={running}
            >
              <Play size={16} />

              {running
                ? "Starting..."
                : "Run workflow"}
            </button>
          )}

          {currentStatus === "FAILED" && (
            <button type="button" className="primary-button" onClick={handleRetry} disabled={running}>
              <RotateCcw size={16} />
              {running ? "Queueing..." : "Retry job"}
            </button>
          )}

        </div>

      </div>

      <div className="job-details-layout">

        <main className="job-details-main">

          <section className="detail-card">

            <div className="detail-card-header">
              <div>
                <span className="section-kicker">
                  OBJECTIVE
                </span>

                <h2>Job objective</h2>
              </div>
            </div>

            <div className="objective-box">
              {job.objective ||
                "No objective provided."}
            </div>

          </section>

          {job.status === "FAILED" && job.error?.message && (
            <section className="detail-card workflow-error">
              <span className="section-kicker">LAST ERROR</span>
              <p>{job.error.message}</p>
            </section>
          )}

          <section className="detail-card">

            <div className="detail-card-header">
              <div>
                <span className="section-kicker">
                  EXECUTION
                </span>

                <h2>Workflow</h2>
              </div>

              <JobStatus
                status={currentStatus}
              />
            </div>

            <WorkflowTimeline
              currentStatus={currentStatus}
            />

          </section>

        </main>

        <aside className="job-details-sidebar">

          <section className="detail-card">

            <div className="detail-card-header">
              <div>
                <span className="section-kicker">
                  JOB INFORMATION
                </span>

                <h2>Details</h2>
              </div>
            </div>

            <div className="metadata-list">

              <div className="metadata-row">
                <span>
                  <Fingerprint size={15} />
                  Job ID
                </span>

                <strong>
                  {job._id ||
                    job.id ||
                    "—"}
                </strong>
              </div>

              <div className="metadata-row">
                <span>
                  <Flag size={15} />
                  Priority
                </span>

                <strong>
                  {job.priority ||
                    "normal"}
                </strong>
              </div>

              <div className="metadata-row">
                <span>
                  <CalendarDays size={15} />
                  Created
                </span>

                <strong>
                  {formatDate(
                    job.createdAt
                  )}
                </strong>
              </div>

              {job.updatedAt && (
                <div className="metadata-row">
                  <span>
                    <RefreshCw size={15} />
                    Updated
                  </span>

                  <strong>
                    {formatDate(
                      job.updatedAt
                    )}
                  </strong>
                </div>
              )}

            </div>

          </section>

          <section className="detail-card workflow-note">

            <span className="section-kicker">
              HERMES CONTROL
            </span>

            <h3>
              Human approval remains mandatory.
            </h3>

            <p>
              Hermes can execute the content
              workflow, but publishing must pass
              through the approval stage.
            </p>

          </section>

        </aside>

      </div>

    </div>
  );
};

export default JobDetails;
