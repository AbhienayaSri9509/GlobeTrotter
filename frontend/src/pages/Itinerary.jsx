import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function Itinerary(){
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState(null);

  useEffect(()=>{
    fetchTrip();
    api.getActivities().then(res=>setActivities(Array.isArray(res)?res:[])).catch(()=>{});
  },[id]);

  async function fetchTrip(){
    setLoading(true);
    const res = await api.getTrip(id);
    setTrip(res);
    setLoading(false);
  }

  async function handleAddStop(e){
    e.preventDefault();
    await api.createStop({ trip_id: Number(id), city, start_date: startDate, end_date: endDate });
    setCity(''); setStartDate(''); setEndDate('');
    fetchTrip();
  }

  async function handleAddActivityToStop(stopId, activityId){
    await api.addActivityToStop({ stop_id: stopId, activity_id: activityId });
    fetchTrip();
  }

  async function toggleShare(){
    const newVal = trip.is_public ? 0 : 1;
    const res = await api.setTripPublic(id, newVal);
    setTrip(res);
  }

  if (loading) return <p>Loading itinerary...</p>;
  if (!trip) return <p>Trip not found.</p>;

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 style={{margin:0}}>{trip.name}</h2>
        <div>
          <button onClick={toggleShare} style={{marginRight:8}}>{trip.is_public? 'Unshare Trip' : 'Share Trip'}</button>
          {trip.is_public && <a href={`/public/${trip.id}`} target="_blank" rel="noreferrer">View Public</a>}
        </div>
      </div>
      <p>{trip.description}</p>

      <section style={{marginTop:16}}>
        <h3>Stops</h3>
        <form onSubmit={handleAddStop} style={{maxWidth:520}}>
          <div>
            <label>City</label>
            <input value={city} onChange={e=>setCity(e.target.value)} required />
          </div>
          <div>
            <label>Start</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
          </div>
          <div>
            <label>End</label>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
          </div>
          <div style={{marginTop:8}}>
            <button type="submit">Add Stop</button>
          </div>
        </form>

        <ul>
          {(trip.stops || []).map(stop => (
            <li key={stop.id} style={{marginTop:12, border:'1px solid #eee', padding:8}}>
              <strong>{stop.city}{stop.country?`, ${stop.country}`:''}</strong>
              <div>{stop.start_date || ''} — {stop.end_date || ''}</div>
              <div style={{marginTop:8}}>
                <label>Select stop to add activities:</label>
                <button onClick={()=>setSelectedStopId(stop.id)} style={{marginLeft:8}}>Select</button>
                {selectedStopId===stop.id && <span style={{marginLeft:8,color:'#666'}}>Selected</span>}
              </div>
              <div style={{marginTop:8}}>
                <h4>Activities on this stop</h4>
                <ul>
                  {/** We'll fetch activities from trip_activities via trip fetch; for now use separate API when necessary */}
                  {/* Show nothing here (backend includes activities via trip endpoint when expanded) */}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{marginTop:16}}>
        <h3>Discover Activities</h3>
        <p>Click an activity to add to the selected stop.</p>
        <ul>
          {activities.map(a => (
            <li key={a.id} style={{marginTop:8}}>
              <strong>{a.name}</strong> — {a.city} — ${a.cost}
              <div style={{marginTop:6}}>
                <button disabled={!selectedStopId} onClick={()=>handleAddActivityToStop(selectedStopId, a.id)}>Add to selected stop</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
