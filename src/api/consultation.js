import api from "./apiService";

export const getAppointments = async (filters) => {

    return api.post('/consultation/getappointments', filters);
};

export const cancelAppointment = async (id) => {
    const data = {
        appointmentId : id,
    }
    return api.put('/consultation/cancelappointment', data);
};

export const allConsultations = async (id, patientId) => {
    const data = {
        consultationId : id,
        patientId : patientId
    }
    return api.post('/consultation/all', data);
};

export const updateConsultation = async (data) => {
    
    return api.put('/consultation/update', data);
};

export const addSingleConsultation = async (data) => {

    return api.post('/consultation/addconsultation', data);
}

export const getNotes = async (data) => {

    return api.post('/consultation/getnotes', data);
}