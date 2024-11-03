import React, { useEffect } from 'react';
import { AiFillClockCircle } from 'react-icons/ai';
import { useStateProvider } from '../utils/StateProvider';
import axios from 'axios';
import { reducerCases } from '../utils/Constants';
import "./Styles.css"; // Import external stylesheet

export default function Body({ headerBackground }) {
  const [{ token, selectedPlaylistId, selectedPlaylist }, dispatch] = useStateProvider();
  useEffect(() => {
    console.log("SelectedPlaylist:", selectedPlaylist);
    const getInitialPlaylist = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
          {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log("Playlist Response:", response.data);

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
        console.log(selectedPlaylist);
        dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    getInitialPlaylist();
  }, [token, dispatch, selectedPlaylistId]);

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className="navbar-container"
      style={{ '--nav-background': headerBackground ? '#000000dc' : 'transparent' }}
    >
      {selectedPlaylist && (
        <>
         <div className="playlist-wrapper">
            <div className="playlist">
              <div className="image">
                <img src={selectedPlaylist.image} alt="selected playlist" />
              </div>
              <div className="details">
                <span className="type">PLAYLIST</span>
                <h1 className="title">{selectedPlaylist.name}</h1>
                <p className="description">{selectedPlaylist.description}</p>
              </div>
            </div>
          </div>
          <div className="list">
            <div className="header-row">
              <div className="col">
                <span>TTILE</span>
              </div>
              <div className="col">
                <span>ALBUM</span>
              </div>
              <div className="col">
                <AiFillClockCircle />
              </div>
            </div>
            <div className="tracks">
              {selectedPlaylist.tracks.map((track, index) => (
                <div className="row" key={track.id}>
                  <div className="col">
                    <span>{index + 1}</span>
                  </div>
                  <div className="col detail">
                    <div className="image">
                      <img src={track.image} alt={track.name} />
                    </div>
                    <div className="info">
                      <span className="name">{track.name}</span>
                      <span>{track.artists}</span>
                    </div>
                  </div>
                  <div className="col">
                    <span>{track.album}</span>
                  </div>
                  <div className="col">
                    <span>{msToMinutesAndSeconds(track.duration)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}