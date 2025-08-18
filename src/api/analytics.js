import api from "./apiService";

export const getCounts = async () => {

    return api.get('/analytics/counts');
};


export const getConsultationData = async (data) => {

    return api.post('/analytics/consultationpermonth', data);
};

export const getPatientData = async (data) => {

    return api.post('/analytics/patientpermonth', data);
};


export const getGenderDist = async () => {

    return api.get('/analytics/genderdist');
};