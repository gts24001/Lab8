/* import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/ 


// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

// Suppress the React key warning for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && 
        (args[0].includes('unique "key" prop') || 
         args[0].includes('ReactDOMTestUtils.act'))) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

test('renders quiz component', () => {
  render(<App />);
  // Check for the quiz title
  const titleElement = screen.getByText(/My Questions/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders Done button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /done/i });
  expect(buttonElement).toBeInTheDocument();
});

test('renders all questions in the quiz', () => {
  render(<App />);
  
  // Check that questions are rendered
  expect(screen.getByText('What is the capital of Connecticut?')).toBeInTheDocument();
  expect(screen.getByText('What is the square root of 16?')).toBeInTheDocument();
  expect(screen.getByText('What type of number is 101?')).toBeInTheDocument();
});