import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import AuthService from "../../services/auth.service";
import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';
import correctAnswerSound from '../../assets/audio/Correct-Sound.mp3';
import wrongAnswerSound from '../../assets/audio/Wrong-Sound.mp3';
import buttonClickSound from '../../assets/audio/Button-Click-Sound.mp3';

class Play extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            questions,
            currentQuestion: {},
            trueAnswer: '',
            answers: [],
            questionsAnsweredIndex: [],
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            currentQuestionIndex: Math.floor(Math.random() * 339),
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 1,
            fiftyFifty: 1,
            previousRandomNumbers: [],
            time: {}
        };
        this.interval = null;
        this.correctSound = React.createRef();
        this.wrongSound = React.createRef();
        this.buttonSound = React.createRef();
    }

    componentDidMount() {
        const { questions, currentQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion);
        this.startTimer();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    displayQuestions = (questions = this.state.questions, currentQuestion) => {
        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions) && this.state.numberOfAnsweredQuestions < 15) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            var trueAnswer = '';
            var answers = [];

            for (let i = 0; i < currentQuestion.answerSet.length; i++) {
                let checkAnswer = currentQuestion.answerSet[i].isright;
                answers[i] = currentQuestion.answerSet[i].answer;

                if (checkAnswer) {
                    trueAnswer = currentQuestion.answerSet[i].answer;
                }

                // If answer with the biggest id is found in the beginning of the array, it is removed and added to the end of the array.
                // So that the answers will be ordered by their ids and have "true" and "false" answers at the right places.
                if (i == (currentQuestion.answerSet.length - 1) && currentQuestion.answerSet[i].answerid < currentQuestion.answerSet[0].answerid) {
                    answers.shift();
                    answers.push(currentQuestion.answerSet[0].answer);
                }
            }

            this.setState({
                currentQuestion,
                numberOfQuestions: questions.length,
                trueAnswer,
                answers,
                previousRandomNumbers: []
            }, () => {
                this.showOptions();
            });
        } else {
            this.endGame();
        }
    };

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.trueAnswer.toLowerCase()) {
            this.correctSound.current.play();
            this.correctAnswer();
        } else {
            this.wrongSound.current.play();
            this.wrongAnswer();
        }
    }

    handleQuitButtonClick = () => {
        this.playButtonSound();
        if (window.confirm('Are you sure you want to quit?')) {
            this.props.history.push('/');
        }
    };

    // handleButtonClick = (e) => {
    //     switch (e.target.id) {
    //         case 'next-button':
    //             this.handleNextButtonClick();
    //             break;
    //         case 'previous-button':
    //             this.handlePreviousButtonClick();
    //             break;
    //         case 'quit-button':
    //             this.handleQuitButtonClick();
    //             break;
    //         default:
    //             break;
    //     }
    // }

    playButtonSound = () => {
        this.buttonSound.current.play();
    }

    correctAnswer = () => {
        M.toast({
            html: 'Correct Answer!',
            classes: 'toast-valid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: Math.floor(Math.random() * 339),
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            this.checkUniqueQuestion();
            this.displayQuestions(this.state.questions, this.state.currentQuestion);
            clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.startTimer();
                });
        });
    }

    wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer!',
            classes: 'toast-invalid',
            displayLength: 1500
        });
        this.setState(prevState => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: Math.floor(Math.random() * 339),
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            this.checkUniqueQuestion();
            this.displayQuestions(this.state.questions, this.state.currentQuestion);
            clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.startTimer();
                });
        });
    }

    checkUniqueQuestion = () => {
        let { currentQuestionIndex, questionsAnsweredIndex } = this.state;
        let count = 0;
        if(questionsAnsweredIndex != null && questionsAnsweredIndex!=0) {
            for (let i = 0; i < questionsAnsweredIndex.length; i++) {
                if(questionsAnsweredIndex[i] == currentQuestionIndex) {
                    count++;
                    break;
                }
            }
            if(count!=0) {
                this.setState(prevState => ({
                    currentQuestionIndex: Math.floor(Math.random() * 339),
                },() => {
                    this.checkUniqueQuestion();
                }));

                
            } else {
                questionsAnsweredIndex.push(currentQuestionIndex);
            }
        } else {
            questionsAnsweredIndex.push(currentQuestionIndex);
        }
        
        this.setState({
            currentQuestionIndex: currentQuestionIndex,
            questionsAnsweredIndex
        });

    }

    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));

        options.forEach(option => {
            option.style.visibility = 'visible';
        });
    }

    handleHints = () => {
        if (this.state.hints > 0) {
            const options = Array.from(document.querySelectorAll('.option'));
            let indexOfAnswer;

            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.trueAnswer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            while (true) {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if (index === randomNumber) {
                            option.style.visibility = 'hidden';
                            this.setState((prevState) => ({
                                hints: prevState.hints - 1,
                                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                            }));
                        }
                    });
                    break;
                }
                if (this.state.previousRandomNumbers.length >= 3) break;
            }
        }

    }

    handleFiftyFifty = () => {
        if (this.state.fiftyFifty > 0) {
            const options = document.querySelectorAll('.option');
            const randomNumbers = [];
            let indexOfAnswer;

            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.trueAnswer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            let count = 0;
            do {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer) {
                    if (randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                        randomNumbers.push(randomNumber);
                        count++;
                    } else {
                        while (true) {
                            const newRandomNumber = Math.round(Math.random() * 3);
                            if (newRandomNumber !== indexOfAnswer && !randomNumbers.includes(newRandomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                                randomNumbers.push(newRandomNumber);
                                count++;
                                break;
                            }
                        }
                    }
                }
            } while (count < 2);
            options.forEach((option, index) => {
                if (randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                }
            });
            this.setState(prevState => ({
                fiftyFifty: prevState.fiftyFifty - 1
            }));
        }
    }

    startTimer = () => {
        const countDownTime = Date.now() + 10000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / (1000));

            if (distance < 0 && this.state.numberOfAnsweredQuestions == 15) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame();
                });
            } else if(distance < 0) {
                clearInterval(this.interval);
                this.setState(prevState => ({
                    wrongAnswers: prevState.wrongAnswers + 1,
                    currentQuestionIndex: Math.floor(Math.random() * 339),
                    numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }), () => {
                        this.checkUniqueQuestion();
                        this.displayQuestions(this.state.questions, this.state.currentQuestion);
                        this.startTimer();
                    });
                    
            } else {
                this.setState({
                    time: {
                        minutes,
                        seconds
                    }
                });
            }
        }, 1000);
    }

    endGame = () => {
        alert('Quiz has ended!');
        const { state } = this;
        const playerStats = {
            score: state.score,
            numberOfQuestions: state.numberOfQuestions,
            numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
            fiftyFiftyUsed: 1 - state.fiftyFifty,
            hintsUsed: 1 - state.hints
        };
        setTimeout(() => {
            this.props.history.push('/play/quizSummary', playerStats);
        }, 1000);
    }

    render() {
        const {
            currentQuestion,
            currentQuestionIndex,
            numberOfAnsweredQuestions,
            answers,
            hints,
            fiftyFifty,
            time,
            currentUser
        } = this.state;

        const logOut = () => {
            AuthService.logout();
          };

        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <Fragment>
                    <audio ref={this.correctSound} src={correctAnswerSound}></audio>
                    <audio ref={this.wrongSound} src={wrongAnswerSound}></audio>
                    <audio ref={this.buttonSound} src={buttonClickSound}></audio>
                </Fragment>
                <div id="play">
                    <div className='questions'>
                    {currentUser && (
                        <div className="user-buttons">
                            <span className='left'><Link to={"/profile"} className="profile-button">My Profile</Link></span>
                            <span className='right'><Link to={"/home"} onClick={logOut} className="logout-button">Logout</Link></span>
                        </div>
                    )}
                        <h2>LET'S PLAY !</h2>
                        <div className='lifeline-container'>
                            <p>
                                <span onClick={this.handleFiftyFifty} className='mdi mdi-set-center mdi-24px lifeline-icon'></span>
                                <span className='lifeline'>{fiftyFifty}</span>
                            </p>
                            <p>
                                <span onClick={this.handleHints} className='mdi mdi-lightbulb-on mdi-24px lifeline-icon'></span>
                                <span className='lifeline'>{hints}</span>
                            </p>
                        </div>
                        <div className='timer-container'>
                            <p>
                                <span className='left'>{numberOfAnsweredQuestions} of 15</span>
                                <span className='right'>{time.minutes}:{time.seconds}<span className='mdi mdi-clock-outline mdi-24px'></span></span>
                            </p>
                        </div>
                        <h5>{currentQuestion.questions}</h5>
                        <div className='options-container'>
                            <p onClick={this.handleOptionClick} className='option'>{answers[0]}</p>
                            <p onClick={this.handleOptionClick} className='option'>{answers[1]}</p>
                        </div>
                        <div className='options-container'>
                            <p onClick={this.handleOptionClick} className='option'>{answers[2]}</p>
                            <p onClick={this.handleOptionClick} className='option'>{answers[3]}</p>
                        </div>

                        {/* <div className='button-container'>
                            <button id="previous-button" onClick={this.handleButtonClick}>Previous</button>
                            <button id="next-button" onClick={this.handleButtonClick}>Next</button>
                            <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>
                        </div> */}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Play;