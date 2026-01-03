const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const res = await fetch(`${API_ROOT}${path}`, { ...options, headers });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function signup(name, email, password){
  return request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

export async function getTrips(){
  return request('/trips');
}

export async function createTrip(payload){
  return request('/trips', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getActivities(){
  return request('/activities');
}

export async function getTrip(id){
  return request(`/trips/${id}`);
}

export async function createStop(payload){
  return request('/stops', { method: 'POST', body: JSON.stringify(payload) });
}

export async function addActivityToStop(payload){
  return request('/trip-activities', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getActivitiesByStop(stopId){
  return request(`/trip-activities/by-stop/${stopId}`);
}

export async function setTripPublic(tripId, isPublic){
  return request(`/trips/${tripId}`, { method: 'PATCH', body: JSON.stringify({ is_public: isPublic }) });
}

export async function getPublicTrip(tripId){
  return request(`/public/trips/${tripId}`);
}

export default { login, signup, getTrips, createTrip, getActivities };
