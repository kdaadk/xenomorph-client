import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const updateActivity = payload => api.post(`/activity`, payload);
export const insertActivities = payload => api.post(`/activities`, payload);
export const getActivities = () => api.get(`/activities`);
export const getLastActivity = () => api.get(`/lastActivity`);
export const deleteActivity = (id) => api.delete(`/activity/${id}`);

export const updateStream = payload => api.post(`/stream`, payload);
export const insertStreams = payload => api.post(`/streams`, payload);
export const getStream = (id) => api.get(`/stream/${id}`);

export const updateUser = payload => api.post(`/user`, payload);
export const getUser = (id) => api.get(`/user/${id}`);

const apis = {
    updateActivity,
    insertActivities,
    getActivities,
    getLastActivity,
    deleteActivity,

    updateStream,
    insertStreams,
    getStream,
    
    updateUser,
    getUser
};

export default apis