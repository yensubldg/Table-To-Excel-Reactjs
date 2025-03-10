// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Mock window.btoa for tests
if (typeof window.btoa === 'undefined') {
  Object.defineProperty(window, 'btoa', {
    value: str => Buffer.from(str, 'binary').toString('base64'),
  });
}

// Mock window.URL.createObjectURL
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: jest.fn(),
  });
}
