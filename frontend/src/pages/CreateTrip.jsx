import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateTrip(){
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError(null);
    try{
      const payload = { name, start_date: startDate, end_date: endDate, description };
      const res = await api.createTrip(payload);
      if (res && res.id) {
        navigate('/trips');
      } else {
        setError(res.error || 'Could not create trip');
      }
    }catch(err){ setError(err.message); }
  }

  return (
    <div>
      <h2>Create Trip</h2>
      <form onSubmit={handleSubmit} style={{maxWidth:520}}>
        <div>
          <label>Trip name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label>Start date</label>
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
        </div>
        <div>
          <label>End date</label>
          <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <button type="submit">Create</button>
        </div>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  );
}
