import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const API_BASE = 'http://localhost/module_c_api.php';

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1), dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function CarparkDetailPage() {
  const { carparkId } = useParams();
  const [carpark, setCarpark] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetch(`${API_BASE}/carparks.json`)
      .then((res) => res.json())
      .then((data) => {
        if (data[carparkId]) setCarpark({ name: carparkId, ...data[carparkId] });
      })
      .catch((err) => console.error(err));

    const params = new URLSearchParams(location.search);
    const lat = params.get('latitude'), lng = params.get('longitude');
    if (lat && lng) {
      setUserPos({ latitude: parseFloat(lat), longitude: parseFloat(lng) });
    } else {
      navigator.geolocation?.getCurrentPosition(
        (pos) => setUserPos({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.warn(err)
      );
    }
  }, [carparkId, location.search]);

  if (!carpark) return <p className="state-message">Loading…</p>;

  const distanceKm = userPos
    ? getDistanceKm(userPos.latitude, userPos.longitude, carpark.latitude, carpark.longitude)
    : null;

  return (
    <div className="carpark-card carpark-detail">
      <h2 className="carpark-detail-name">{carpark.name}</h2>
      {distanceKm != null && <p className="carpark-detail-distance">{distanceKm.toFixed(1)} km away</p>}
      <p className="carpark-detail-spaces">{carpark.availableSpaces} spaces available</p>
    </div>
  );
}
