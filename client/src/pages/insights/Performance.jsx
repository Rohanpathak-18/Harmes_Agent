import { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  RefreshCw,
  MousePointerClick,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";

import { getJobs } from "../../api/jobs";
import { getAnalytics } from "../../api/performance";

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

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


      const analyticsResults =
        await Promise.all(
          normalizedJobs.map(async (job) => {
            try {
              const result =
                await getAnalytics(job._id);

              const data =
                result?.analytics ||
                result?.data?.analytics ||
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

      setAnalytics(
        analyticsResults.flat()
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const totalViews = analytics.reduce(
    (sum, item) =>
      sum + Number(item.views || 0),
    0
  );

  const totalLikes = analytics.reduce(
    (sum, item) =>
      sum + Number(item.likes || 0),
    0
  );

  const totalComments = analytics.reduce(
    (sum, item) =>
      sum + Number(item.comments || 0),
    0
  );

  const averageRetention =
    analytics.length > 0
      ? analytics.reduce(
          (sum, item) =>
            sum +
            Number(item.retention || 0),
          0
        ) / analytics.length
      : 0;

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            PERFORMANCE
          </div>

          <h1>Analytics</h1>

          <p>
            Monitor how published content is
            performing.
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

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">
            <Eye size={18} />
          </div>

          <div className="stat-label">
            Total views
          </div>

          <div className="stat-value">
            {totalViews.toLocaleString()}
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <Heart size={18} />
          </div>

          <div className="stat-label">
            Total likes
          </div>

          <div className="stat-value">
            {totalLikes.toLocaleString()}
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <MessageCircle size={18} />
          </div>

          <div className="stat-label">
            Comments
          </div>

          <div className="stat-value">
            {totalComments.toLocaleString()}
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">
            <MousePointerClick size={18} />
          </div>

          <div className="stat-label">
            Avg. retention
          </div>

          <div className="stat-value">
            {averageRetention.toFixed(1)}%
          </div>
        </Card>
      </div>

      <Card className="analytics-panel">
        <div className="section-heading">
          <div>
            <h2>Content performance</h2>
            <p>
              Analytics snapshots collected by
              Hermes.
            </p>
          </div>

          <BarChart3 size={20} />
        </div>

        {analytics.length === 0 ? (
          <EmptyState
            title="No analytics yet"
            description="Analytics will appear after content enters the publication pipeline."
          />
        ) : (
          <div className="analytics-table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Retention</th>
                  <th>CTR</th>
                </tr>
              </thead>

              <tbody>
                {analytics.map(
                  (item, index) => (
                    <tr
                      key={
                        item._id ||
                        `${item.job}-${index}`
                      }
                    >
                      <td>
                        <strong>
                          {item.jobTitle}
                        </strong>
                      </td>

                      <td>
                        {Number(
                          item.views || 0
                        ).toLocaleString()}
                      </td>

                      <td>
                        {Number(
                          item.likes || 0
                        ).toLocaleString()}
                      </td>

                      <td>
                        {Number(
                          item.comments || 0
                        ).toLocaleString()}
                      </td>

                      <td>
                        {Number(
                          item.retention || 0
                        ).toFixed(1)}
                        %
                      </td>

                      <td>
                        {Number(
                          item.ctr || 0
                        ).toFixed(1)}
                        %
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
