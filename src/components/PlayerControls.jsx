import React from 'react';
import { BsFillPlayCircleFill, BsFillPauseCircleFill, BsShuffle } from 'react-icons/bs';
import { CgPlayTrackNext, CgPlayTrackPrev } from 'react-icons/cg';
import { FiRepeat } from 'react-icons/fi';
import { useStateProvider } from '../utils/StateProvider';
import { reducerCases } from '../utils/Constants';
import axios from 'axios';
import "./Styles.css";

export default function PlayerControls() {
    const [{ token, playerState }, dispatch] = useStateProvider();

    const changeTrack = async (type) => {
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
    };

    const changeState = async () => {
        const state = playerState ? "pause" : "play";
        try {
            const response = await axios.put(`https://api.spotify.com/v1/me/player/${state}`, {}, {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
            });
            dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: !playerState });
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
                <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
            </div>
            <div className='state'>
                {playerState ? (
                    <BsFillPauseCircleFill onClick={changeState} />
                ) : (
                    <BsFillPlayCircleFill onClick={changeState} />
                )}
            </div>
            <div className="next">
                <CgPlayTrackNext onClick={() => changeTrack("next")} />
            </div>
            <div className='repeat'>
                <FiRepeat />
            </div>
        </div>
    );
}
