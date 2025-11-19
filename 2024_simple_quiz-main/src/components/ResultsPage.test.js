// src/components/Quiz.functional.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quiz from './Quiz';
import ControlScoreCount from '../controller/ControlScoreCount';

// Mock the controller
jest.mock('../controller/ControlScoreCount');

// Mock window.alert
global.alert = jest.fn();

// Mock ResultsPage
jest.mock('./ResultsPage', () => {
  return function MockResultsPage({ score, onRestart }) {
    return (
      <div>
        <h1>Results Page</h1>
        <p>Score: {score}</p>
        <button onClick={onRestart}>Take Quiz Again</button>
      </div>
    );
  };
});

describe('Quiz Component - Functional Tests', () => {
  let mockController;

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert.mockClear();

    mockController = {
      getCurrentScore: jest.fn().mockReturnValue(0),
      updateScore: jest.fn(),
      resetScore: jest.fn(),
      calculatePercentage: jest.fn(),
      getGrade: jest.fn()
    };

    ControlScoreCount.mockImplementation(() => mockController);
  });

  test('should display quiz title', () => {
    render(<Quiz />);
    expect(screen.getByText('My Questions')).toBeInTheDocument();
  });

  test('should display all questions', () => {
    render(<Quiz />);
    
    expect(screen.getByText('What is the capital of Connecticut?')).toBeInTheDocument();
    expect(screen.getByText('What is the square root of 16?')).toBeInTheDocument();
    expect(screen.getByText('What type of number is 101?')).toBeInTheDocument();
  });

  test('should have Done button', () => {
    render(<Quiz />);
    const doneButton = screen.getByRole('button', { name: /done/i });
    expect(doneButton).toBeInTheDocument();
  });

  test('should render all radio buttons', () => {
    render(<Quiz />);
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons.length).toBeGreaterThanOrEqual(10);
  });

  test('should show alert when correct answer is clicked', () => {
    render(<Quiz />);
    
    const radioButtons = screen.getAllByRole('radio');
    const correctAnswer = radioButtons.find(radio => radio.value === 'true');
    
    fireEvent.click(correctAnswer);
    
    expect(global.alert).toHaveBeenCalledWith('You are correct!');
  });

  test('should show alert when incorrect answer is clicked', () => {
    render(<Quiz />);
    
    const radioButtons = screen.getAllByRole('radio');
    const incorrectAnswer = radioButtons.find(radio => radio.value === 'false');
    
    fireEvent.click(incorrectAnswer);
    
    expect(global.alert).toHaveBeenCalledWith('Sorry - not correct');
  });

  test('should track answered questions', () => {
    render(<Quiz />);
    
    const radioButtons = screen.getAllByRole('radio');
    
    // Click first answer
    fireEvent.click(radioButtons[0]);
    
    // Should show 1 question answered
    expect(screen.getByText(/Questions answered: 1 \/ 3/)).toBeInTheDocument();
  });

  test('should update answered count when multiple questions are answered', () => {
    render(<Quiz />);
    
    const radioButtons = screen.getAllByRole('radio');
    
    // Answer question 1
    const q1Answer = radioButtons.find(radio => radio.name === '1');
    fireEvent.click(q1Answer);
    
    // Answer question 2
    const q2Answer = radioButtons.find(radio => radio.name === '2');
    fireEvent.click(q2Answer);
    
    expect(screen.getByText(/Questions answered: 2 \/ 3/)).toBeInTheDocument();
  });

  test('should calculate score on submit', () => {
    mockController.getCurrentScore.mockReturnValue(2);
    
    render(<Quiz />);
    
    // Answer some questions
    const radioButtons = screen.getAllByRole('radio');
    const correctAnswer = radioButtons.find(radio => radio.value === 'true');
    fireEvent.click(correctAnswer);
    
    // Click Done
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);
    
    // Controller should be reset and score calculated
    expect(mockController.resetScore).toHaveBeenCalled();
  });

  test('should show alert with score when Done is clicked', () => {
    mockController.getCurrentScore.mockReturnValue(2);
    
    render(<Quiz />);
    
    const radioButtons = screen.getAllByRole('radio');
    fireEvent.click(radioButtons[0]);
    fireEvent.click(radioButtons[3]);
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);
    
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Total score:'));
  });

  test('should navigate to results page after clicking Done', async () => {
    mockController.getCurrentScore.mockReturnValue(2);
    
    render(<Quiz />);
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);
    
    await waitFor(() => {
      expect(screen.getByText('Results Page')).toBeInTheDocument();
    });
  });

  test('should pass score to results page', async () => {
    mockController.getCurrentScore.mockReturnValue(3);
    
    render(<Quiz />);
    
    // Answer all correctly
    const radioButtons = screen.getAllByRole('radio');
    const correct1 = radioButtons.find(radio => radio.name === '1' && radio.value === 'true');
    const correct2 = radioButtons.find(radio => radio.name === '2' && radio.value === 'true');
    const correct3 = radioButtons.find(radio => radio.name === '3' && radio.value === 'true');
    
    fireEvent.click(correct1);
    fireEvent.click(correct2);
    fireEvent.click(correct3);
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Score: 3/)).toBeInTheDocument();
    });
  });

  test('should reset quiz when restart button is clicked', async () => {
    mockController.getCurrentScore.mockReturnValue(2);
    
    render(<Quiz />);
    
    // Complete quiz
    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);
    
    // Wait for results page
    await waitFor(() => {
      expect(screen.getByText('Results Page')).toBeInTheDocument();
    });
    
    // Click restart
    const restartButton = screen.getByRole('button', { name: /Take Quiz Again/i });
    fireEvent.click(restartButton);
    
    // Should show quiz again
    await waitFor(() => {
      expect(screen.getByText('My Questions')).toBeInTheDocument();
    });
    
    expect(mockController.resetScore).toHaveBeenCalledTimes(2); // Once on submit, once on restart
  });

  test('should group radio buttons by question', () => {
    render(<Quiz />);
    
    const radioButtons = screen.getAllByRole('radio');
    const names = radioButtons.map(radio => radio.getAttribute('name'));
    
    expect(names).toContain('1');
    expect(names).toContain('2');
    expect(names).toContain('3');
  });

  test('should show questions answered progress', () => {
    render(<Quiz />);
    
    // Initially 0/3
    expect(screen.getByText(/Questions answered: 0 \/ 3/)).toBeInTheDocument();
    
    // Answer one question
    const radioButtons = screen.getAllByRole('radio');
    fireEvent.click(radioButtons[0]);
    
    expect(screen.getByText(/Questions answered: 1 \/ 3/)).toBeInTheDocument();
  });
});

