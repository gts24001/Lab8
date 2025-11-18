// src/controller/ControlScoreCount.js
import MyState from '../model/MyState';

class ControlScoreCount {
  constructor() {
    this.myState = MyState.getInstance();
  }

  /**
   * Calculate score for a single question
   * @param {string} userAnswer - The user's selected answer
   * @param {string} correctAnswer - The correct answer
   * @returns {number} - Points earned (1 for correct, 0 for incorrect)
   */
  calculateQuestionScore(userAnswer, correctAnswer) {
    return userAnswer === correctAnswer ? 1 : 0;
  }

  /**
   * Update the total score in state
   * @param {number} points - Points to add to current score
   */
  updateScore(points) {
    const currentScore = this.myState.getScore();
    this.myState.setScore(currentScore + points);
  }

  /**
   * Get current score from state
   * @returns {number} - Current score
   */
  getCurrentScore() {
    return this.myState.getScore();
  }

  /**
   * Reset score to zero
   */
  resetScore() {
    this.myState.setScore(0);
  }

  /**
   * Calculate percentage score
   * @param {number} totalQuestions - Total number of questions
   * @returns {number} - Percentage score (0-100)
   */
  calculatePercentage(totalQuestions) {
    if (totalQuestions === 0) return 0;
    const currentScore = this.getCurrentScore();
    return Math.round((currentScore / totalQuestions) * 100);
  }

  /**
   * Get grade based on percentage
   * @param {number} percentage - Score percentage
   * @returns {string} - Letter grade
   */
  getGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  /**
   * Process answer submission and update score
   * @param {string} userAnswer - User's selected answer
   * @param {string} correctAnswer - Correct answer
   * @returns {object} - Result object with points and isCorrect
   */
  submitAnswer(userAnswer, correctAnswer) {
    const points = this.calculateQuestionScore(userAnswer, correctAnswer);
    this.updateScore(points);
    
    return {
      points,
      isCorrect: points === 1,
      currentScore: this.getCurrentScore()
    };
  }
}

export default ControlScoreCount;