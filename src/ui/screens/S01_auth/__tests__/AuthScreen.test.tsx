import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AuthScreen from '../AuthScreen';

// Mock assets
jest.mock('react-native/Libraries/Image/Image', () => ({
  ...jest.requireActual('react-native/Libraries/Image/Image'),
  resolveAssetSource: jest.fn((source) => source),
}));

// Mock auth service
jest.mock('../auth.service', () => ({
  submitCredentials: jest.fn(() => Promise.resolve({ success: true, message: 'ログイン成功' })),
  signInWithGoogle: jest.fn(() => Promise.resolve({ success: true, message: 'Google認証成功' })),
  signInWithApple: jest.fn(() => Promise.resolve({ success: true, message: 'Apple認証成功' })),
  signInWithGitHub: jest.fn(() => Promise.resolve({ success: true, message: 'GitHub認証成功' })),
  signInAsGuest: jest.fn(() => Promise.resolve({ success: true, message: 'ゲストモード成功' })),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('AuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Snapshot Tests', () => {
    it('should render correctly by default', () => {
      const { toJSON } = render(<AuthScreen />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Input Field Tests', () => {
    it('should update email input when text is entered', () => {
      const { getByTestId } = render(<AuthScreen />);
      const emailInput = getByTestId('email-input');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      
      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should update password input when text is entered', () => {
      const { getByTestId } = render(<AuthScreen />);
      const passwordInput = getByTestId('password-input');
      
      fireEvent.changeText(passwordInput, 'password123');
      
      expect(passwordInput.props.value).toBe('password123');
    });

    it('should display error when invalid email format is entered', () => {
      const { getByTestId, queryByText } = render(<AuthScreen />);
      const emailInput = getByTestId('email-input');
      
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');
      
      expect(queryByText('有効なメールアドレスを入力してください')).toBeTruthy();
    });

    it('should display error when password is too short', () => {
      const { getByTestId, queryByText } = render(<AuthScreen />);
      const passwordInput = getByTestId('password-input');
      
      fireEvent.changeText(passwordInput, 'short');
      fireEvent(passwordInput, 'blur');
      
      expect(queryByText('パスワードは8文字以上にしてください')).toBeTruthy();
    });
  });

  describe('Button Interaction Tests', () => {
    it('should call submitCredentials when login/signup button is pressed with valid inputs', async () => {
      const { getByTestId } = render(<AuthScreen />);
      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const submitButton = getByTestId('submit-button');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);
      
      // Wait for async operations
      await waitFor(() => {
        const authService = require('../auth.service');
        expect(authService.submitCredentials).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should call signInAsGuest when guest mode button is pressed', async () => {
      const { getByTestId } = render(<AuthScreen />);
      const guestButton = getByTestId('guest-button');
      
      fireEvent.press(guestButton);
      
      // Wait for async operations
      await waitFor(() => {
        const authService = require('../auth.service');
        expect(authService.signInAsGuest).toHaveBeenCalled();
      });
    });

    it('should navigate to PasswordReset when forgot password is pressed', () => {
      const { getByTestId } = render(<AuthScreen />);
      const forgotPasswordButton = getByTestId('forgot-password');
      
      fireEvent.press(forgotPasswordButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('PasswordReset');
    });

    it('should navigate to Onboarding after successful login', async () => {
      const { getByTestId } = render(<AuthScreen />);
      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const submitButton = getByTestId('submit-button');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);
      
      // Simulate alert callback
      const Alert = require('react-native/Libraries/Alert/Alert');
      const alertCallback = Alert.alert.mock.calls[0][2][0].onPress;
      alertCallback();
      
      expect(mockNavigate).toHaveBeenCalledWith('Onboarding');
    });
  });

  describe('Social Login Tests', () => {
    it('should call signInWithGoogle when Google button is pressed', async () => {
      const { getByTestId } = render(<AuthScreen />);
      const googleButton = getByTestId('google-button');
      
      fireEvent.press(googleButton);
      
      // Wait for async operations
      await waitFor(() => {
        const authService = require('../auth.service');
        expect(authService.signInWithGoogle).toHaveBeenCalled();
      });
    });

    it('should call signInWithApple when Apple button is pressed', async () => {
      const { getByTestId } = render(<AuthScreen />);
      const appleButton = getByTestId('apple-button');
      
      fireEvent.press(appleButton);
      
      // Wait for async operations
      await waitFor(() => {
        const authService = require('../auth.service');
        expect(authService.signInWithApple).toHaveBeenCalled();
      });
    });

    it('should call signInWithGitHub when GitHub button is pressed', async () => {
      const { getByTestId } = render(<AuthScreen />);
      const githubButton = getByTestId('github-button');
      
      fireEvent.press(githubButton);
      
      // Wait for async operations
      await waitFor(() => {
        const authService = require('../auth.service');
        expect(authService.signInWithGitHub).toHaveBeenCalled();
      });
    });
  });
}); 