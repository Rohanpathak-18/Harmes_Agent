import api from "./client";

export const getJobs = async () => {
  const response = await api.get("/jobs");

  return (
    response.data?.jobs ||
    response.data?.data ||
    response.data ||
    []
  );
};

export const getJob = async (jobId) => {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response = await api.get(`/jobs/${jobId}`);

  return (
    response.data?.job ||
    response.data?.data ||
    response.data
  );
};

export const createJob = async ({ objective, priority = "normal" }) => {
  const response = await api.post("/jobs", {
    objective,
    priority,
  });

  return (
    response.data?.job ||
    response.data?.data ||
    response.data
  );
};

export const runJobWorkflow = async (jobId) => {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const response = await api.post(
    `/workflow/jobs/${jobId}/run`
  );

  return (
    response.data?.job ||
    response.data?.data ||
    response.data
  );
};

export const retryJob = async (jobId) => {
  const response = await api.post(`/retry/jobs/${jobId}/retry`);
  return response.data?.job || response.data;
};
