import api from "./apiService";

export const getDailyEvents = async (data) => {

    return api.post('/event/getdailyevent', data);
};


export const getRangeEvents = async (data) => {

    return api.post('/event/getrangeevent', data);
};

export const addEvent = async (data) => {

    return api.post('/event/addevent', data);
};


export const updateEvent = async (data) => {

    return api.put('/event/updateevent', data);
};


export const deleteEvent = async (data) => {

    return api.post('/event/deleteevent', data);
};