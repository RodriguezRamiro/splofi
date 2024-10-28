// Spotify.jsx
import React, { useEffect } from "react";
import "./Spotify.css";
import Body from "./Body";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from 'axios';
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from '../utils/Constants';

function Spotify() {
    const [{ token }, dispatch] = useStateProvider();

    useEffect(() => {
        const getUserInfo = async () => {
            if (!token) {
                console.error("No token provided");
                return;
            }

            try {
                const { data } = await axios.get("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                });

                const userInfo = {
                    userId: data.id,
                    userName: data.display_name,
                };

                dispatch({ type: reducerCases.SET_USER, userInfo });
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        getUserInfo();
    }, [dispatch, token]);

    return (
        <div className="spotify-container">
            <Sidebar />
            <div className="spotify-body">
                <Navbar />
                <div className="spotify-body-content">
                    <Body />
                    <div className="spotify-footer">
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Spotify;
