import React, { useEffect } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";  // Ensure you have this
import "./Styles.css";

export default function Login() {
  const [{ token }, dispatch] = useStateProvider();

  // Effect to check for token in the URL hash
  useEffect(() => {
    const hash = window.location.hash;
    let token = null;

    if (hash) {
      // Extract the access token and expires_in from the URL
      const params = new URLSearchParams(hash.substring(1));
      token = params.get("access_token");
      const expiresIn = params.get("expires_in");

      if (token && expiresIn) {
        // Dispatch the token to your global state (like in a reducer)
        dispatch({ type: reducerCases.SET_TOKEN, token });

        // Optionally, you could store token expiry time here
        // Example: Set a timeout for when the token will expire (not implemented here)

        // Clear the URL hash to clean up the URL
        window.location.hash = "";
      } else {
        console.error("Token or expiration time missing.");
      }
    }
  }, [dispatch]);

  // Redirect to Spotify login page
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

    // Redirecting to Spotify for login and authorization
    window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope.join(" ")}&response_type=token&show_dialog=true`;
  };

  return (
    <div className="login-container">
      {token ? (
        <p className="login-message">Logged in with token: {token}</p>
      ) : (
        <p className="login-message">Please log in</p>
      )}
      <img
        className="login-logo"
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png"
        alt="Spotify Logo"
      />
      <button className="login-button" onClick={handleClick}>
        {token ? "Logged In" : "Login with Spotify"}
      </button>
    </div>
  );
}
