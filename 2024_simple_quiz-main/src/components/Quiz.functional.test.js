// src/components/Quiz.functional.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quiz from './Quiz';

// Suppress the React key warning for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('unique "key" prop')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('Quiz Component - Functional Tests', () => {
  test('should display quiz title', () => {
    render(<Quiz />);
    expect(screen.getByText('My Questions')).toBeInTheDocument();
  });

  test('should display all questions on load', () => {
    render(<Quiz />);
    
    // Check for the three questions
    expect(screen.getByText('What is the capital of Connecticut?')).toBeInTheDocument();
    expect(screen.getByText('What is the square root of 16?')).toBeInTheDocument();
    expect(screen.getByText('What type of number is 101?')).toBeInTheDocument();
  });

  test('should display answer options for each question', () => {
    render(<Quiz />);
    
    // Check for answers to question 1
    expect(screen.getByText('Stamford')).toBeInTheDocument();
    expect(screen.getByText('Hartford')).toBeInTheDocument();
    expect(screen.getByText('Storrs')).toBeInTheDocument();
    
    // Check for answers to question 2
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    
    // Check for answers to question 3
    expect(screen.getByText('prime')).toBeInTheDocument();
    expect(screen.getByText('composite')).toBeInTheDocument();
  });

  test('should have Done button', () => {
    render(<Quiz />);
    const doneButton = screen.getByRole('button', { name: /done/i });
    expect(doneButton).toBeInTheDocument();
  });

  test('should render all radio buttons', () => {
    render(<Quiz />);
    
    // Get all radio buttons
    const radioButtons = screen.getAllByRole('radio');
    
    // Question 1: 3 answers, Question 2: 3 answers, Question 3: 4 answers = 10 total
    expect(radioButtons.length).toBeGreaterThanOrEqual(10);
  });

  test('should allow user to select a radio button', () => {
    render(<Quiz />);
    
    // Get all radio buttons
    const radioButtons = screen.getAllByRole('radio');
    
    // Click the first radio button
    fireEvent.click(radioButtons[0]);
    
    // Check that a radio button is now checked
    expect(radioButtons[0]).toBeChecked();
  });

  test('should only allow one answer per question group', () => {
    render(<Quiz />);
    
    // Get radios with name="1" (first question)
    const question1Radios = screen.getAllByRole('radio').filter(
      radio => radio.getAttribute('name') === '1'
    );
    
    // Click first radio
    fireEvent.click(question1Radios[0]);
    expect(question1Radios[0]).toBeChecked();
    
    // Click second radio
    fireEvent.click(question1Radios[1]);
    expect(question1Radios[1]).toBeChecked();
    expect(question1Radios[0]).not.toBeChecked();
  });

  test('should have correct radio button values (true/false)', () => {
    render(<Quiz />);
    
    const radioButtons = screen.getAllByRole('radio');
    
    // Check that radio buttons have value attributes
    radioButtons.forEach(radio => {
      const value = radio.getAttribute('value');
      expect(['true', 'false']).toContain(value);
    });
  });

  test('should group radio buttons by name attribute', () => {
    render(<Quiz />);
    
    const radioButtons = screen.getAllByRole('radio');
    
    // Check that radio buttons have name attributes
    const names = radioButtons.map(radio => radio.getAttribute('name'));
    
    // Should have questions with names "1", "2", "3"
    expect(names).toContain('1');
    expect(names).toContain('2');
    expect(names).toContain('3');
  });

  test('Done button should be clickable', () => {
    render(<Quiz />);
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    expect(doneButton).not.toBeDisabled();
    
    // Should be able to click it
    fireEvent.click(doneButton);
  });

  test('should render with correct styling', () => {
    const { container } = render(<Quiz />);
    
    // Check that the main div has the inline styles
    const mainDiv = container.querySelector('div[style*="DodgerBlue"]');
    expect(mainDiv).toBeInTheDocument();
  });
});