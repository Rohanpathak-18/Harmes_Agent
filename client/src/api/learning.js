import api from "./client";

export const generateLearning = async (jobId) => {
  const response = await api.post(
    `/learning/jobs/${jobId}/generate`
  );

  return response.data;
};

export const getLearning = async (jobId) => {
  const response = await api.get(
    `/learning/jobs/${jobId}`
  );

  return response.data;
};