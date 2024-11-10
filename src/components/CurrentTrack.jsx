import React, { useEffect, useState } from 'react';
import { useStateProvider } from '../utils/StateProvider';
import axios from 'axios';
import { reducerCases } from '../utils/Constants';
import "./Styles.css";

export default function CurrentTrack() {
    const [{ token, currentlyPlaying }, dispatch] = useStateProvider();
    const [loading, setLoading] = useState(true);  // New state for loading
    const [error, setError] = useState(null); // New state to track errors

    useEffect(() => {
        const getCurrentTrack = async () => {
            if (!token) return; // Prevent API call if token is not available

            setLoading(true); // Start loading indicator

            try {
                const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                // Check if currently playing track data exists
                if (response.data && response.data.item) {
                    const { item } = response.data;
                    const trackData = {
                        id: item.id,
                        name: item.name,
                        artists: item.artists.map(artist => artist.name),
                        image: item.album.images[0]?.url, // Safely access the image URL
                    };
                    dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: trackData });
                } else {
                    // Handle the case where no track is currently playing
                    dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: null });
                }
            } catch (error) {
                console.error("Error fetching current track:", error);
                setError(error.message || "An error occurred while fetching the current track");
            } finally {
                setLoading(false); // Stop loading indicator
            }
        };

        getCurrentTrack();
    }, [token, dispatch]); // Only refetch if token or dispatch changes

    // Display loading state with a spinner
    if (loading) {
        return (
            <div className="current-track-container">
                <div className="loading-spinner"></div> {/* Spinner component */}
                <p>Loading...</p>
            </div>
        );
    }

    // Display error message
    if (error) {
        return <div className="current-track-container">{error}</div>;
    }

    return (
        <div className='current-track-container'>
            {currentlyPlaying ? (
                <div className='current-track'>
                    <div className='current-track-image'>
                        <img src={currentlyPlaying.image} alt='Currently Playing' />
                    </div>
                    <div className='current-track-info'>
                        <h4>{currentlyPlaying.name}</h4>
                        <h6>{currentlyPlaying.artists.join(", ")}</h6>
                    </div>
                </div>
            ) : (
                <p>No track currently playing</p>
            )}
        </div>
    );
}
