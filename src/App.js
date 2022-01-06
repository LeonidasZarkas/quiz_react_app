import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import QuizInstructions from "./components/quiz/QuizInstructions";
import Play from "./components/quiz/Play";
import QuizSummary from "./components/quiz/QuizSummary";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardAdmin from "./components/BoardAdmin";

const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <Switch>
      <Route exact path={["/", "/home"]} component={Home} />
      <Route exact path="/play/instructions" component={QuizInstructions} />
      <Route exact path="/play/quiz" component={Play} />
      <Route exact path="/play/quizSummary" component={QuizSummary} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/profile" component={Profile} />
    </Switch>
  )

  // return (

    // <div>
    //   <nav className="navbar navbar-expand navbar-dark bg-dark">
    //     <Link to={"/"} className="navbar-brand">
    //       Quiz
    //     </Link>
    //     <div className="navbar-nav mr-auto">
    //       <li className="nav-item">
    //         <Link to={"/home"} className="nav-link">
    //           Home
    //         </Link>
    //       </li>

    //       {showAdminBoard && (
    //         <li className="nav-item">
    //           <Link to={"/admin"} className="nav-link">
    //             Admin Board
    //           </Link>
    //         </li>
    //       )}

    //       {currentUser && (
    //         <li className="nav-item">
    //           <Link to={"/user"} className="nav-link">
    //             User
    //           </Link>
    //         </li>
    //       )}
    //     </div>

    //     {currentUser ? (
    //       <div className="navbar-nav ml-auto">
    //         <li className="nav-item">
    //           <Link to={"/profile"} className="nav-link">
    //             {currentUser.username}
    //           </Link>
    //         </li>
    //         <li className="nav-item">
    //           <a href="/login" className="nav-link" onClick={logOut}>
    //             LogOut
    //           </a>
    //         </li>
    //       </div>
    //     ) : (
    //       <div className="navbar-nav ml-auto">
    //         <li className="nav-item">
    //           <Link to={"/login"} className="nav-link">
    //             Login
    //           </Link>
    //         </li>

    // //         <li className="nav-item">
    // //           <Link to={"/register"} className="nav-link">
    // //             Sign Up
    // //           </Link>
    // //         </li>
    // //       </div>
    //     )}
    //   </nav>

    //   <div className="container mt-3">
    //   <Switch>
    //       <Route exact path={["/", "/home"]} component={Home} />
    //       <Route exact path="/login" component={Login} />
    //       <Route exact path="/register" component={Register} />
    //       <Route exact path="/profile" component={Profile} />
    //       <Route path="/user" component={BoardUser} />
    //       <Route path="/admin" component={BoardAdmin} />
    //     </Switch>
    //   </div>
    // </div>

    
  // );
};

export default App;