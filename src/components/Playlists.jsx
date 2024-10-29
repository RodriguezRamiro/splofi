import React, { useEffect } from 'react';
import { useStateProvider } from '../utils/StateProvider';
import axios from 'axios';
import { reducerCases } from '../utils/Constants';
import "./Styles.css";

export default function Playlists() {
    const [{ token, playlists }, dispatch] = useStateProvider();

    useEffect(() => {
        const getPlaylistData = async () => {
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
                console.error("Error fetching playlists:", error);
            }
        };

        if (token) {
            getPlaylistData();
        }
    }, [token, dispatch]);

    return (
        <div className="playlists-container">
            <ul>
                {playlists.length > 0 ? (
                    playlists.map(({ name, id, imageUrl }) => (
                        <li key={id}>
                            {imageUrl && <img src={imageUrl} alt={name} className="playlist-image" />}
                            <span>{name}</span>
                        </li>
                    ))
                ) : (
                    <li>No playlists available.</li>
                )}
            </ul>
        </div>
    );
}
