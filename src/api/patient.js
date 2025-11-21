import api from "./apiService";

export const getPatients = async (filters) => {
  return api.post("/patients/all", filters);
};

export const getSinglePatient = async (data) => {
  return api.post("/patients/singlepatient", data);
};

export const addPatient = async (data) => {
  return api.post("/patients/addpatient", data);
};

export const updatePatient = async (data) => {
  return api.put("/patients/updatepatient", data);
};
