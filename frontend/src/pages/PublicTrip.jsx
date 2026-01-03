import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function PublicTrip(){
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    api.getPublicTrip(id).then(res=>{ setTrip(res); setLoading(false); }).catch(()=>setLoading(false));
  },[id]);

  if (loading) return <p>Loading public trip...</p>;
  if (!trip) return <p>Public trip not found or is not shared.</p>;

  return (
    <div>
      <h2>{trip.name}</h2>
      <p>{trip.description}</p>
      <section>
        <h3>Stops</h3>
        <ul>
          {(trip.stops||[]).map(s => (
            <li key={s.id} style={{marginBottom:12}}>
              <strong>{s.city}{s.country?`, ${s.country}`:''}</strong>
              <div>{s.start_date || ''} — {s.end_date || ''}</div>
              <div>
                <h4>Activities</h4>
                <ul>
                  {(s.activities||[]).map(a => (
                    <li key={a.id}>{a.activity_name} — {a.activity_description || ''} — ${a.cost || a.activity_cost || 0}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
