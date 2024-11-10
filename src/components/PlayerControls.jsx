import React, { useEffect, useState } from 'react';
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsShuffle } from 'react-icons/bs';
import { CgPlayTrackNext, CgPlayTrackPrev } from 'react-icons/cg';
import { FiRepeat } from 'react-icons/fi';
import { useStateProvider } from '../utils/StateProvider';
import { reducerCases } from '../utils/Constants';
import axios from 'axios';
import "./Styles.css";

export default function PlayerControls() {
    const [{ token, playerState, selectedPlaylist }, dispatch] = useStateProvider();
    const [isPremium, setIsPremium] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const checkPremiumStatus = async () => {
            try {
                const response = await axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Check if the user has a Premium account
                setIsPremium(response.data.product === 'premium');
            } catch (error) {
                console.error("Error checking premium status:", error.response ? error.response.data : error.message);
            }
        };

        if (token) {
            checkPremiumStatus();
        }
    }, [token]);

    const changeTrack = async (type) => {
        if (!isPremium) {
            const message = "Premium account required to change tracks.";
            console.error(message);
            setErrorMessage(message);  // Display message in the browser UI
            return;
        }

        try {
            await axios.post(`https://api.spotify.com/v1/me/player/${type}`, {}, {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
            });

            const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
            });

            if (response.data && response.data.item) {
                const { item } = response.data;
                const currentlyPlaying = {
                    id: item.id,
                    name: item.name,
                    artists: item.artists.map((artist) => artist.name),
                    image: item.album.images[0].url,
                };
                dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
            } else {
                dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: null });
            }
        } catch (error) {
            console.error("Error changing track:", error.response ? error.response.data : error.message);
        }
    };

    const changeState = async () => {
        if (!isPremium) {
            const message = "Premium account required to control playback.";
            console.error(message);
            setErrorMessage(message);  // Display message in the browser UI
            return;
        }

        const state = playerState ? "pause" : "play";
        try {
            // Prepare the context_uri for the play action
            const contextUri = selectedPlaylist?.id ? selectedPlaylist.id : "";

            // Set up the request body based on the state
            const body = state === "play" ? { context_uri: contextUri } : {};

            // Make the PUT request to change the playback state
            const response = await axios.put(`https://api.spotify.com/v1/me/player/${state}`, body, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 204) {
                dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: !playerState });
            } else {
                console.error("Error changing playback state:", response.status);
            }
        } catch (error) {
            console.error("Error changing playback state:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='player-controls-container'>
            <div className='shuffle'>
                <BsShuffle />
            </div>
            <div className='previous'>
                {isPremium ? (
                    <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
                ) : (
                    <span className="lock-icon">🔒</span> // Show lock if not Premium
                )}
            </div>
            <div className='state'>
                {isPremium ? (
                    playerState ? (
                        <BsFillPauseCircleFill onClick={changeState} />
                    ) : (
                        <BsFillPlayCircleFill onClick={changeState} />
                    )
                ) : (
                    <span className="lock-icon">🔒</span> // Show lock if not Premium
                )}
                {!isPremium && <span className="premium-message">{errorMessage}</span>} Premium required
            </div>
            <div className="next">
                {isPremium ? (
                    <CgPlayTrackNext onClick={() => changeTrack("next")} />
                ) : (
                    <span className="lock-icon">🔒</span> // Show lock if not Premium
                )}
            </div>
            <div className='repeat'>
                <FiRepeat />
            </div>
        </div>
    );
}
