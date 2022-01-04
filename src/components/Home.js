import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import AuthService from "../services/auth.service";


import UserService from "../services/user.service";

const Home = () => {
  const [content, setContent] = useState("");

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

  console.log(content);
  return(
    <Fragment>
      <Helmet><title>Quiz App - Home</title></Helmet>
      <div id="home">
        <section>
          <div style={{ textAlign: 'center' }}>
            <span className="mdi mdi-cube-outline cube"></span>
          </div>
          <h1>Quiz App</h1>
          <div className="play-button-container">
            <ul>
              <li><Link className="play-button" to={"/play/instructions"}>Play</Link></li>
            </ul>
          </div>
          <div className="auth-container">
            <Link to={"/login"} className="auth-buttons" id="login-button">Login</Link>
            <Link to={"/register"} className="auth-buttons" id="register-button">Register</Link>
          </div>
        </section>
      </div>
      {/* <div>{JSON.stringify(content)}</div> */}
      
    </Fragment>
  )

};

export default Home;