import React, { useState } from 'react';
import axios from 'axios';
import { useStateProvider } from '../utils/StateProvider';
import './Styles.css';

export default function Search() {
  const [{ token }, dispatch] = useStateProvider();
  const [searchResults, setSearchResults] = useState({
    albums: [],
    tracks: [],
    artists: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  // Function to search Spotify's catalog
  const searchSpotifyCatalog = async (query) => {
    if (!query.trim()) return; // Avoid empty searches
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          q: query,
          type: 'album,artist,track',
        },
      });

      const albums = response.data.albums?.items || [];
      const tracks = response.data.tracks?.items || [];
      const artists = response.data.artists?.items || [];

      setSearchResults({ albums, tracks, artists });
      setErrorMessage(''); // Clear error message
      console.log('Search Results:', { albums, tracks, artists });
    } catch (error) {
      console.error('Error fetching search results:', error);
      setErrorMessage('Error fetching search results. Please try again later.');
    }
  };

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchSpotifyCatalog(searchQuery);
    setSearchQuery(''); // Clear search query after submitting
  };

  // Handle song click
  const handleSongClick = (track) => {
    // Dispatch the selected track as currently playing
    dispatch({
      type: 'SET_PLAYING',
      currentlyPlaying: {
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => artist.name),
        image: track.album.images[0]?.url,
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
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="search-results">
        {/* Display albums */}
        {searchResults.albums.length > 0 && (
          <div className="search-section">
            <h3>Albums</h3>
            {searchResults.albums.map((result) => (
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
        )}

        {/* Display tracks */}
        {searchResults.tracks.length > 0 && (
          <div className="search-section">
            <h3>Tracks</h3>
            {searchResults.tracks.map((result) => (
              <div
                key={result.id}
                className="search-result-item"
                onClick={() => handleSongClick(result)}
              >
                <img
                  src={result.album.images[0]?.url}
                  alt={result.name}
                  className="result-image"
                />
                <span>{result.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Display artists */}
        {searchResults.artists.length > 0 && (
          <div className="search-section">
            <h3>Artists</h3>
            {searchResults.artists.map((result) => (
              <div key={result.id} className="search-result-item">
                <img
                  src={result.images[0]?.url}
                  alt={result.name}
                  className="result-image"
                />
                <span>{result.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Display "no results" message if no items */}
        {(searchResults.albums.length === 0 &&
          searchResults.tracks.length === 0 &&
          searchResults.artists.length === 0) && (
          <div className="no-results">No results found for "{searchQuery}"</div>
        )}
      </div>
    </div>
  );
}
