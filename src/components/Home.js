import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import AuthService from "../services/auth.service";

import UserService from "../services/user.service";

const Home = () => {
  const [content, setContent] = useState("");
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);


  return(
    <Fragment>
      <Helmet><title>Quiz App - Home</title></Helmet>
      <div id="home">
        <section>
          <h1> Quiz Master </h1>
          <br/><br/><br/><br/>
          <div className="play-button-container">
            <ul>
              <li><Link className="play-button" to={"/play/instructions"}>Just Play!</Link></li>
            </ul>
          </div>
          <div className="auth-container">
            <Link to={"/login"} className="auth-buttons" id="login-button">Login</Link>
            <Link to={"/register"} className="auth-buttons" id="register-button">Register</Link>
          </div>
        </section>
      </div>
      
    </Fragment>
  )

};

export default Home;