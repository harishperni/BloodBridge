import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography
} from '@mui/material';
import axios from 'axios';

const BloodBankSearch = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [radius, setRadius] = useState('5000');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5002/api/blood-banks/search', {
        params: {
          query: searchQuery,
          bloodType,
          radius
        }
      });
      onSearchResults(response.data);
    } catch (error) {
      console.error('Error searching blood banks:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Find Blood Banks
      </Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter city, zip code, or address"
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Blood Type</InputLabel>
          <Select
            value={bloodType}
            label="Blood Type"
            onChange={(e) => setBloodType(e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Radius</InputLabel>
          <Select
            value={radius}
            label="Radius"
            onChange={(e) => setRadius(e.target.value)}
          >
            <MenuItem value="1000">1 km</MenuItem>
            <MenuItem value="5000">5 km</MenuItem>
            <MenuItem value="10000">10 km</MenuItem>
            <MenuItem value="25000">25 km</MenuItem>
            <MenuItem value="50000">50 km</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ minWidth: 120 }}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default BloodBankSearch; 