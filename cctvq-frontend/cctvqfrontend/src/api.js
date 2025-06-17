import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const fetchQuotations = () => API.get('/quotations');
export const createQuotation = (data) => API.post('/quotations', data);
export const updateQuotation = (id, data) => API.put(`/quotations/${id}`, data);
export const deleteQuotation = (id) => API.delete(`/quotations/${id}`);