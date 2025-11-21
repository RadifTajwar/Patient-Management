import api from "./apiService";

export const getAppointments = async (filters) => {
  return api.post("/consultation/getappointments", filters);
};
export const getSingleAppointment = async (id) => {
  return api.get(`/consultation/singleappointment/${id}`);
};
export const createPatientAndUpdateAppointment = async (data) => {
  return await api.post(
    "/consultation/createPatientAndUpdateAppointment",
    data
  );
};
export const cancelAppointment = async (id) => {
  const data = {
    appointmentId: id,
  };
  return api.put("/consultation/cancelappointment", data);
};

export const allConsultations = async (id, patientId) => {
  const data = {
    consultationId: id,
    patientId: patientId,
  };
  return api.post("/consultation/all", data);
};

export const updateConsultation = async (data) => {
  return api.put("/consultation/update", data);
};

export const addSingleConsultation = async (data) => {
  return api.post("/consultation/addconsultation", data);
};

export const getSingleConsultation = async (id) => {
  return api.get(`/consultation/${id}`);
};

export const getNotes = async (data) => {
  return api.post("/consultation/getnotes", data);
};
export const getAllConsultationWithPatient = async (
  consultationId,
  patientId
) => {
  const data = {
    consultationId,
    patientId,
  };
  return api.post("/patients/allconsultations", data);
};
