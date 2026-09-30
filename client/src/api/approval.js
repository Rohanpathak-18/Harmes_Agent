import api from "./client";

export const createApproval = async (jobId) => {
  const response = await api.post(`/approval/jobs/${jobId}`);
  return response.data;
};

export const getApproval = async (jobId) => {
  const response = await api.get(`/approval/jobs/${jobId}`);
  return response.data;
};

export const approveJob = async (jobId) => {
  const response = await api.post(`/approval/jobs/${jobId}/approve`);
  return response.data;
};

export const rejectJob = async (jobId, reason = "") => {
  const response = await api.post(`/approval/jobs/${jobId}/reject`, {
    comment: reason,
  });

  return response.data;
};
