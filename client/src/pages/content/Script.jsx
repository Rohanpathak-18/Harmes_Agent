import { useEffect, useState } from "react";
import { ArrowRight, FileText, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getJobs } from "../../api/jobs";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Loading from "../../components/ui/Loading";

export default function Script() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try { setJobs(await getJobs()); }
    catch (error) { toast.error(error.response?.data?.message || "Could not load scripts"); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { load(); }, []);
  if (loading) return <Loading />;
  const rows = jobs.filter((job) => ["SCRIPTING", "PRODUCTION", "FINAL_QA", "WAITING_APPROVAL", "APPROVED", "SCHEDULED", "PUBLISHED", "ANALYZING", "LEARNED"].includes(job.status));
  return <div className="page-shell">
    <div className="page-header"><div><div className="eyebrow">CONTENT DEVELOPMENT</div><h1>Scripts</h1><p>Review and track jobs that have reached script creation or a later stage.</p></div><Button variant="secondary" onClick={() => load(true)} disabled={refreshing}><RefreshCw size={16} /> Refresh</Button></div>
    <Card className="learning-overview"><div className="learning-overview-icon"><FileText size={22} /></div><div><h2>Scripts live with their job</h2><p>Open a job to follow its script and production progress. Hermes creates these outputs as part of the workflow.</p></div></Card>
    <div className="page-section"><div className="section-heading"><div><h2>Scripted jobs</h2><p>{rows.length} {rows.length === 1 ? "job" : "jobs"} at or beyond scripting</p></div></div>
      {rows.length ? <div className="jobs-grid">{rows.map((job) => <Card key={job._id} className="stage-card"><div className="stage-card-heading"><Badge>{job.status.replaceAll("_", " ")}</Badge><span>{job.priority || "normal"} priority</span></div><h3>{job.objective}</h3><Link className="stage-card-link" to={`/jobs/${job._id}`}>Open job <ArrowRight size={15} /></Link></Card>)}</div> : <EmptyState title="No scripts yet" description="Jobs appear here when the workflow reaches script creation." action={<Link className="hermes-button hermes-button-primary hermes-button-medium" to="/jobs">Browse jobs</Link>} />}
    </div>
  </div>;
}
