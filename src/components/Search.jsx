import React, { useState } from 'react';
import axios from 'axios';
import { useStateProvider } from '../utils/StateProvider';
import './Styles.css';

export default function Search() {
  const [{ token }, dispatch] = useStateProvider();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState(''); // State to display the message

  // Function to search Spotify's catalog
  const searchSpotifyCatalog = async (query) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            q: query,
            type: 'album,artist,track',
          },
        }
      );

      // Setting albums or tracks based on response
      const albums = response.data.albums?.items || [];
      setSearchResults(albums);
      console.log('Search Results:', albums); // Debugging/logging
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchSpotifyCatalog(searchQuery);
  };

  // Handle song click
  const handleSongClick = (track) => {
    // Dispatch the selected track as currently playing
    dispatch({
      type: 'SET_PLAYING',
      currentlyPlaying: {
        id: track.id,
        name: track.name,
        artists: track.artists,
        image: track.images[0]?.url,
      },
    });

    // Set the message
    setMessage(`Now playing: ${track.name}`);

    // Clear the message after a few seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search Spotify"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {message && <div className="message">{message}</div>}
      <div className="search-results">
        {searchResults.map((result) => (
          <div
            key={result.id}
            className="search-result-item"
            onClick={() => handleSongClick(result)}
          >
            <img
              src={result.images[0]?.url}
              alt={result.name}
              className="result-image"
            />
            <span>{result.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
