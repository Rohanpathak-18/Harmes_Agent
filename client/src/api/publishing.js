import api from "./client";

export const queuePublication = async (jobId) => {
  const response = await api.post(
    `/publications/jobs/${jobId}/queue`
  );

  return response.data;
};

export const getPublication = async (jobId) => {
  const response = await api.get(
    `/publications/jobs/${jobId}`
  );

  return response.data;
};
