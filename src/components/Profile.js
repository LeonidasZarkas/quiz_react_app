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
      <div id="title">
        <header>
          <h3>
            <strong>{currentUser.username}</strong>
          </h3>
        </header>

        <p>
          <strong>Id:</strong> {currentUser.id}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>

        <br/><br/><br/><br/><br/><br/>
        <Link to={"/play/instructions"} className="buttons" id="play-button">Play</Link>
        <Link to={"/home"} className="buttons" id="logout-button" onClick={logOut}>Log Out</Link> 
        <br/><br/>
        

      </div>

    </div>
  );
};

export default Profile;
