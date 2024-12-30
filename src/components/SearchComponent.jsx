import React, { useState } from 'react';
import './Styles.css';


export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle the Enter key press to trigger the search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key press
    }
  };

  // Handle the click on an option in the search dropdown
  const handleSelectOption = (result) => {
    setSelectedResult(result); // Set the selected result
    setSearchQuery(result.name); // update the search input with the selected option
    setSearchResults([]); // Clear results after selection
  };

  // Function to trigger the search
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=album`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSearchResults(data.albums.items);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyPress} // Trigger search on Enter
        className="search-input"
        placeholder="Search for albums..."
      />
      <button className="search-button" onClick={handleSearch}>Search</button>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="search-result-item"
              onClick={() => handleSelectOption(result)} // Select result on click
            >
              <img src={result.images[0]?.url} alt={result.name} />
              <span>{result.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Display selected result */}
      {selectedResult && (
        <div className="selected-result">
          <h3>Selected: {selectedResult.name}</h3>
        </div>
      )}
    </div>
  );
}
