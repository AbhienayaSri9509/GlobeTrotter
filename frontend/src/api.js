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

export async function updateTrip(tripId, payload){
  return request(`/trips/${tripId}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deleteTrip(tripId){
  return request(`/trips/${tripId}`, { method: 'DELETE' });
}

export async function getStopsByTrip(tripId){
  return request(`/stops/by-trip/${tripId}`);
}

export async function updateStop(stopId, payload){
  return request(`/stops/${stopId}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deleteStop(stopId){
  return request(`/stops/${stopId}`, { method: 'DELETE' });
}

export async function deleteTripActivity(tripActivityId){
  return request(`/trip-activities/${tripActivityId}`, { method: 'DELETE' });
}

export async function searchCities(query, country){
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (country) params.append('country', country);
  return request(`/cities/search?${params.toString()}`);
}

export async function getCities(){
  return request('/cities');
}

export async function getCountries(){
  return request('/cities/countries');
}

export async function searchActivities(query, city, category, maxCost){
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (city) params.append('city', city);
  if (category) params.append('category', category);
  if (maxCost) params.append('max_cost', maxCost);
  return request(`/activities/search?${params.toString()}`);
}

export async function getBudget(tripId){
  return request(`/budget/trip/${tripId}`);
}

export async function updateStopCosts(stopId, payload){
  return request(`/budget/stop/${stopId}`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function getProfile(){
  return request('/users/me');
}

export async function updateProfile(payload){
  return request('/users/me', { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deleteAccount(){
  return request('/users/me', { method: 'DELETE' });
}

export async function getAdminAnalytics(){
  return request('/admin/analytics');
}

export async function getAdminUsers(){
  return request('/admin/users');
}

export default { login, signup, getTrips, createTrip, getActivities };
