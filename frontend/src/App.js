import logo from './logo.svg';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div className="App" style={{ height: '100vh', width: '100vw' }}>
      <MapContainer center={[46.603354, 1.888334]} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[48.8566, 2.3522]}>
          <Popup>
            Paris
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
