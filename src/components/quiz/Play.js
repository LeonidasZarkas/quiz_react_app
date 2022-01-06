import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';

import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';
import correctAnswerSound from '../../assets/audio/Correct-Sound.mp3';
import wrongAnswerSound from '../../assets/audio/Wrong-Sound.mp3';
import buttonClickSound from '../../assets/audio/Button-Click-Sound.mp3';

class Play extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            trueAnswer: '',
            answers: [],
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            currentQuestionIndex: 0,
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
        const { questions, currentQuestion, nextQuestion, previousQuestion} = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
        this.startTimer();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) => {
        let { currentQuestionIndex } = this.state;
        if(!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex -1];
            var trueAnswer = '';
            var answers = [];

            for(let i = 0; i < currentQuestion.answerSet.length; i++) {
                let checkAnswer = currentQuestion.answerSet[i].isright;
                answers[i] = currentQuestion.answerSet[i].answer;

                if(checkAnswer) {
                    trueAnswer = currentQuestion.answerSet[i].answer;
                }

                // If answer with the biggest id is found in the beginning of the array, it is removed and added to the end of the array.
                // So that the answers will be ordered by their ids and have "true" and "false" answers at the right places.
                if(i == (currentQuestion.answerSet.length - 1) && currentQuestion.answerSet[i].answerid < currentQuestion.answerSet[0].answerid) {
                    answers.shift();
                    answers.push(currentQuestion.answerSet[0].answer);
                }
            }

            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberOfQuestions: questions.length,
                trueAnswer,
                answers,
                previousRandomNumbers: []
            }, () => {
                this.showOptions();
            }); 
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

    handleNextButtonClick = () => {
        this.playButtonSound();
        if(this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };
    
    handlePreviousButtonClick = () => {
        this.playButtonSound();
        if(this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };

    handleQuitButtonClick = () => {
        this.playButtonSound();
        if(window.confirm('Are you sure you want to quit?')) {
            this.props.history.push('/');
        }
    };

    handleButtonClick = (e) => {
        switch(e.target.id) {
            case 'next-button':
                this.handleNextButtonClick();
                break;
            case 'previous-button':
                this.handlePreviousButtonClick();
                break;
            case 'quit-button':
                this.handleQuitButtonClick();
                break;
            default:
                break;
        }
    }

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
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
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
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
        });
    }

    showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));

        options.forEach(option => {
            option.style.visibility = 'visible';
        });
    }

    handleHints = () => {
        if(this.state.hints > 0) {
            const options = Array.from(document.querySelectorAll('.option'));
            let indexOfAnswer;
    
            options.forEach((option, index) => {
                if(option.innerHTML.toLowerCase() === this.state.trueAnswer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });
    
            while (true) {
                const randomNumber = Math.round(Math.random() * 3);
                if(randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if(index === randomNumber) {
                            option.style.visibility = 'hidden';
                            this.setState((prevState) => ({
                                hints: prevState.hints - 1,
                                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                            }));
                        }
                    });
                    break;
                }
                if(this.state.previousRandomNumbers.length >= 3) break;
            }
        }
        
    }

    handleFiftyFifty = () => {
        if(this.state.fiftyFifty > 0) {
            const options = document.querySelectorAll('.option');
            const randomNumbers = [];
            let indexOfAnswer;

            options.forEach((option, index) => {
                if(option.innerHTML.toLowerCase() === this.state.trueAnswer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            let count = 0;
            do {
                const randomNumber = Math.round(Math.random() * 3);
                if(randomNumber !== indexOfAnswer) {
                    if(randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                        randomNumbers.push(randomNumber);
                        count++;
                    } else {
                        while (true) {
                            const newRandomNumber = Math.round(Math.random() * 3);
                            if(newRandomNumber !== indexOfAnswer && !randomNumbers.includes(newRandomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                                randomNumbers.push(newRandomNumber);
                                count++;
                                break;
                            }
                        }
                    }
                }
            } while (count < 2);
            options.forEach((option, index) => {
                if(randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                }
            });
            this.setState(prevState => ({
                fiftyFifty: prevState.fiftyFifty - 1
            }));
        }
    }

    startTimer = () => {
        const countDownTime = Date.now() + 90000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / (1000));

            if (distance < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame();
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

    render () {
        const { 
            currentQuestion,
            currentQuestionIndex,
            numberOfQuestions,
            answers,
            hints,
            fiftyFifty,
            time
        } = this.state;
        
        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <Fragment>
                    <audio ref={this.correctSound} src={correctAnswerSound}></audio>
                    <audio ref={this.wrongSound} src={wrongAnswerSound}></audio>
                    <audio ref={this.buttonSound} src={buttonClickSound}></audio>
                </Fragment>
                <div className='questions'>
                    <h2>Quiz Mode</h2>
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
                            <span className='left'>{currentQuestionIndex + 1} of {numberOfQuestions}</span>
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

                    <div className='button-container'>
                        <button id="previous-button" onClick={this.handleButtonClick}>Previous</button>
                        <button id="next-button" onClick={this.handleButtonClick}>Next</button>
                        <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Play;