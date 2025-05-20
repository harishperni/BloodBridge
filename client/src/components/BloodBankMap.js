import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const bloodBankIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map center updates
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const BloodBankMap = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [center, setCenter] = useState({
    lat: 37.7749,
    lng: -122.4194
  });

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          
          // Fetch nearby blood banks
          try {
            const response = await axios.get(`http://localhost:5002/api/blood-banks/nearby`, {
              params: {
                latitude,
                longitude,
                radius: 5000 // 5km radius
              }
            });
            setBloodBanks(response.data);
          } catch (error) {
            console.error('Error fetching blood banks:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <Box sx={{ width: '100%', height: '500px' }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={[center.lat, center.lng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {bloodBanks.map((bank) => (
          <Marker
            key={bank._id}
            position={[bank.location.coordinates[1], bank.location.coordinates[0]]}
            icon={bloodBankIcon}
            eventHandlers={{
              click: () => setSelectedBank(bank)
            }}
          >
            <Popup>
              <Paper sx={{ p: 2, maxWidth: 300 }}>
                <Typography variant="h6">{bank.name}</Typography>
                <Typography variant="body2">{bank.address}</Typography>
                <Typography variant="body2">Phone: {bank.contact.phone}</Typography>
                <Typography variant="body2">
                  Hours: {bank.operatingHours.open} - {bank.operatingHours.close}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>Available Blood Types:</Typography>
                {Object.entries(bank.bloodTypes).map(([type, info]) => (
                  info.available && (
                    <Typography key={type} variant="body2">
                      {type}: {info.quantity} units
                    </Typography>
                  )
                ))}
              </Paper>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default BloodBankMap; 