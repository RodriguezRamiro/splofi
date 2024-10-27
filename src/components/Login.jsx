import React, { useEffect } from "react";
import { useStateProvider } from "../utils/StateProvider";
import './Login.css'; // Make sure to import your CSS file

export default function Login() {
  const [{ token }, dispatch] = useStateProvider();

  // Debug: Log state to confirm if the context is working
  useEffect(() => {
    console.log("Token:", token);
  }, [token]);

  const handleClick = () => {
    const clientId = "f62391d57f434710998fae531bff1204";
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
    <div className="container">
      {token ? <p>Logged in with token: {token}</p> : <p>Please log in</p>}
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png"
        alt="spotify"
      />
      <button onClick={handleClick}>Login with Spotify</button>
    </div>
  );
}
