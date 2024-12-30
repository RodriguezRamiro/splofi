import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import axios from 'axios';
import { useStateProvider } from '../utils/StateProvider';
import './Styles.css';

export default function Navbar({ navBackground }) {
  const [{ token, userInfo }] = useStateProvider();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // State for search results

  // Function to handle search
  const handleSearch = async () => {
    if (!searchQuery) return; // Avoid empty search
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          q: searchQuery,
          type: 'album,artist,track',
        },
      });

      // Extract data and update state
      const results = response.data.tracks?.items || [];
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className={`navbar-container ${navBackground ? 'nav-background' : ''}`}>
      {/* Search Bar */}
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Artists, songs, or podcasts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Display Search Results */}
      <div className="search-results">
        {searchResults.map((result) => (
          <div key={result.id} className="search-result-item">
            <img src={result.album.images[0]?.url} alt={result.name} />
            <span>{result.name}</span>
          </div>
        ))}
      </div>

      {/* User Info */}
      <div className="avatar">
        <a href="#">
          <CgProfile />
          <span>{userInfo ? userInfo.userName : 'Loading...'}</span>
        </a>
      </div>
    </div>
  );
}
