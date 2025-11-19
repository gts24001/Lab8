 
 // src/components/Quiz.js - Pass score to ResultsPage
import React from 'react';
import quizPageStyle from '../QuizPageStyle';
import my_questions from '../model/basic_questions.json';
import ControlScoreCount from '../controller/ControlScoreCount';
import ResultsPage from './ResultsPage';

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answeredQuestions: {}, // Track which questions have been answered and their correctness
            showResults: false,
            finalScore: 0
        };
        this.controller = new ControlScoreCount();
    }

    handleAnswerClick = (questionId, isCorrect) => {
        // Update the answered questions tracker
        this.setState({
            answeredQuestions: {
                ...this.state.answeredQuestions,
                [questionId]: isCorrect
            }
        });

        // Show feedback
        if (isCorrect) {
            alert("You are correct!");
        } else {
            alert("Sorry - not correct");
        }
    };

    handleSubmit = () => {
        // Reset score and calculate based on all answers
        this.controller.resetScore();
        
        // Count correct answers
        Object.values(this.state.answeredQuestions).forEach(isCorrect => {
            if (isCorrect) {
                this.controller.updateScore(1);
            }
        });

        const score = this.controller.getCurrentScore();
        const totalAnswered = Object.keys(this.state.answeredQuestions).length;
        
        alert("Total score: " + score + "/" + totalAnswered);
        
        // Show results page with the final score
        this.setState({ 
            showResults: true,
            finalScore: score
        });
    }

    handleRestart = () => {
        this.controller.resetScore();
        this.setState({
            answeredQuestions: {},
            showResults: false,
            finalScore: 0
        });
    }

    render() {
        // Show results page if quiz is complete
        if (this.state.showResults) {
            return (
                <ResultsPage 
                    score={this.state.finalScore}
                    totalQuestions={my_questions.length}
                    onRestart={this.handleRestart}
                />
            );
        }

        // Show quiz
        return (
            <div style={quizPageStyle}>
                <h1>My Questions</h1>
                {my_questions.map((quest) => (
                    <div key={quest["id"]}> 
                        <h2>{quest["question"]}</h2>
                        {quest["answers"].map((ans, index) => (
                            <div key={index}>
                                <label>
                                    <input  
                                        type="radio"
                                        name={quest["id"]}
                                        onClick={() => this.handleAnswerClick(quest["id"], ans["isCorrect"])}
                                        value={ans["isCorrect"]} 
                                    /> 
                                    {ans["answer"]}
                                </label> 
                                <br />
                            </div>
                        ))}
                    </div>
                ))}
                <br />
                <button onClick={this.handleSubmit}>Done</button>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    Questions answered: {Object.keys(this.state.answeredQuestions).length} / {my_questions.length}
                </p>
            </div>
        );
    }
}

