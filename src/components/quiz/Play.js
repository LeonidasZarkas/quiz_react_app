import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';

import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';

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
            usedFiftyFifty: false,
            usedHints: false,
            time: {}
        }
    }

    componentDidMount() {
        const { questions, currentQuestion, nextQuestion, previousQuestion} = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
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
            }

            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                trueAnswer,
                answers
            }) 
        }
    };

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.trueAnswer.toLowerCase()) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        }
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

    render () {
        const { currentQuestion } = this.state;
        const { trueAnswer } = this.state;
        const { answers } = this.state;
        
        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <div className='questions'>
                    <h2>Quiz Mode</h2>
                    <div className='lifeline-container'>
                        <p>
                            <span className='mdi mdi-set-center mdi-24px lifeline-icon'></span><span className='lifeline'>1</span>
                        </p>
                        <p>
                            <span className='mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon'></span><span className='lifeline'>1</span>
                        </p>
                    </div>
                    <div className='timer-container'>
                        <p>
                            <span className='left'>1 of 15</span>
                            <span className='right'>2:15<span className='mdi mdi-clock-outline mdi-24px'></span></span>
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
                        <button>Previous</button>
                        <button>Next</button>
                        <button>Quit</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Play;