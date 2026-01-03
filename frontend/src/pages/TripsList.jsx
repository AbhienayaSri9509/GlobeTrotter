import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function TripsList(){
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    api.getTrips().then(res=>{ if(!mounted) return; setTrips(Array.isArray(res)?res:[]); setLoading(false); }).catch(()=>setLoading(false));
    return ()=>{ mounted=false };
  },[]);

  return (
    <div>
      <h2>My Trips</h2>
      {loading && <p>Loading...</p>}
      {!loading && trips.length===0 && <p>No trips yet — create one.</p>}
      <ul>
        {trips.map(t=> (
          <li key={t.id}><Link to={`/trips/${t.id}`}>{t.name} — {t.start_date || ''} {t.end_date?`to ${t.end_date}`:''}</Link></li>
        ))}
      </ul>
    </div>
  );
}
