import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  FileText,
  Gauge,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createJob } from "../api/jobs";

const CreateJob = () => {
  const navigate = useNavigate();

  const [objective, setObjective] =
    useState("");

  const [priority, setPriority] =
    useState("normal");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanObjective =
      objective.trim();

    if (!cleanObjective) {
      toast.error(
        "Please describe what Hermes should accomplish"
      );
      return;
    }

    if (cleanObjective.length < 10) {
      toast.error(
        "Please provide a more detailed objective"
      );
      return;
    }

    setLoading(true);

    try {
      const job = await createJob({
        objective: cleanObjective,
        priority,
      });

      const jobId =
        job?._id || job?.id;

      toast.success(
        "Hermes job created successfully"
      );

      if (jobId) {
        navigate(`/jobs/${jobId}`);
      } else {
        navigate("/jobs");
      }
    } catch (error) {
      console.error(
        "Create job failed:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page create-job-page">

      <Link
        to="/jobs"
        className="back-link"
      >
        <ArrowLeft size={15} />

        Back to jobs
      </Link>

      <div className="create-job-header">
        <span className="page-kicker">
          NEW CONTENT OPERATION
        </span>

        <h1>Create a job</h1>

        <p>
          Give Hermes a clear objective. The
          workflow engine will manage the execution
          stages from there.
        </p>
      </div>

      <form
        className="create-job-layout"
        onSubmit={handleSubmit}
      >

        <div className="create-job-main">

          <div className="form-card">

            <div className="form-card-header">
              <div className="form-card-icon">
                <FileText size={19} />
              </div>

              <div>
                <h2>Job objective</h2>

                <p>
                  Describe the outcome you want
                  Hermes to produce.
                </p>
              </div>
            </div>

            <div className="form-group">

              <label htmlFor="objective">
                Objective
              </label>

              <textarea
                id="objective"
                value={objective}
                onChange={(event) =>
                  setObjective(
                    event.target.value
                  )
                }
                placeholder="Example: Find today's most important AI trends and create a YouTube video explaining the most relevant opportunity."
                rows={8}
                maxLength={5000}
                disabled={loading}
              />

              <div className="field-helper">
                <span>
                  Be specific about the desired
                  outcome.
                </span>

                <span>
                  {objective.length}/5000
                </span>
              </div>

            </div>

          </div>

          <div className="form-card">

            <div className="form-card-header">
              <div className="form-card-icon">
                <Gauge size={19} />
              </div>

              <div>
                <h2>Execution priority</h2>

                <p>
                  Set how urgently Hermes should
                  process this job.
                </p>
              </div>
            </div>

            <div className="priority-options">

              <label
                className={`priority-option ${
                  priority === "low"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={priority === "low"}
                  onChange={(event) =>
                    setPriority(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

                <span>
                  <strong>Low</strong>

                  <small>
                    Process when capacity is
                    available.
                  </small>
                </span>
              </label>

              <label
                className={`priority-option ${
                  priority === "normal"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="normal"
                  checked={
                    priority === "normal"
                  }
                  onChange={(event) =>
                    setPriority(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

                <span>
                  <strong>Normal</strong>

                  <small>
                    Standard Hermes processing.
                  </small>
                </span>
              </label>

              <label
                className={`priority-option ${
                  priority === "high"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={priority === "high"}
                  onChange={(event) =>
                    setPriority(
                      event.target.value
                    )
                  }
                  disabled={loading}
                />

                <span>
                  <strong>High</strong>

                  <small>
                    Prioritize this operation.
                  </small>
                </span>
              </label>

            </div>

          </div>

          <div className="create-job-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/jobs")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create job"}

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>

          </div>

        </div>

        <aside className="create-job-sidebar">

          <div className="info-card">

            <CircleHelp size={18} />

            <div>
              <h3>
                How Hermes works
              </h3>

              <p>
                  After creation, open the job and
                  start its workflow. Hermes runs
                  research, planning, production and
                  quality checks before requesting
                  human approval.
              </p>
            </div>

          </div>

          <div className="workflow-preview">

            <span className="section-kicker">
              WORKFLOW
            </span>

            <div>
              <span>Discover</span>
              <span>Research</span>
              <span>Plan</span>
              <span>Create</span>
              <span>QA</span>
              <span>Approve</span>
              <span>Publish</span>
              <span>Learn</span>
            </div>

          </div>

        </aside>

      </form>

    </div>
  );
};

export default CreateJob;
