import React, { Component, Fragment } from "react";
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import AuthService from "../../services/auth.service";

class QuizSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            score: 0,
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hintsUsed: 0,
            fiftyFiftyUsed: 0
        };
    }

    componentDidMount() {
        const { state } = this.props.location;
        if(state && state.numberOfAnsweredQuestions!=0) {
            this.setState({
                currentUser: AuthService.getCurrentUser(),
                score: (state.score / state.numberOfAnsweredQuestions) * 100,
                numberOfQuestions: state.numberOfQuestions,
                numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
                correctAnswers: state.correctAnswers,
                wrongAnswers: state.wrongAnswers,
                hintsUsed: state.hintsUsed,
                fiftyFiftyUsed: state.fiftyFiftyUsed
            });
        } else if(state){
            console.log(state.numberOfAnsweredQuestions)
            this.setState({
                score: 0,
                numberOfQuestions: state.numberOfQuestions,
                numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
                correctAnswers: state.correctAnswers,
                wrongAnswers: state.wrongAnswers,
                hintsUsed: state.hintsUsed,
                fiftyFiftyUsed: state.fiftyFiftyUsed
            });
        }
        
    }
    render() {
        const { state } = this.props.location;

        const { currentUser } = this.state;

        const logOut = () => {
            AuthService.logout();
          };

        let stats, remark;
        const userScore = this.state.score;
        if (userScore <= 50) {
            remark = 'You need more practice!';
        } else if(userScore > 50 && userScore <= 80) {
            remark = 'You did great!';
        } else {
            remark = 'You\'re an absolute genius!';
        }

        if (state !== undefined) {
            stats = (
                <Fragment>
                    <div className='quiz-summary container'>
                    <div  style={{ textAlign: 'center' }}>
                        <span className="mdi mdi-check-circle-outline success-icon"></span>
                    </div>
                    <h1>Quiz has ended</h1>
                    <div className="container stats">
                        <h4>{remark}</h4>
                        <h2>Your Score: {this.state.score.toFixed(0)}&#37;</h2>
                        <span className="stat left">Number of answered questions: </span>
                        <span className="right">{this.state.numberOfAnsweredQuestions}</span><br />

                        <span className="stat left">Number of Correct Answers: </span>
                        <span className="right">{this.state.correctAnswers}</span><br />

                        <span className="stat left">Number of Wrong Answers: </span>
                        <span className="right">{this.state.wrongAnswers}</span><br />

                        <span className="stat left">Hints Used: </span>
                        <span className="right">{this.state.hintsUsed}</span><br />

                        <span className="stat left">50-50 Used: </span>
                        <span className="right">{this.state.fiftyFiftyUsed}</span><br />
                    </div>
                    <section>
                        <ul>
                            <li>
                                <Link to="/home" >Home</Link>
                            </li>
                        {currentUser && (
                            <li>
                                <Link to="/profile">Back to My Profile</Link>
                            </li>
                        )}
                            <li>
                                <Link to="/play/quiz">Play Again</Link>
                            </li>
                        </ul>
                    </section>
                    </div>
                </Fragment>
                       
            );
        } else {
            stats = (
                <section>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/play/quiz">Take a Quiz</Link>
                        </li>
                    </ul>
                </section>
            );
        }
        return (
            <Fragment>
                <Helmet><title>Quiz App - Summary</title></Helmet>
                {stats}
            </Fragment>
        );
    }
}

export default QuizSummary;