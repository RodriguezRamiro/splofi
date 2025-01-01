import React, { useState } from 'react';
import './Styles.css';




/*With this code, users can:
Search for tracks by entering a query.
See the list of matching tracks in the dropdown.
Click a track to initiate playback.

Token Prop: Ensure the token prop is passed to SearchComponent from the parent component.
Active Spotify Device: Playback requires an active Spotify device (e.g., Spotify app running on a phone or computer).
Premium Account: The user must have a Spotify Premium account for playback to work.
*/

export default function SearchComponent({ token }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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

  // Function to trigger the search
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSearchResults(data.tracks.items); // Update to search tracks
    } catch (error) {
      console.error('Error fetching search results:', error);
      setErrorMessage('Failed to fetch search results.');
    }
  };

  // Handle the click on a search result to play the track
  const playTrack = async (track) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [`spotify:track:${track.id}`], // Use the track's Spotify URI
        }),
      });

      if (response.status === 204) {
        console.log(`Playing track: ${track.name} by ${track.artists.map((a) => a.name).join(', ')}`);
        setSelectedResult(track); // Set the selected track as playing
        setErrorMessage(''); // Clear any error messages
      } else {
        setErrorMessage('Failed to play the track. Make sure Spotify is active.');
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setErrorMessage('An error occurred while trying to play the track.');
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
        placeholder="Search for tracks..."
      />
      <button className="search-button" onClick={handleSearch}>Search</button>

      {/* Display error messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="search-result-item"
              onClick={() => playTrack(result)} // Play track on click
            >
              <img src={result.album.images[0]?.url} alt={result.name} />
              <span>{result.name}</span>
              <span>{result.artists.map((artist) => artist.name).join(', ')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Display currently playing track */}
      {selectedResult && (
        <div className="selected-result">
          <h3>Now Playing: {selectedResult.name}</h3>
          <p>By: {selectedResult.artists.map((artist) => artist.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}
