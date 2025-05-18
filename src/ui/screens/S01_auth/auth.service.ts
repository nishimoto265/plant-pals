/**
 * Auth Service - Handles authentication related operations
 * 
 * This is a simple mock implementation for development and testing
 * In a real app, this would connect to an actual authentication service
 */

// Mock user database
const mockUsers = [
  { email: 'test@example.com', password: 'password123' },
  { email: 'user@example.com', password: 'securepass' },
];

/**
 * Submit credentials for login or signup
 */
export const submitCredentials = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user exists (login attempt)
  const existingUser = mockUsers.find(user => user.email === email);
  
  if (existingUser) {
    // Login flow
    if (existingUser.password === password) {
      return { success: true, message: 'ログインに成功しました。' };
    } else {
      return { success: false, message: 'パスワードが間違っています。' };
    }
  } else {
    // Signup flow - In real app would create user in database
    mockUsers.push({ email, password });
    return { success: true, message: '新規アカウントが作成されました。' };
  }
};

/**
 * Social login handlers
 */
export const signInWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Googleで認証しました。' };
};

export const signInWithApple = async (): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Appleで認証しました。' };
};

export const signInWithGitHub = async (): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'GitHubで認証しました。' };
};

/**
 * Guest mode sign in
 */
export const signInAsGuest = async (): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'ゲストモードで続行します。' };
};

/**
 * Password reset request
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    return { success: true, message: 'パスワードリセット手順をメールで送信しました。' };
  } else {
    return { success: false, message: 'メールアドレスが見つかりません。' };
  }
}; 