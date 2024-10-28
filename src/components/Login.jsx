import React, { useEffect } from "react";
import { useStateProvider } from "../utils/StateProvider";
import './Login.css'; // Make sure to import your CSS file

export default function Login() {
  const [{ token }, dispatch] = useStateProvider();

  // Debug: Log state to confirm if the context is working
  useEffect(() => {
  }, [token]);

  const handleClick = () => {
    const clientId = "305e0c3ef9ef48dc8504556c83d114ca";
    const redirectUrl = "http://localhost:3000/";
    const apiUrl = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-email",
      "user-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-read-playback-position",
      "user-top-read",
    ];

    // Redirecting to the Spotify authorization URL
    window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope.join(" ")}&response_type=token&show_dialog=true`;
  };

  return (
    <div className="login-container">
      {token ? <p className="login-message">Logged in with token: {token}</p> : <p className="login-message">Please log in</p>}
      <img
        className="login-logo"
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png"
        alt="spotify"
      />
      <button className="login-button" onClick={handleClick}>Login with Spotify</button>
    </div>
  );
}
