import React, { Fragment, useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div id="profile_page">
      <div id="title">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong>
          </h3>
        </header>
        {/* <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p> */}
        <p>
          <strong>Id:</strong> {currentUser.id}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        {/* <strong>Authorities:</strong> */}
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>

        <br/><br/><br/><br/><br/><br/>
        <Link to={"/play/instructions"} className="buttons" id="play-button">Play</Link> <Link to={"/home"} className="buttons" id="logout-button">Log Out</Link> 
        <br/><br/>
        

      </div>

    </div>
  );
};

export default Profile;