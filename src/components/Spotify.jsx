// Spotify.jsx
import React from "react";
import "./Spotify.css";
import Body from "./Body"
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Spotify() {
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
