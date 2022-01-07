import React, { Fragment, useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const logOut = () => {
    AuthService.logout();
  };

  return (
    <div id="profile_page">
      <div className="profile-info">
        <header>
          <h3>
            {currentUser.username}
          </h3>
        </header>

        <p>
          <strong>Id:</strong> {currentUser.id}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <div className="bottom-buttons">
          <span className='left'><Link to={"/play/instructions"} className="play-button">Play</Link></span>
          <span className='right'><Link to={"/home"} onClick={logOut} className="logout-button">Log Out</Link></span>  
        </div>

      </div>
    </div>
  );
};

export default Profile;
