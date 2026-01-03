const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  
  const url = `${API_ROOT}${path}`;
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  
  try {
    const res = await fetch(url, { 
      ...options, 
      headers,
      mode: 'cors',
      credentials: 'omit'
    });
    
    const text = await res.text();
    console.log(`API Response: ${res.status} ${res.statusText}`);
    
    // Handle non-JSON responses
    if (!res.ok) {
      try {
        const error = JSON.parse(text);
        throw { error: error.error || 'Request failed', status: res.status };
      } catch {
        throw { error: text || `HTTP ${res.status}`, status: res.status };
      }
    }
    
    try { 
      return JSON.parse(text); 
    } catch { 
      return text; 
    }
  } catch (err) {
    // Network errors or parsing errors
    console.error('API Request Error:', err);
    
    // Provide more specific error messages
    if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('Failed to fetch'))) {
      throw { 
        error: `Cannot connect to backend server. Please ensure the backend is running on ${API_ROOT.replace('/api', '')}. Start it with: cd backend && npm start`, 
        status: 0,
        details: 'Backend server may not be running or is unreachable'
      };
    }
    
    if (err.error) throw err;
    throw { 
      error: err.message || 'Network error. Please check if the backend server is running.', 
      status: 0,
      details: err.message
    };
  }
}

export async function login(email, password) {
  try {
    return await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  } catch (err) {
    throw err;
  }
}

export async function signup(name, email, password){
  try {
    return await request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  } catch (err) {
    throw err;
  }
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