export default Quiz;
 
 
 
 /*
 // src/components/Quiz.js - Fixed to track answers properly
import React from 'react';
import quizPageStyle from '../QuizPageStyle';
import my_questions from '../model/basic_questions.json';
import ControlScoreCount from '../controller/ControlScoreCount';
import ResultsPage from './ResultsPage';

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answeredQuestions: {}, // Track which questions have been answered and their correctness
            showResults: false
        };
        this.controller = new ControlScoreCount();
    }

    handleAnswerClick = (questionId, isCorrect) => {
        // Only count the answer if this question hasn't been answered yet
        // or if the previous answer was different
        const previousAnswer = this.state.answeredQuestions[questionId];
        
        // Update the answered questions tracker
        this.setState({
            answeredQuestions: {
                ...this.state.answeredQuestions,
                [questionId]: isCorrect
            }
        });

        // Show feedback
        if (isCorrect) {
            alert("You are correct!");
        } else {
            alert("Sorry - not correct");
        }
    };

    handleSubmit = () => {
        // Reset score and calculate based on all answers
        this.controller.resetScore();
        
        // Count correct answers
        Object.values(this.state.answeredQuestions).forEach(isCorrect => {
            if (isCorrect) {
                this.controller.updateScore(1);
            }
        });

        const score = this.controller.getCurrentScore();
        const totalAnswered = Object.keys(this.state.answeredQuestions).length;
        
        alert("Total score: " + score + "/" + totalAnswered);
        
        // Show results page
        this.setState({ showResults: true });
    }

    handleRestart = () => {
        this.controller.resetScore();
        this.setState({
            answeredQuestions: {},
            showResults: false
        });
    }

    render() {
        // Show results page if quiz is complete
        if (this.state.showResults) {
            return (
                <ResultsPage 
                    totalQuestions={my_questions.length}
                    onRestart={this.handleRestart}
                />
            );
        }

        // Show quiz
        return (
            <div style={quizPageStyle}>
                <h1>My Questions</h1>
                {my_questions.map((quest) => (
                    <div key={quest["id"]}> 
                        <h2>{quest["question"]}</h2>
                        {quest["answers"].map((ans, index) => (
                            <div key={index}>
                                <label>
                                    <input  
                                        type="radio"
                                        name={quest["id"]}
                                        onClick={() => this.handleAnswerClick(quest["id"], ans["isCorrect"])}
                                        value={ans["isCorrect"]} 
                                    /> 
                                    {ans["answer"]}
                                </label> 
                                <br />
                            </div>
                        ))}
                    </div>
                ))}
                <br />
                <button onClick={this.handleSubmit}>Done</button>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    Questions answered: {Object.keys(this.state.answeredQuestions).length} / {my_questions.length}
                </p>
            </div>
        );
    }
}

export default Quiz; */
/*

// ../src/components/Quiz.js - Refactored to use ControlScoreCount
import React from 'react';
import quizPageStyle from '../QuizPageStyle';
import my_questions from '../model/basic_questions.json';
import ControlScoreCount from '../controller/ControlScoreCount';
import ResultsPage from './ResultsPage';

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            showResults: false
        };
        this.controller = new ControlScoreCount();
    }

    incrementScore = () => {
        this.setState({
            count: this.state.count + 1
        });
        this.controller.updateScore(1);
        alert("You are correct!");
    };

    dontIncrementScore = () => {
        this.setState({
            count: this.state.count + 1
        });
        this.controller.updateScore(0);
        alert("Sorry - not correct");
    };

    handleSubmit = () => {
        const score = this.controller.getCurrentScore();
        alert("Total score: " + score + "/" + this.state.count);
        // Show results page
        this.setState({ showResults: true });
    }

    handleRestart = () => {
        this.controller.resetScore();
        this.setState({
            count: 0,
            showResults: false
        });
    }

    render() {
        // Show results page if quiz is complete
        if (this.state.showResults) {
            return (
                <ResultsPage 
                    totalQuestions={my_questions.length}
                    onRestart={this.handleRestart}
                />
            );
        }

        // Show quiz
        return (
            <div style={quizPageStyle}>
                <h1>My Questions</h1>
                {my_questions.map((quest) => (
                    <div key={quest["id"]}> 
                        <h2>{quest["question"]}</h2>
                        {quest["answers"].map((ans, index) => (
                            <div key={index}>
                                <label>
                                    <input  
                                        type="radio"
                                        name={quest["id"]}
                                        onClick={ans["isCorrect"] ? this.incrementScore : this.dontIncrementScore}
                                        value={ans["isCorrect"]} 
                                    /> 
                                    {ans["answer"]}
                                </label> 
                                <br />
                            </div>
                        ))}
                    </div>
                ))}
                <br />
                <button onClick={this.handleSubmit}>Done</button>
            </div>
        );
    }
}

export default Quiz;
*/

/*

// ../src/components/Quiz.js

import React from 'react';
import quizPageStyle from '../QuizPageStyle';

import my_state from './my_state';

import  my_questions from '../model/basic_questions.json';


class Quiz extends React.Component {

    state = {
        score: 0,
        count: 0
    };
    
    incrementScore = () => {
        this.setState({
            score: this.state.score + 1
        });
        this.setState({
            count: this.state.count + 1
        });
        alert("You are correct!"); // could be executed before the setStates are done!
    };

    dontIncrementScore = () => {
       this.setState({
            count: this.state.count + 1
        });
        alert("Sorry - not correct");
    };

    handleSubmit = () => {
        my_state.my_score = this.state.score;
        my_state.my_count = this.state.count;
        
        alert("Total score: " + this.state.score + "/" + this.state.count);
    }
    
    render() {
        return(
           <div style={quizPageStyle}>
            <h1>My Questions</h1>
                {my_questions.map((quest) => (
                <div> 
                    <h2>{quest["question"]}</h2>
                        {quest["answers"].map((ans) => (
                            <div>
                                <label>
                                <input  
                                        type = "radio"
                                        name = { quest["id"] }
                                        key = { quest["id"] }
                                        onClick = { ans["isCorrect"] ? this.incrementScore : this.dontIncrementScore }
                                        value = { ans["isCorrect"] } /> 
                                    { ans["answer"] }
                                </label> 
                                <br />
                            </div>
                        ))}
                    
                </div>
                ))}
                 <br />
                <button onClick={this.handleSubmit} >Done</button>
        </div>
        );
    }
}

export default Quiz;
*/