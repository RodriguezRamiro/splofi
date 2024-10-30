// Spotify.jsx
import React, { useEffect, useRef, useState } from "react";
import "./Styles.css";
import Body from "./Body";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from 'axios';
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from '../utils/Constants';

function Spotify() {
    const [{ token }, dispatch] = useStateProvider();
    const bodyRef = useRef()
    const [navBackground, setNavBackGround] = useState(false)
    const [headerBackground, setHeaderBackGround] = useState(false)
    const bodyScrolled = () => {
        bodyRef.current.scrollTop >= 30
        ? setNavBackGround(true)
        : setNavBackGround(false);
        bodyRef.current.scrollTop >= 268
        ? setHeaderBackGround(true)
        : setHeaderBackGround(false);
    }

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
            <div className="spotify-body" ref={bodyRef} onScroll={bodyScrolled}>
                <Navbar navBackground={navBackground}/>
                <div className="spotify-body-content">
                    <Body headerBackground={headerBackground}/>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Spotify;
