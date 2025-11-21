import api from "./apiService";

export const login = async (data) => {
  return api.post("/auth/login", data);
};

export const register = async (data) => {
  return api.post("/auth/register", data);
};

export const doctorProfile = async () => {
  return api.get("/doctor/profile");
};

export const updateDoctorProfile = async (data) => {
  return api.put("/doctor/updateprofile", data);
};

export const doctorFeedback = async (data) => {
  return api.post("/feedback/addfeedback", data);
};

export const getConsultationLocations = async (filters) => {
  return api.get("/doctor/consultations", { params: filters });
};

export const updateConsultationLocation = async (id, data) => {
  return api.put(`/doctor/updateconsultations/${id}`, data);
};

export const togglePublishLocation = async (data) => {
  // expects: { locationId: number, publish: boolean }
  return api.put("/doctor/publish-location", data);
};
export const addConsultationLocation = async (data) => {
  return api.post("/doctor/addconsultations", data);
};

export const deleteConsultationLocation = async (locationId) => {
  return api.delete(`/doctor/deleteconsultations/${locationId}`);
};
