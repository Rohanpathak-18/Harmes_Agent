import { useEffect, useState } from "react";
import {
  BrainCircuit,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";

import { getJobs } from "../../api/jobs";
import {
  getLearning,
  generateLearning,
} from "../../api/learning";

const Learning = () => {
  const [jobs, setJobs] = useState([]);
  const [learning, setLearning] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const jobsResponse = await getJobs();

      const jobsList =
        jobsResponse?.jobs ||
        jobsResponse?.data?.jobs ||
        jobsResponse?.data ||
        jobsResponse ||
        [];

      const normalizedJobs = Array.isArray(
        jobsList
      )
        ? jobsList
        : [];

      setJobs(normalizedJobs);

      const learningResults =
        await Promise.all(
          normalizedJobs.map(async (job) => {
            try {
              const result =
                await getLearning(job._id);

              const data =
                result?.learning ||
                result?.data?.learning ||
                result?.data ||
                result;

              if (Array.isArray(data)) {
                return data.map((item) => ({
                  ...item,
                  jobTitle:
                    job.title ||
                    job.objective ||
                    job.name ||
                    "Untitled job",
                }));
              }

              return data
                ? [
                    {
                      ...data,
                      jobTitle:
                        job.title ||
                        job.objective ||
                        job.name ||
                        "Untitled job",
                    },
                  ]
                : [];
            } catch {
              return [];
            }
          })
        );

      setLearning(
        learningResults.flat()
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load learning data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async (jobId) => {
    try {
      setGenerating(jobId);

      await generateLearning(jobId);

      toast.success(
        "Learning insight generated"
      );

      await loadData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not generate learning"
      );
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const eligibleJobs = jobs.filter((job) =>
    [
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
            CONTINUOUS IMPROVEMENT
          </div>

          <h1>Learning</h1>

          <p>
            Turn performance data into reusable
            content insights.
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

      <Card className="learning-overview">
        <div className="learning-overview-icon">
          <BrainCircuit size={24} />
        </div>

        <div>
          <h2>
            Hermes learning loop
          </h2>

          <p>
            Published content produces analytics.
            Hermes converts those results into
            insights and recommendations that can
            inform future content decisions.
          </p>
        </div>
      </Card>

      <div className="page-section">
        <div className="section-heading">
          <div>
            <h2>Insights</h2>

            <p>
              Generated from available performance
              data.
            </p>
          </div>
        </div>

        {learning.length === 0 ? (
          <EmptyState
            title="No learning insights yet"
            description="Generate learning after a job has entered the analysis stage."
          />
        ) : (
          <div className="learning-grid">
            {learning.map((item, index) => (
              <Card
                key={
                  item._id ||
                  `${item.job}-${index}`
                }
                className="learning-card"
              >
                <div className="learning-card-top">
                  <div className="learning-card-icon">
                    <Sparkles size={17} />
                  </div>

                  <Badge>
                    {item.type ||
                      "performance"}
                  </Badge>
                </div>

                <h3>
                  {item.jobTitle ||
                    "Content insight"}
                </h3>

                <div className="learning-block">
                  <span>Insight</span>

                  <p>
                    {item.insight ||
                      "No insight available."}
                  </p>
                </div>

                {item.recommendation && (
                  <div className="learning-block">
                    <span>
                      Recommendation
                    </span>

                    <p>
                      {item.recommendation}
                    </p>
                  </div>
                )}

                {typeof item.confidence ===
                  "number" && (
                  <div className="learning-confidence">
                    Confidence:{" "}
                    {(
                      item.confidence * 100
                    ).toFixed(0)}
                    %
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {eligibleJobs.length > 0 && (
        <Card className="learning-generation-panel">
          <div>
            <h2>
              Generate new insights
            </h2>

            <p>
              Generate a learning record from
              the latest analytics snapshot.
            </p>
          </div>

          <div className="learning-job-actions">
            {eligibleJobs.map((job) => (
              <Button
                key={job._id}
                variant="secondary"
                disabled={
                  generating === job._id
                }
                onClick={() =>
                  handleGenerate(
                    job._id
                  )
                }
              >
                <Sparkles size={15} />

                {generating === job._id
                  ? "Generating..."
                  : `Analyze ${
                      job.title ||
                      job.objective ||
                      job.name ||
                      "job"
                    }`}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Learning;
