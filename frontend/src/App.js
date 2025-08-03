import './App.css';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FaMap, FaSearch, FaLayerGroup, FaSave, FaFilePdf,
  FaCog, FaUserCircle, FaQuestionCircle, FaTimes
} from 'react-icons/fa';


function App() {
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [znieffChecked, setZnieffChecked] = useState(true);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [searchType, setSearchType] = useState('adresse');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLayerSearch, setShowAddLayerSearch] = useState(false);
  const [layerSearchTerm, setLayerSearchTerm] = useState('');
  const [layerSuggestions, setLayerSuggestions] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [availableLayersWithUI, setAvailableLayersWithUI] = useState([
    { name: "Znieff", color: "#4CAF50", active: true }
  ]);
  



  const availableLayers = [
    "ZICO",
    "Znieff",
    "réserves naturelles",
    "RAMSAR",
    "Natura 2000",
    "protections biotope"
  ];
  
  const handleLayerSearchChange = (e) => {
    const value = e.target.value;
    setLayerSearchTerm(value);
    const filtered = availableLayers.filter(layer =>
      layer.toLowerCase().includes(value.toLowerCase()) &&
      !availableLayersWithUI.some(existing => existing.name === layer)
    );    
    
    setLayerSuggestions(filtered);
  };
  



  const handleClick = (name) => {
    if (name === 'calque') {
      setShowLayerMenu(prev => !prev);
      setShowSearchMenu(false); // on ferme l'autre
    } else if (name === 'recherche') {
      setShowSearchMenu(prev => !prev);
      setShowLayerMenu(false); // on ferme l'autre
    } else {
      alert(`Vous avez cliqué sur : ${name}`);
    }
  };
  

  return (
    <div className="App" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Navbar */}
      <div style={{
        height: '70px',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        position: 'relative',
        zIndex: 1000
      }}>
        {/* Icons de gauche */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <FaMap size={32} style={iconStyle} onClick={() => handleClick('logo')} title="Logo du site" />
          <FaSearch size={32} style={iconStyle} onClick={() => handleClick('recherche')} title="Recherche" />
          <FaLayerGroup size={32} style={iconStyle} onClick={() => handleClick('calque')} title="Calques" />
          <FaSave size={32} style={iconStyle} onClick={() => handleClick('enregistrement')} title="Enregistrer" />
          <FaFilePdf size={32} style={iconStyle} onClick={() => handleClick('pdf')} title="Exporter en PDF" />
        </div>

        {/* Icons de droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <FaQuestionCircle size={32} style={iconStyle} onClick={() => handleClick('aide')} title="Aide" />
          <FaCog size={32} style={iconStyle} onClick={() => handleClick('paramètres')} title="Paramètres" />
          <FaUserCircle size={32} style={iconStyle} onClick={() => handleClick('profil')} title="Profil" />
        </div>
      </div>

      {/* Menu calques (sidebar) */}
      {showLayerMenu && (
      <div style={sidebarStyle}>
        {/* Fermer */}
        <div style={closeButtonContainerStyle}>
          <FaTimes
            size={24}
            style={closeButtonStyle}
            onClick={() => setShowLayerMenu(false)}
            title="Fermer"
            onMouseEnter={(e) => e.target.style.color = '#000'}
            onMouseLeave={(e) => e.target.style.color = '#666'}
          />
        </div>

        {/* Titre */}
        <h2 style={menuTitleStyle}>Calques disponibles</h2>

        {/* Checkbox */}
        {availableLayersWithUI.map((layerObj, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8f9fa',
              padding: '10px 14px',
              borderRadius: '12px',
              marginBottom: '10px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={layerObj.active}
                onChange={() => {
                  const updated = [...availableLayersWithUI];
                  const newStatus = !updated[index].active;

                  // Si décoché, on le supprime
                  if (!newStatus) {
                    setAvailableLayersWithUI(availableLayersWithUI.filter((_, i) => i !== index));
                  } else {
                    updated[index].active = true;
                    setAvailableLayersWithUI(updated);
                  }
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: layerObj.color,
                  cursor: 'pointer',
                  marginRight: '12px',
                }}
              />
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
                {layerObj.name}
              </span>
            </div>
            {/* Color indicator (circle) */}
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: layerObj.color,
                marginLeft: '10px',
                border: '2px solid white',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
              }}
            />
          </div>
        ))}



        {selectedLayers.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Calques sélectionnés :</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedLayers.map((layer, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{layer}</span>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#cc0000',
                      fontSize: '16px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedLayers(selectedLayers.filter(l => l !== layer));
                    }}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* Boutons en bas */}
        <button
          style={{ ...transparentButtonStyle, marginTop: '10px' }}
          onClick={() => setShowAddLayerSearch(prev => !prev)}
          onMouseEnter={(e) => Object.assign(e.target.style, transparentButtonHoverStyle)}
          onMouseLeave={(e) => e.target.style.color = '#666'}
        >
          Ajouter des calques
        </button>

        {showAddLayerSearch && (
          <div style={{ marginTop: '20px', animation: 'fadeSlide 0.3s ease-out' }}>
            <input
              type="text"
              value={layerSearchTerm}
              onChange={handleLayerSearchChange}
              placeholder="Rechercher un calque..."
              style={{
                ...inputStyle,
                width: '100%',
                fontSize: '16px',
                padding: '10px',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
            />
            {layerSuggestions.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                {layerSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      const colorPalette = ['#2196F3', '#FF9800', '#9C27B0', '#009688', '#E91E63', '#795548'];
                      const newColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                    
                      setAvailableLayersWithUI([
                        ...availableLayersWithUI,
                        { name: suggestion, color: newColor, active: true }
                      ]);
                      setLayerSearchTerm('');
                      setLayerSuggestions([]);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: '#f1f1f1',
                      marginBottom: '5px',
                      fontSize: '15px'
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}


        <button
          style={{ ...transparentButtonStyle, marginTop: '10px' }}
          onMouseEnter={(e) => Object.assign(e.target.style, transparentButtonHoverStyle)}
          onMouseLeave={(e) => e.target.style.color = '#666'}
        >
          Ajouter vos calques
        </button>

      </div>
    )}

    {showSearchMenu && (
      <div style={searchMenuStyle}>
        <div style={closeButtonContainerStyle}>
          <FaTimes
            size={24}
            style={closeButtonStyle}
            onClick={() => setShowSearchMenu(false)}
            title="Fermer"
            onMouseEnter={(e) => e.target.style.color = '#000'}
            onMouseLeave={(e) => e.target.style.color = '#666'}
          />
        </div>

        <h2 style={menuTitleStyle}>Recherche</h2>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={selectStyle}
        >
          <option value="adresse">Adresse</option>
          <option value="cadastre">Cadastre</option>
          <option value="geoloc">Géolocalisation</option>
        </select>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Rechercher une ${searchType}`}
          style={inputStyle}
        />

        <button style={searchButtonStyle} onClick={() => alert(`Recherche : ${searchQuery} (${searchType})`)}>
          Rechercher
        </button>
      </div>
    )}



      {/* Carte */}
      <div style={{ height: 'calc(100% - 70px)', width: '100%' }}>
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
    </div>
  );
}

// Icônes
const iconStyle = {
  cursor: 'pointer',
  transition: 'color 0.2s ease',
};
// Bulle modernisée
const sidebarStyle = {
  position: 'absolute',
  top: '80px',
  left: '40px',
  width: '500px',
  height: '600px',
  backgroundColor: '#f9f9fb',
  color: '#1e1e1e',
  padding: '30px',
  borderRadius: '20px',
  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 999,
  animation: 'fadeSlide 0.3s ease-out',
  fontFamily: "'Segoe UI', sans-serif"
};

const menuTitleStyle = {
  fontSize: '24px',
  fontWeight: '700',
  marginBottom: '30px',
  color: '#333',
};

const closeButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '10px',
};

const closeButtonStyle = {
  cursor: 'pointer',
  color: '#666',
  transition: 'color 0.2s ease',
};

const checkboxRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  fontSize: '18px',
  marginBottom: '20px',
  backgroundColor: '#ffffff',
  padding: '12px 16px',
  borderRadius: '12px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
};

const znieffColorBoxStyle = {
  width: '20px',
  height: '20px',
  backgroundColor: '#4CAF50',
  borderRadius: '6px',
};

const menuButtonStyle = {
  padding: '16px',
  backgroundColor: '#1e88e5',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '16px',
  width: '100%',
  fontWeight: '600',
  letterSpacing: '0.5px',
  transition: 'background-color 0.3s ease',
};

const transparentButtonStyle = {
  backgroundColor: 'transparent',
  color: '#666',
  border: 'none',
  padding: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  borderRadius: '8px',
  transition: 'color 0.2s ease',
};

const transparentButtonHoverStyle = {
  color: '#333',
  textDecoration: 'underline',
};


const menuButtonHoverStyle = {
  backgroundColor: '#1565c0',
};

const searchMenuStyle = {
  position: 'absolute',
  top: '100px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '400px',
  backgroundColor: '#f9f9fb',
  color: '#1e1e1e',
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 999,
  animation: 'fadeSlide 0.3s ease-out',
  fontFamily: "'Segoe UI', sans-serif"
};


const inputStyle = {
  padding: '12px',
  fontSize: '16px',
  borderRadius: '10px',
  border: '1px solid #ccc',
  marginBottom: '20px',
  width: '100%',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
};

const searchButtonStyle = {
  ...menuButtonStyle,
  backgroundColor: '#43a047', // vert
};



export default App;
