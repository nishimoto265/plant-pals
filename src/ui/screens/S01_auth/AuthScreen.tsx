import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Assuming you use this library for icons

// Import auth service functions
import { 
  submitCredentials, 
  signInWithGoogle, 
  signInWithApple, 
  signInWithGitHub,
  signInAsGuest
} from './auth.service';

// Define the screen params for type safety
type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  PasswordReset: undefined;
  // Add other screens as needed
};

// Typed navigation prop
type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use typed navigation
  const navigation = useNavigation<AuthScreenNavigationProp>();
  // const navigation = useNavigation<AuthScreenNavigationProp>(); // Typed navigation

  const validateEmail = (text: string) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('メールアドレスを入力してください');
      return false;
    } else if (!emailRegex.test(text)) {
      setEmailError('有効なメールアドレスを入力してください');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (text: string) => {
    if (!text) {
      setPasswordError('パスワードを入力してください');
      return false;
    } else if (text.length < 8) {
      setPasswordError('パスワードは8文字以上にしてください');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) validateEmail(text); // Clear error on type if error was present
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) validatePassword(text); // Clear error on type if error was present
  };

  const handleSubmit = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
        const response = await submitCredentials(email, password);
        
        setIsLoading(false);
        
        if (response.success) {
          Alert.alert('成功', response.message, [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Onboarding') 
            }
          ]);
        } else {
          Alert.alert('エラー', response.message);
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert('エラー', '認証中に問題が発生しました。後でもう一度お試しください。');
        console.error('Auth error:', error);
      }
    } else {
      console.log('Validation failed');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await signInWithGoogle();
      setIsLoading(false);
      
      if (response.success) {
        Alert.alert('成功', response.message, [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Onboarding') 
          }
        ]);
      } else {
        Alert.alert('エラー', response.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('エラー', 'Googleログイン中に問題が発生しました。');
      console.error('Google login error:', error);
    }
  };
  
  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await signInWithApple();
      setIsLoading(false);
      
      if (response.success) {
        Alert.alert('成功', response.message, [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Onboarding') 
          }
        ]);
      } else {
        Alert.alert('エラー', response.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('エラー', 'Appleログイン中に問題が発生しました。');
      console.error('Apple login error:', error);
    }
  };
  
  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      const response = await signInWithGitHub();
      setIsLoading(false);
      
      if (response.success) {
        Alert.alert('成功', response.message, [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Onboarding') 
          }
        ]);
      } else {
        Alert.alert('エラー', response.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('エラー', 'GitHubログイン中に問題が発生しました。');
      console.error('GitHub login error:', error);
    }
  };

  const handleGuestMode = async () => {
    setIsLoading(true);
    try {
      const response = await signInAsGuest();
      setIsLoading(false);
      
      if (response.success) {
        navigation.navigate('Onboarding');
      } else {
        Alert.alert('エラー', 'ゲストモードへの切り替えに失敗しました。');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('エラー', 'ゲストモードの処理中に問題が発生しました。');
      console.error('Guest mode error:', error);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2C6E49" />
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          >
          <View style={styles.mainContentContainer}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Image
                // source={require('../../../../assets/images/plant_pals_logo.png')} // Placeholder - adjust path
                source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder
                style={styles.appLogo}
                testID="app-logo"
              />
              <Text style={styles.title} testID="title">アカウント</Text>
              <Text style={styles.subtitle} testID="subtitle">ログインまたは新規登録</Text>
            </View>

            {/* Auth Form Section */}
            <View style={styles.authForm} testID="auth-form">
              <View style={styles.inputContainer} testID="email-input-container">
                <Text style={styles.inputLabel} testID="email-label">メールアドレス</Text>
                <TextInput
                  testID="email-input"
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.textInput, emailError ? styles.inputError : null]}
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                />
                {emailError && <Text style={styles.errorMessage}>{emailError}</Text>}
              </View>

              <View style={styles.inputContainerWithMarginBottom} testID="password-input-container">
                <Text style={styles.inputLabel} testID="password-label">パスワード</Text>
                <TextInput
                  testID="password-input"
                  placeholder="••••••••"
                  secureTextEntry
                  style={[styles.textInput, passwordError ? styles.inputError : null]}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                />
                {passwordError && <Text style={styles.errorMessage}>{passwordError}</Text>}
              </View>

              <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword} testID="forgot-password">
                <Text style={styles.forgotPasswordText} testID="forgot-password-text">
                  パスワードをお忘れですか？
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} testID="submit-button">
                <Text style={styles.submitButtonText} testID="submit-text">ログイン / 登録</Text>
              </TouchableOpacity>
            </View>

            {/* Divider Section */}
            <View style={styles.dividerSection} testID="divider-section">
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>または</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Section */}
            <View style={styles.socialLoginSection} testID="social-login-section">
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin} testID="google-button">
                  <Image
                    // source={require('../../../../assets/icons/google.png')} // Placeholder
                    source={{ uri: 'https://via.placeholder.com/24' }} // Placeholder
                    style={styles.socialIcon}
                    testID="google-icon"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin} testID="apple-button">
                  <Image
                    // source={require('../../../../assets/icons/apple.png')} // Placeholder
                    source={{ uri: 'https://via.placeholder.com/24' }} // Placeholder
                    style={styles.socialIcon}
                    testID="apple-icon"
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleGitHubLogin} testID="github-button">
                  <Image
                    // source={require('../../../../assets/icons/github.png')} // Placeholder
                    source={{ uri: 'https://via.placeholder.com/24' }} // Placeholder
                    style={styles.socialIcon}
                    testID="github-icon"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Guest Mode Section */}
            <View style={styles.guestModeSection} testID="guest-mode-section">
              <TouchableOpacity style={styles.guestButton} onPress={handleGuestMode} testID="guest-button">
                {/* <Icon name="account-outline" style={styles.guestIcon} /> */}
                <Text style={styles.guestIconPlaceholder} testID="guest-icon">[Icon]</Text> 
                <Text style={styles.guestButtonText} testID="guest-text">ゲストモードで続行</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerContainer}>
            <View style={styles.authNotes} testID="auth-notes">
              <Text style={styles.authNotesText} testID="auth-notes-text">
                ※ ゲストモードでは一部機能が制限されます
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2EFEA', // アイボリー
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  mainContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footerContainer: {
    marginBottom: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  appLogo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#2C6E49', // 深緑
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Noto Sans JP',
    fontSize: 14,
    color: '#97BC62', // 若葉
  },
  authForm: {
    width: '100%',
    marginVertical: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputContainerWithMarginBottom: {
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Noto Sans JP',
    fontSize: 14,
    color: '#2C6E49', // 深緑
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#97BC62', // 若葉
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontFamily: 'Noto Sans JP',
    fontSize: 16,
    color: '#333333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: 'Noto Sans JP',
    fontSize: 12,
    color: '#2C6E49', // 深緑
    textDecorationLine: 'underline',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2C6E49', // 深緑
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#97BC62', // 若葉
    opacity: 0.5,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontFamily: 'Noto Sans JP',
    fontSize: 14,
    color: '#97BC62', // 若葉
  },
  socialLoginSection: {
    marginVertical: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  guestModeSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  guestIcon: { // Assuming react-native-vector-icons/MaterialCommunityIcons
    fontSize: 18,
    color: '#97BC62', // 若葉
    marginRight: 8,
  },
  guestIconPlaceholder: { // Placeholder for icon if library not set up
    fontSize: 18,
    color: '#97BC62',
    marginRight: 8,
  },
  guestButtonText: {
    fontFamily: 'Noto Sans JP',
    fontSize: 14,
    color: '#97BC62', // 若葉
  },
  authNotes: {
    marginTop: 16,
  },
  authNotesText: {
    fontFamily: 'Noto Sans JP',
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#EF476F', // Accent color 2 for error, from S01_auth.yaml theme
  },
  errorMessage: {
    fontFamily: 'Noto Sans JP',
    fontSize: 12,
    color: '#EF476F', // Accent color 2 for error
    marginTop: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen; 