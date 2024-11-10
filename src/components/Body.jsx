import React, { useEffect, useRef, useState } from 'react';
import { AiFillClockCircle } from 'react-icons/ai';
import { useStateProvider } from '../utils/StateProvider';
import axios from 'axios';
import { reducerCases } from '../utils/Constants';
import "./Styles.css";

export default function Body({ headerBackground }) {
  const [{ token, selectedPlaylistId, selectedPlaylist }, dispatch] = useStateProvider();
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state for playlist
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const listRef = useRef(null);
  const trackListRef = useRef(null);

  useEffect(() => {
    const getInitialPlaylist = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
          {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
          }
        );

        const playlistData = response.data;
        const selectedPlaylist = {
          id: playlistData.id,
          name: playlistData.name,
          description: playlistData.description.startsWith('<a') ? '' : playlistData.description,
          image: playlistData.images[0].url,
          tracks: playlistData.tracks.items.map(({ track }) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => artist.name).join(', '),
            image: track.album.images[2].url,
            duration: track.duration_ms,
            album: track.album.name,
            context_uri: track.album.uri,
            track_number: track.track_number,
          })),
        };
        dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialPlaylist();
  }, [token, dispatch, selectedPlaylistId]);

  useEffect(() => {
    const listElement = listRef.current;

    const handleScroll = () => {
      setScrolled(listElement.scrollTop > 0);
    };

    if (listElement) {
      handleScroll(); // Initial state check
      listElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const playTrack = async (id, name, artists, image, context_uri, track_number) => {
    // Check if token exists
    if (!token) {
      console.error("No token provided");
      setErrorMessage("Authentication token is missing.");
      return; // Prevent further execution if token is missing
    }

    try {
      const response = await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        {
          context_uri,
          offset: { position: track_number - 1 },
          position_ms: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token here
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        const currentlyPlaying = {
          id,
          name,
          artists,
          image,
        };
        dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
        dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
      } else {
        dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
      }
    } catch (error) {
      // Handle errors, particularly the Premium requirement
      if (error.response && error.response.data.reason === "PREMIUM_REQUIRED") {
        setErrorMessage("Premium account required to play this track.");
        console.error("Premium account required to play this track.");
      } else {
        setErrorMessage(error.response ? error.response.data.message : error.message);
        console.error("Error playing track:", error.response ? error.response.data : error.message);
      }
    }
  };

  const addTrackToPlaylist = async (trackUri) => {
    try {
      const response = await axios.post(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}/tracks`,
        {
          uris: [trackUri],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Track added to playlist!");
        console.log("Track successfully added to playlist");
      }
    } catch (error) {
      setErrorMessage("Error adding track to playlist.");
      console.error("Error adding track to playlist:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="body-container">
      {loading ? (
        <div className="loading-message">Loading Playlist...</div>
      ) : (
        selectedPlaylist && (
          <>
            <div className="playlist">
              <div className="image">
                <img src={selectedPlaylist.image} alt="Selected Playlist" />
              </div>
              <div className="details">
                <span className="type">PLAYLIST</span>
                <h1 className="title">{selectedPlaylist.name}</h1>
                <p className="description">{selectedPlaylist.description}</p>
              </div>
            </div>
            <div className="list" ref={listRef}>
              <div
                className={`header-row ${scrolled ? "scrolled" : ""}`}
                style={{
                  backgroundColor: scrolled ? "#000000dc" : "transparent",
                }}
              >
                <div className="col"><span>Title</span></div>
                <div className="col"><span>Album</span></div>
                <div className="col"><span><AiFillClockCircle /></span></div>
              </div>
              <div className="tracks" ref={trackListRef}>
                {selectedPlaylist.tracks.map((track, index) => (
                  <div
                    className="row"
                    key={`${track.id}-${index}`}
                    onClick={() =>
                      playTrack(track.id, track.name, track.artists, track.image, track.context_uri, track.track_number)
                    }
                  >
                    <div className="col"><span>{index + 1}</span></div>
                    <div className="col detail">
                      <div className="image">
                        <img src={track.image} alt={track.name} />
                      </div>
                      <div className="info">
                        <span className="name">{track.name}</span>
                        <span>{track.artists}</span>
                      </div>
                    </div>
                    <div className="col"><span>{track.album}</span></div>
                    <div className="col"><span>{msToMinutesAndSeconds(track.duration)}</span></div>
                    <div className="add-to-playlist" onClick={(e) => {
                      e.stopPropagation();
                      addTrackToPlaylist(track.context_uri);
                    }}>
                      Add to Playlist
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
          </>
        )
      )}
    </div>
  );
}
