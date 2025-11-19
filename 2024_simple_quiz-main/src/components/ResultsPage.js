// src/components/ResultsPage.js - Accept score as prop
import React, { Component } from 'react';
import ControlScoreCount from '../controller/ControlScoreCount';

class ResultsPage extends Component {
  constructor(props) {
    super(props);
    this.controller = new ControlScoreCount();
  }

  render() {
    const { score, totalQuestions, onRestart } = this.props;
    
    // Use the passed score, not the controller's score
    const percentage = this.controller.calculatePercentage(totalQuestions);
    const grade = this.controller.getGrade(percentage);
    
    // Calculate percentage based on passed score
    const actualPercentage = Math.round((score / totalQuestions) * 100);
    const actualGrade = this.controller.getGrade(actualPercentage);

    return (
      <div style={{
        color: 'white',
        backgroundColor: 'DodgerBlue',
        padding: '40px',
        fontFamily: 'Sans-Serif',
        textAlign: 'center',
        minHeight: '100vh'
      }}>
        <h1>Quiz Complete! 🎉</h1>
        
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '10px',
          margin: '20px auto',
          maxWidth: '500px'
        }}>
          <h2>Your Results</h2>
          
          <div style={{ fontSize: '24px', margin: '20px 0' }}>
            <p><strong>Score:</strong> {score} / {totalQuestions}</p>
            <p><strong>Percentage:</strong> {actualPercentage}%</p>
            <p><strong>Grade:</strong> <span style={{ fontSize: '48px', fontWeight: 'bold' }}>{actualGrade}</span></p>
          </div>

          <div style={{ margin: '30px 0' }}>
            {actualPercentage >= 90 && <p>🌟 Excellent work! You're a star!</p>}
            {actualPercentage >= 70 && actualPercentage < 90 && <p>👍 Good job! Keep it up!</p>}
            {actualPercentage >= 50 && actualPercentage < 70 && <p>📚 Not bad! A little more study will help.</p>}
            {actualPercentage < 50 && <p>💪 Keep practicing! You'll get there!</p>}
          </div>

          <button 
            onClick={onRestart}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: 'white',
              color: 'DodgerBlue',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }
}

export default ResultsPage;
/*

// src/components/ResultsPage.js
import React, { Component } from 'react';
import ControlScoreCount from '../controller/ControlScoreCount';

class ResultsPage extends Component {
  constructor(props) {
    super(props);
    this.controller = new ControlScoreCount();
  }

  render() {
    const { totalQuestions, onRestart } = this.props;
    const score = this.controller.getCurrentScore();
    const percentage = this.controller.calculatePercentage(totalQuestions);
    const grade = this.controller.getGrade(percentage);

    return (
      <div style={{
        color: 'white',
        backgroundColor: 'DodgerBlue',
        padding: '40px',
        fontFamily: 'Sans-Serif',
        textAlign: 'center',
        minHeight: '100vh'
      }}>
        <h1>Quiz Complete! 🎉</h1>
        
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '10px',
          margin: '20px auto',
          maxWidth: '500px'
        }}>
          <h2>Your Results</h2>
          
          <div style={{ fontSize: '24px', margin: '20px 0' }}>
            <p><strong>Score:</strong> {score} / {totalQuestions}</p>
            <p><strong>Percentage:</strong> {percentage}%</p>
            <p><strong>Grade:</strong> <span style={{ fontSize: '48px', fontWeight: 'bold' }}>{grade}</span></p>
          </div>

          <div style={{ margin: '30px 0' }}>
            {percentage >= 90 && <p>🌟 Excellent work! You're a star!</p>}
            {percentage >= 70 && percentage < 90 && <p>👍 Good job! Keep it up!</p>}
            {percentage >= 50 && percentage < 70 && <p>📚 Not bad! A little more study will help.</p>}
            {percentage < 50 && <p>💪 Keep practicing! You'll get there!</p>}
          </div>

          <button 
            onClick={onRestart}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: 'white',
              color: 'DodgerBlue',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }
}

export default ResultsPage;

*/