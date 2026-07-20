import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'http://localhost/module_c_api.php';

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1), dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function CarparkListPage() {
  const [carparks, setCarparks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [pinnedIds, setPinnedIds] = useState(
    () => JSON.parse(localStorage.getItem('pinnedCarparkIds') || '[]')
  );
  
  const navigate = useNavigate();
  const location = useLocation();
  const sortMethod = localStorage.getItem('carparkSortMethod') || 'alphabetical';

  useEffect(() => {
    fetch(`${API_BASE}/carparks.json`)
      .then((res) => res.json())
      .then((data) => setCarparks(Object.entries(data).map(([name, item]) => ({ id: name, name, ...item }))))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lat = params.get('latitude'), lng = params.get('longitude');
    if (lat && lng) {
      setUserPos({ latitude: parseFloat(lat), longitude: parseFloat(lng) });
      return;
    }
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserPos({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => console.warn(err)
    );
  }, [location.search]);

  const togglePinned = (id) => {
    const updated = pinnedIds.includes(id) ? pinnedIds.filter((p) => p !== id) : [...pinnedIds, id];
    setPinnedIds(updated);
    localStorage.setItem('pinnedCarparkIds', JSON.stringify(updated));
  };

  const sortedCarparks = useMemo(() => {
    const list = carparks.map((c) => ({
      ...c,
      dist: userPos ? getDistanceKm(userPos.latitude, userPos.longitude, c.latitude, c.longitude) : null,
    }));
    const compare = sortMethod === 'distance'
      ? (a, b) => (a.dist ?? Infinity) - (b.dist ?? Infinity)
      : (a, b) => a.name.localeCompare(b.name);

    return list.sort((a, b) => {
      const pinA = pinnedIds.includes(a.id), pinB = pinnedIds.includes(b.id);
      return pinA !== pinB ? (pinA ? -1 : 1) : compare(a, b);
    });
  }, [carparks, sortMethod, pinnedIds, userPos]);

  if (isLoading) return <p className="state-message">Loading carparks…</p>;

  return (
    <div className="carpark-list">
      {sortedCarparks.map((carpark) => {
        const isPinned = pinnedIds.includes(carpark.id);
        return (
          <div key={carpark.id} className="carpark-card carpark-row">
            <button
              className="carpark-item-main"
              onClick={() => navigate(`/carparks/${carpark.id}${location.search}`)}
            >
              <strong>{carpark.name}</strong><br />
              Available Spaces: {carpark.availableSpaces}<br />
              Latitude: {carpark.latitude}<br />
              Longitude: {carpark.longitude}<br />
              Location: {carpark.location}<br />
              {carpark.dist != null && <>Distance: {carpark.dist.toFixed(1)} km<br /></>}
            </button>
            <button
              className={`pin-btn ${isPinned ? 'pin-btn-active' : ''}`}
              onClick={() => togglePinned(carpark.id)}
            >
              {isPinned ? 'Pinned' : 'Pin'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
