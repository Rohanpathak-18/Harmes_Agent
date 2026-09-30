import api from "./client";

export const createAnalytics = async (jobId, data = {}) => {
  const response = await api.post(
    `/job-insights/jobs/${jobId}`,
    data
  );

  return response.data;
};

export const getAnalytics = async (jobId) => {
  const response = await api.get(
    `/job-insights/jobs/${jobId}`
  );

  return response.data;
};
