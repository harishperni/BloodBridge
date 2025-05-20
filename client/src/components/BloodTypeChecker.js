import React, { useState } from 'react';
import './BloodTypeChecker.css';

const BloodTypeChecker = () => {
  const [donorType, setDonorType] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [showResult, setShowResult] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const compatibilityMatrix = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  };

  const checkCompatibility = () => {
    if (!donorType || !recipientType) return;
    setShowResult(true);
  };

  const isCompatible = () => {
    return compatibilityMatrix[donorType]?.includes(recipientType);
  };

  return (
    <div className="blood-type-checker">
      <h2>Blood Type Compatibility Checker</h2>
      <div className="checker-form">
        <div className="type-selector">
          <label>Donor Blood Type:</label>
          <select 
            value={donorType} 
            onChange={(e) => {
              setDonorType(e.target.value);
              setShowResult(false);
            }}
            className="blood-type-select"
          >
            <option value="">Select donor type</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="type-selector">
          <label>Recipient Blood Type:</label>
          <select 
            value={recipientType} 
            onChange={(e) => {
              setRecipientType(e.target.value);
              setShowResult(false);
            }}
            className="blood-type-select"
          >
            <option value="">Select recipient type</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={checkCompatibility}
          disabled={!donorType || !recipientType}
          className="check-button"
        >
          Check Compatibility
        </button>
      </div>

      {showResult && (
        <div className={`result ${isCompatible() ? 'compatible' : 'incompatible'}`}>
          <h3>
            {isCompatible() 
              ? '✅ Compatible for Donation' 
              : '❌ Not Compatible for Donation'}
          </h3>
          <p>
            {isCompatible()
              ? `${donorType} blood can be safely donated to ${recipientType} recipients.`
              : `${donorType} blood cannot be safely donated to ${recipientType} recipients.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default BloodTypeChecker; 