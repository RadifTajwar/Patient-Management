import api from "./apiService";

export const login = async (data) => {

    return api.post('/auth/login', data);
};


export const register = async (data) => {

    return api.post('/auth/register', data);
};

export const doctorProfile = async () => {

    return api.get('/doctor/profile');
};

export const updateDoctorProfile = async(data) => {

    return api.put('/doctor/updateprofile', data);
};

export const doctorFeedback = async (data) => {

    return api.post('/feedback/addfeedback', data);
};