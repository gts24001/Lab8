// src/controller/ControlScoreCount.test.js
import ControlScoreCount from './ControlScoreCount';
import MyState from '../model/MyState';

// Mock the MyState module
jest.mock('../model/MyState');

describe('ControlScoreCount', () => {
  let controller;
  let mockMyState;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create mock MyState instance
    mockMyState = {
      getScore: jest.fn(),
      setScore: jest.fn()
    };
    
    MyState.getInstance = jest.fn(() => mockMyState);
    
    // Create new controller instance
    controller = new ControlScoreCount();
  });

  describe('calculateQuestionScore', () => {
    test('should return 1 for correct answer', () => {
      const score = controller.calculateQuestionScore('A', 'A');
      expect(score).toBe(1);
    });

    test('should return 0 for incorrect answer', () => {
      const score = controller.calculateQuestionScore('A', 'B');
      expect(score).toBe(0);
    });

    test('should be case-sensitive', () => {
      const score = controller.calculateQuestionScore('a', 'A');
      expect(score).toBe(0);
    });
  });

  describe('updateScore', () => {
    test('should add points to current score', () => {
      mockMyState.getScore.mockReturnValue(5);
      
      controller.updateScore(3);
      
      expect(mockMyState.getScore).toHaveBeenCalled();
      expect(mockMyState.setScore).toHaveBeenCalledWith(8);
    });

    test('should handle zero current score', () => {
      mockMyState.getScore.mockReturnValue(0);
      
      controller.updateScore(1);
      
      expect(mockMyState.setScore).toHaveBeenCalledWith(1);
    });
  });

  describe('getCurrentScore', () => {
    test('should return current score from state', () => {
      mockMyState.getScore.mockReturnValue(7);
      
      const score = controller.getCurrentScore();
      
      expect(score).toBe(7);
      expect(mockMyState.getScore).toHaveBeenCalled();
    });
  });

  describe('resetScore', () => {
    test('should set score to 0', () => {
      controller.resetScore();
      
      expect(mockMyState.setScore).toHaveBeenCalledWith(0);
    });
  });

  describe('calculatePercentage', () => {
    test('should calculate correct percentage', () => {
      mockMyState.getScore.mockReturnValue(8);
      
      const percentage = controller.calculatePercentage(10);
      
      expect(percentage).toBe(80);
    });

    test('should return 0 for zero total questions', () => {
      mockMyState.getScore.mockReturnValue(5);
      
      const percentage = controller.calculatePercentage(0);
      
      expect(percentage).toBe(0);
    });

    test('should round to nearest integer', () => {
      mockMyState.getScore.mockReturnValue(2);
      
      const percentage = controller.calculatePercentage(3);
      
      expect(percentage).toBe(67); // 66.666... rounded to 67
    });
  });

  describe('getGrade', () => {
    test('should return A for 90-100%', () => {
      expect(controller.getGrade(100)).toBe('A');
      expect(controller.getGrade(90)).toBe('A');
    });

    test('should return B for 80-89%', () => {
      expect(controller.getGrade(89)).toBe('B');
      expect(controller.getGrade(80)).toBe('B');
    });

    test('should return C for 70-79%', () => {
      expect(controller.getGrade(79)).toBe('C');
      expect(controller.getGrade(70)).toBe('C');
    });

    test('should return D for 60-69%', () => {
      expect(controller.getGrade(69)).toBe('D');
      expect(controller.getGrade(60)).toBe('D');
    });

    test('should return F for below 60%', () => {
      expect(controller.getGrade(59)).toBe('F');
      expect(controller.getGrade(0)).toBe('F');
    });
  });

  describe('submitAnswer', () => {
    test('should return correct result for correct answer', () => {
      mockMyState.getScore.mockReturnValue(5);
      
      const result = controller.submitAnswer('A', 'A');
      
      expect(result).toEqual({
        points: 1,
        isCorrect: true,
        currentScore: 5
      });
      expect(mockMyState.setScore).toHaveBeenCalledWith(6);
    });

    test('should return correct result for incorrect answer', () => {
      mockMyState.getScore.mockReturnValue(3);
      
      const result = controller.submitAnswer('B', 'A');
      
      expect(result).toEqual({
        points: 0,
        isCorrect: false,
        currentScore: 3
      });
      expect(mockMyState.setScore).toHaveBeenCalledWith(3);
    });
  });
});
