import React, { useEffect, useState } from 'react';
import { useStateProvider } from '../utils/StateProvider';
import axios from 'axios';
import { reducerCases } from '../utils/Constants';
import "./Styles.css";

export default function Playlists() {
    const [{ token, playlists }, dispatch] = useStateProvider();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPlaylistData = async () => {
            if (!token) {
                setErrorMessage("No authentication token found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    }
                });

                const { items } = response.data;
                const playlists = items.map(({ name, id, images }) => {
                    return {
                        name,
                        id,
                        imageUrl: images.length > 0 ? images[0].url : ''
                    };
                });

                console.log("Fetched Playlists:", playlists);
                dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Session expired or invalid token. Please log in again.");
                } else {
                    setErrorMessage("Error fetching playlists. Please try again later.");
                }
                console.error("Error fetching playlists:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            setLoading(true);
            getPlaylistData();
        }

    }, [token, dispatch]);

    const changeCurrentPlaylist = (selectedPlaylistId) => {
        dispatch({ type: reducerCases.SET_PLAYLISTS_ID, selectedPlaylistId });
    };

    return (
        <div className="playlists-container">
            {loading ? (
                <div className="loading-message">Loading playlists...</div>
            ) : (
                <>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <ul>
                        {playlists.length > 0 ? (
                            playlists.map(({ name, id, imageUrl }) => (
                                <li key={id} onClick={() => changeCurrentPlaylist(id)}>
                                    {imageUrl && <img src={imageUrl} alt={name} className="playlist-image" />}
                                    <span>{name}</span>
                                </li>
                            ))
                        ) : (
                            <li>No playlists available.</li>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
}
