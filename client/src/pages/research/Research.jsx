import { useEffect, useState } from "react";
import { ArrowRight, FlaskConical, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getJobs } from "../../api/jobs";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Loading from "../../components/ui/Loading";

export default function Research() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try { setJobs(await getJobs()); }
    catch (error) { toast.error(error.response?.data?.message || "Could not load research jobs"); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { load(); }, []);
  if (loading) return <Loading />;
  const rows = jobs.filter((job) => ["DISCOVERED", "RESEARCHING", "RESEARCH_READY"].includes(job.status));
  return <div className="page-shell">
    <div className="page-header"><div><div className="eyebrow">DISCOVERY & EVIDENCE</div><h1>Research</h1><p>Track jobs moving through the research stage. Start a workflow from a discovered job to begin research.</p></div><Button variant="secondary" onClick={() => load(true)} disabled={refreshing}><RefreshCw size={16} /> Refresh</Button></div>
    <Card className="learning-overview"><div className="learning-overview-icon"><FlaskConical size={22} /></div><div><h2>Research is part of each job workflow</h2><p>Hermes advances each job from discovery into research, then stores its research output with the job. Open a job to run or monitor that workflow.</p></div></Card>
    <div className="page-section"><div className="section-heading"><div><h2>Research-stage jobs</h2><p>{rows.length} {rows.length === 1 ? "job" : "jobs"} in this stage</p></div></div>
      {rows.length ? <div className="jobs-grid">{rows.map((job) => <Card key={job._id} className="stage-card"><div className="stage-card-heading"><Badge>{job.status.replaceAll("_", " ")}</Badge><span>{job.priority || "normal"} priority</span></div><h3>{job.objective}</h3><Link className="stage-card-link" to={`/jobs/${job._id}`}>Open job <ArrowRight size={15} /></Link></Card>)}</div> : <EmptyState title="No research-stage jobs" description="Create a job or check the jobs list to find work in the research stage." action={<Link className="hermes-button hermes-button-primary hermes-button-medium" to="/jobs/new">Create a job</Link>} />}
    </div>
  </div>;
}
