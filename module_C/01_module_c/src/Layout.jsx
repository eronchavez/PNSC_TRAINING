import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';

const PAGE_TITLES_BY_PATH = {
  '/carparks': 'Carparks',
  '/events': 'Events',
  '/weather': 'Weather',
  '/travel': 'Travel',
  '/settings': 'Settings',
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const isNestedRoute = pathSegments.length > 1;
  const pageTitle = isNestedRoute ? 'Carpark Detail' : (PAGE_TITLES_BY_PATH[location.pathname] ?? 'Carparks');

  return (
    <div className="app">
      <header>
        {isNestedRoute && (
          <button id="backBtn" onClick={() => navigate(-1)} aria-label="Go Back">&lt;</button>
        )}
        <h1 id="viewTitle">{pageTitle}</h1>
      </header>

      <main id="mainContent">
        <Outlet />
      </main>

      <footer>
        <nav>
          <NavLink to="/carparks" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>Carparks</NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>Events</NavLink>
          <NavLink to="/weather" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>Weather</NavLink>
          <NavLink to="/travel" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>Travel</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>Settings</NavLink>
        </nav>
      </footer>
    </div>
  );
}
