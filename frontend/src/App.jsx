import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripsList from './pages/TripsList';
import Itinerary from './pages/Itinerary';
import Search from './pages/Search';
import Profile from './pages/Profile';
import PublicTrip from './pages/PublicTrip';

function App() {
	return (
		<div>
			<nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
				<Link to="/">Dashboard</Link> | <Link to="/trips">My Trips</Link> | <Link to="/create">Create Trip</Link>
			</nav>
			<main style={{ padding: 12 }}>
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/login" element={<Login />} />
					<Route path="/create" element={<CreateTrip />} />
					<Route path="/trips" element={<TripsList />} />
					<Route path="/trips/:id" element={<Itinerary />} />
					  <Route path="/public/:id" element={<PublicTrip />} />
					<Route path="/search" element={<Search />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;