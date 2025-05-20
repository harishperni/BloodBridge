import React, { useState } from 'react';
import './App.css';
import BloodBankList from './components/BloodBankList';
import SearchBar from './components/SearchBar';
import BloodTypeChecker from './components/BloodTypeChecker';

function App() {
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>BloodBridge</h1>
        <p>Find blood banks and check blood availability in your area</p>
      </header>
      <main>
        <SearchBar onSearch={handleSearch} />
        <BloodTypeChecker />
        <BloodBankList searchParams={searchParams} />
      </main>
    </div>
  );
}

export default App;
