import React, { useState, useEffect, useCallback } from 'react';
import './BloodBankList.css';

const BloodBankList = ({ searchParams }) => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState('');

  const fetchBloodBanks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let url = 'http://localhost:5001/api/blood-banks/nearby';
      
      if (searchParams) {
        const params = new URLSearchParams();
        if (searchParams.searchTerm) {
          params.append('searchTerm', searchParams.searchTerm);
        }
        if (searchParams.radius) {
          params.append('radius', searchParams.radius);
        }
        url += `?${params.toString()}`;
      }

      console.log('Fetching from URL:', url); // Debug log
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      if (!data || data.length === 0) {
        setError('No blood banks found. Try searching with different terms.');
        setBloodBanks([]);
      } else {
        setBloodBanks(data);
      }
    } catch (err) {
      console.error('Error fetching blood banks:', err);
      setError(err.message || 'Failed to fetch blood banks. Please try again.');
      setBloodBanks([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBloodBanks();
  }, [fetchBloodBanks]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredBanks = selectedBloodType
    ? bloodBanks.filter(bank => bank.bloodTypes[selectedBloodType]?.available)
    : bloodBanks;

  if (loading) return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>Loading blood banks...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <h3>Error</h3>
      <p>{error}</p>
      <button onClick={fetchBloodBanks} className="retry-button">
        Retry
      </button>
    </div>
  );

  return (
    <div className="blood-bank-container">
      <div className="filters">
        <h2>Filter by Blood Type</h2>
        <select 
          value={selectedBloodType} 
          onChange={(e) => setSelectedBloodType(e.target.value)}
          className="blood-type-select"
        >
          <option value="">All Blood Types</option>
          {bloodTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {filteredBanks.length === 0 ? (
        <div className="no-results">
          <h3>No Results Found</h3>
          <p>No blood banks found matching your criteria.</p>
          <p>Try adjusting your search parameters or blood type filter.</p>
        </div>
      ) : (
        <div className="blood-bank-list">
          {filteredBanks.map(bank => (
            <div key={bank._id} className="blood-bank-card">
              <h3>{bank.name}</h3>
              <p className="address">{bank.address}</p>
              <p className="hours">Hours: {bank.operatingHours.open} - {bank.operatingHours.close}</p>
              
              <div className="contact-info">
                <p>Phone: {bank.contact.phone}</p>
                <p>Email: {bank.contact.email}</p>
              </div>

              <div className="blood-types">
                <h4>Available Blood Types:</h4>
                <div className="blood-type-grid">
                  {bloodTypes.map(type => {
                    const bloodType = bank.bloodTypes[type];
                    const isAvailable = bloodType?.available;
                    const quantity = bloodType?.quantity;
                    
                    return (
                      <div 
                        key={type} 
                        className={`blood-type ${isAvailable ? 'available' : 'unavailable'}`}
                        data-has-zero={isAvailable && quantity === 0 ? 'true' : 'false'}
                      >
                        <span className="type">{type}</span>
                        <span 
                          className="quantity"
                          data-quantity={isAvailable ? quantity : '0'}
                        >
                          {isAvailable 
                            ? `${quantity} units`
                            : 'Not available'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodBankList; 