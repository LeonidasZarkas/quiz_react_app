import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';

import options from '../../assets/img/instructions_options.png';

const QuizInstructions = () => (
    <Fragment>
        <Helmet><title>Quiz App - Instructions</title></Helmet>
        <div className='instructions container'>
            <h1>How to Play the Game</h1>
            <p>Ensure you read this guide from start to finish.</p>
            <ul className='browser-default' id='main-list'>
                <li>The game has a duration of 15 minutes and ends as soon as your time elapses.</li>
                <li>Each game consists of 15 questions.</li>
                <li>
                    Every question contains 4 options.
                    <img src={'../../assets/img/instructions_options.png'} alt="Quiz App options example"/>
                </li>
                <li>
                    Select the option which best answers the question by clicking (or selecting) it.
                    <img src={'../../assets/img/instructions_answer.png'} alt="Quiz App answer example"/>
                </li>
                <li>
                    Each game has 2 lifelines namely:
                    <ul id='sublist'>
                        <li>1 50-50 chance</li>
                        <li>1 Hint</li>
                    </ul>
                </li>
                <li>
                    Selecting a 50-50 lifeline by clicking the icon
                    <span className='mdi mdi-set-center mdi-24px lifeline-icon'></span>
                    will remove 2 wrong answers, leaving the correct answer and one wrong answer
                    <img src={'../../assets/img/instructions_50-50.png'} alt="Quiz App Fifty-Fifty example"/>
                </li>
                <li>
                    Using a hint by clickingthe icon
                    <span className='mdi mdi-lightbulb-on mdi-24px lifeline-icon'></span>
                    will remove one wrong answer leaving two wrong answers and one correct answer.
                    <img src={'../../assets/img/instructions_hint.png'} alt="Quiz App hint example"/>
                </li>
                <li>Feel free to quit (or retire from) the game at any time. In that case your score will be revealed afterwards</li>
                <li>The timer starts as soon as the game loads</li>
                <li> Let's do this if you think you've got what it takes?</li>
            </ul>
            <div>
                <span className='left'><Link to="/">No take me back</Link></span>
                <span className='right'><Link to="/play/quiz">Okay, Let's do this!</Link></span>
            </div>
        </div>
    </Fragment>
);

export default QuizInstructions;