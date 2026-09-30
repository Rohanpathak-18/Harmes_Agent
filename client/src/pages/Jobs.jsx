import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getJobs } from "../api/jobs";

import JobCard from "../components/jobs/JobCard";
import Loading from "../components/ui/Loading";
import EmptyState from "../components/ui/EmptyState";

const Jobs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const loadJobs = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getJobs();

      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load jobs:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load jobs"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return jobs.filter((job) => {
      const objective =
        job.objective?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        objective.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const updateSearch = (value) => {
    setSearch(value);
    if (value.trim()) setSearchParams({ search: value.trim() }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  if (loading) {
    return (
      <div className="page-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <span className="page-kicker">
            CONTENT OPERATIONS
          </span>

          <h1>Jobs</h1>

          <p>
            Track every Hermes content operation
            from discovery to learning.
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

            New job
          </button>
        </div>
      </div>

      <div className="jobs-toolbar">

        <div className="search-field">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(event) =>
              updateSearch(event.target.value)
            }
          />
        </div>

        <div className="filter-field">
          <Filter size={16} />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              All statuses
            </option>

            <option value="DISCOVERED">
              Discovered
            </option>

            <option value="RESEARCHING">
              Researching
            </option>

            <option value="RESEARCH_READY">
              Research ready
            </option>

            <option value="SCRIPTING">
              Scripting
            </option>

            <option value="PRODUCTION">
              Production
            </option>

            <option value="FINAL_QA">
              Final QA
            </option>

            <option value="WAITING_APPROVAL">
              Waiting approval
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="SCHEDULED">
              Scheduled
            </option>

            <option value="PUBLISHED">
              Published
            </option>

            <option value="ANALYZING">
              Analyzing
            </option>

            <option value="LEARNED">
              Learned
            </option>

            <option value="FAILED">
              Failed
            </option>
          </select>
        </div>

      </div>

      <div className="jobs-summary">
        <span>
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1
            ? "job"
            : "jobs"}
        </span>
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState
          title={
            jobs.length === 0
              ? "No jobs yet"
              : "No matching jobs"
          }
          description={
            jobs.length === 0
              ? "Create your first Hermes job to start the content workflow."
              : "Try changing your search or status filter."
          }
          action={
            jobs.length === 0 ? (
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate("/jobs/new")
                }
              >
                <Plus size={17} />
                Create job
              </button>
            ) : null
          }
        />
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id || job.id}
              job={job}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Jobs;
