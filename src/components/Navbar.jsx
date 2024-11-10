import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useStateProvider } from '../utils/StateProvider';
import "./Styles.css";

export default function Navbar({ navBackground }) {
  const [{ userInfo }] = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");

  // Handle input change in search bar
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      className={`navbar-container ${navBackground ? 'nav-background' : ''}`}
    >
      {/* Search Bar */}
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Artists, songs, or podcasts"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* User Avatar and Info */}
      <div className="avatar">
        <a href="#">
          <CgProfile />
          <span>{userInfo ? userInfo.userName : "Loading..."}</span>
        </a>
      </div>
    </div>
  );
}
