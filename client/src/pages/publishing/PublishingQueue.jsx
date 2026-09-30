import { useEffect, useState } from "react";
import {
  Send,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";

import { getJobs } from "../../api/jobs";
import {
  getPublication,
  queuePublication,
} from "../../api/publishing";

const PublishingQueue = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [publications, setPublications] = useState({});
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

      const publicationEntries =
        await Promise.all(
          normalizedJobs.map(async (job) => {
            try {
              const result =
                await getPublication(job._id);

              return [
                job._id,
                result?.publication ||
                  result?.data?.publication ||
                  result?.data ||
                  result,
              ];
            } catch {
              return [job._id, null];
            }
          })
        );

      setPublications(
        Object.fromEntries(
          publicationEntries
        )
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load publishing queue"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQueue = async (jobId) => {
    try {
      setProcessing(jobId);

      await queuePublication(jobId);

      toast.success(
        "Job added to publishing queue"
      );

      await loadData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not queue publication"
      );
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const publishingJobs = jobs.filter((job) =>
    [
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
            DISTRIBUTION
          </div>

          <h1>Publishing queue</h1>

          <p>
            Control which approved content enters
            the publishing pipeline.
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

      {publishingJobs.length === 0 ? (
        <EmptyState
          title="Nothing ready to publish"
          description="Approved jobs will appear here."
        />
      ) : (
        <div className="publishing-list">
          {publishingJobs.map((job) => {
            const publication =
              publications[job._id];

            const publicationStatus =
              publication?.status || "";

            const isScheduled =
              job.status === "SCHEDULED";

            const isPublished =
              job.status === "PUBLISHED" ||
              publicationStatus === "published";

            return (
              <Card
                key={job._id}
                className="publishing-card"
              >
                <div>
                  <div className="publishing-title-row">
                    <h3>
                      {job.title ||
                        job.objective ||
                        job.name ||
                        "Untitled job"}
                    </h3>

                    <Badge>
                      {job.status}
                    </Badge>
                  </div>

                  <p>
                    {job.objective ||
                      "No objective provided."}
                  </p>

                  {publication?.publishedAt && (
                    <div className="muted-text">
                      Published{" "}
                      {new Date(
                        publication.publishedAt
                      ).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="publishing-actions">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/jobs/${job._id}`
                      )
                    }
                  >
                    View
                  </Button>

                  {isPublished &&
                    publication?.url && (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-secondary"
                      >
                        <ExternalLink size={15} />
                        Open
                      </a>
                    )}

                  {!isPublished &&
                    !isScheduled && (
                      <Button
                        onClick={() =>
                          handleQueue(
                            job._id
                          )
                        }
                        disabled={
                          processing ===
                          job._id
                        }
                      >
                        <Send size={16} />
                        Queue
                      </Button>
                    )}

                  {isScheduled && (
                    <Badge variant="warning">
                      Scheduled
                    </Badge>
                  )}

                  {isPublished && (
                    <Badge variant="success">
                      Published
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

export default PublishingQueue;
