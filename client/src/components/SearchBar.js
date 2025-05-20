import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, radius: radius * 1000 }); // Convert km to meters
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-inputs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter city name or ZIP code (e.g., New York or 10001)..."
            className="search-input"
          />
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="radius-select"
          >
            <option value={1}>1 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
          </select>
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 