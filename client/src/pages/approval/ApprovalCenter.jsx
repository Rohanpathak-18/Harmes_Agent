import { useEffect, useState } from "react";
import { Check, X, ShieldCheck, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";

import { getJobs } from "../../api/jobs";
import {
  getApproval,
  createApproval,
  approveJob,
  rejectJob,
} from "../../api/approval";

const ApprovalCenter = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [approvals, setApprovals] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await getJobs();

      const list =
        response?.jobs ||
        response?.data?.jobs ||
        response?.data ||
        response ||
        [];

      const normalizedJobs = Array.isArray(list)
        ? list
        : [];

      setJobs(normalizedJobs);

      const approvalEntries = await Promise.all(
        normalizedJobs.map(async (job) => {
          try {
            const result = await getApproval(job._id);

            return [
              job._id,
              result?.approval ||
                result?.data?.approval ||
                result?.data ||
                result,
            ];
          } catch {
            return [job._id, null];
          }
        })
      );

      setApprovals(
        Object.fromEntries(approvalEntries)
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load approval center"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateApproval = async (jobId) => {
    try {
      setProcessing(jobId);

      await createApproval(jobId);

      toast.success("Approval request created");

      await loadData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not create approval request"
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      setProcessing(jobId);

      await approveJob(jobId);

      toast.success("Job approved successfully");

      await loadData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not approve job"
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (jobId) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (reason === null) {
      return;
    }

    try {
      setProcessing(jobId);

      await rejectJob(jobId, reason);

      toast.success("Job rejected");

      await loadData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not reject job"
      );
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const approvalJobs = jobs.filter((job) =>
    [
      "FINAL_QA",
      "WAITING_APPROVAL",
      "APPROVED",
      "SCHEDULED",
      "PUBLISHED",
      "ANALYZING",
      "LEARNED",
    ].includes(job.status)
  );

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            GOVERNANCE
          </div>

          <h1>Approval center</h1>

          <p>
            Review content before Hermes allows it
            to enter the publishing pipeline.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={loadData}
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      {approvalJobs.length === 0 ? (
        <EmptyState
          title="No approval items"
          description="Jobs reaching the approval stage will appear here."
        />
      ) : (
        <div className="approval-list">
          {approvalJobs.map((job) => {
            const approval = approvals[job._id];

            const approvalStatus =
              approval?.status ||
              approval?.approvalStatus ||
              "not_requested";

            const isApproved =
              approvalStatus === "approved" ||
              job.status === "APPROVED";

            const isRejected =
              approvalStatus === "rejected";

            const isWaiting = Boolean(approval) && (
              approvalStatus === "pending" ||
              approvalStatus === "waiting" ||
              job.status === "WAITING_APPROVAL"
            );

            return (
              <Card
                key={job._id}
                className="approval-card"
              >
                <div className="approval-card-main">
                  <div className="approval-card-icon">
                    <ShieldCheck size={20} />
                  </div>

                  <div className="approval-card-content">
                    <div className="approval-card-top">
                      <h3>
                        {job.title ||
                          job.objective ||
                          job.name ||
                          "Untitled job"}
                      </h3>

                      <Badge>
                        {job.status || "UNKNOWN"}
                      </Badge>
                    </div>

                    <p>
                      {job.objective ||
                        "No objective provided."}
                    </p>

                    <div className="approval-meta">
                      <span>
                        Approval:{" "}
                        {approvalStatus.replace(
                          "_",
                          " "
                        )}
                      </span>

                      {job.createdAt && (
                        <span>
                          Created{" "}
                          {new Date(
                            job.createdAt
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="approval-actions">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(`/jobs/${job._id}`)
                    }
                  >
                    View
                  </Button>

                  {!approval && !isApproved && (
                    <Button
                      onClick={() =>
                        handleCreateApproval(
                          job._id
                        )
                      }
                      disabled={
                        processing === job._id
                      }
                    >
                      Request approval
                    </Button>
                  )}

                  {isWaiting && (
                    <>
                      <Button
                        onClick={() =>
                          handleApprove(
                            job._id
                          )
                        }
                        disabled={
                          processing === job._id
                        }
                      >
                        <Check size={16} />
                        Approve
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() =>
                          handleReject(
                            job._id
                          )
                        }
                        disabled={
                          processing === job._id
                        }
                      >
                        <X size={16} />
                        Reject
                      </Button>
                    </>
                  )}

                  {isApproved && (
                    <Badge variant="success">
                      Approved
                    </Badge>
                  )}

                  {isRejected && (
                    <Badge variant="danger">
                      Rejected
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApprovalCenter;
