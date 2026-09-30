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

export default function ContentPlan() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try { setJobs(await getJobs()); }
    catch (error) { toast.error(error.response?.data?.message || "Could not load content jobs"); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { load(); }, []);
  if (loading) return <Loading />;
  const rows = jobs.filter((job) => ["RESEARCH_READY", "SCRIPTING"].includes(job.status));
  return <div className="page-shell">
    <div className="page-header"><div><div className="eyebrow">CONTENT DEVELOPMENT</div><h1>Content plan</h1><p>Review jobs that have finished research and are moving into content planning and scripting.</p></div><Button variant="secondary" onClick={() => load(true)} disabled={refreshing}><RefreshCw size={16} /> Refresh</Button></div>
    <Card className="learning-overview"><div className="learning-overview-icon"><FileText size={22} /></div><div><h2>Plans are generated inside the workflow</h2><p>Use the job workflow to move research into a content plan and script. These job records reflect the server’s current workflow status.</p></div></Card>
    <div className="page-section"><div className="section-heading"><div><h2>Planning and scripting</h2><p>{rows.length} {rows.length === 1 ? "job" : "jobs"} in this stage</p></div></div>
      {rows.length ? <div className="jobs-grid">{rows.map((job) => <Card key={job._id} className="stage-card"><div className="stage-card-heading"><Badge>{job.status.replaceAll("_", " ")}</Badge><span>{job.priority || "normal"} priority</span></div><h3>{job.objective}</h3><Link className="stage-card-link" to={`/jobs/${job._id}`}>Open job <ArrowRight size={15} /></Link></Card>)}</div> : <EmptyState title="No content plans in progress" description="Jobs enter this view after reaching the research-ready stage." action={<Link className="hermes-button hermes-button-primary hermes-button-medium" to="/jobs">View jobs</Link>} />}
    </div>
  </div>;
}
