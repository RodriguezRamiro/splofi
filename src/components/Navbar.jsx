// Navbar.jsx
import React from 'react';
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useStateProvider } from '../utils/StateProvider';
import "./Styles.css";

export default function Navbar({ navBackground }) {
  const [{ userInfo }] = useStateProvider();

  return (
    <div
      className={`navbar-container ${navBackground ? 'nav-background' : ''}`}
    >
      <div className="search-bar">
        <FaSearch />
        <input type="text" placeholder="Artists, songs, or podcasts" />
      </div>
      <div className="avatar">
        <a href="#">
          <CgProfile />
          <span>{userInfo?.userName}</span>
        </a>
      </div>
    </div>
  );
}
