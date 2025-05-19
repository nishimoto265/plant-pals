import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
  Easing,
} from 'react-native';
// import LottieView from 'lottie-react-native'; // アセットがないためコメントアウト
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // 追加
import { RootStackParamList } from '../../../../App'; // App.tsxから型をインポート

// Assuming LocalePicker is a custom component.
// For now, a placeholder implementation.
// import LocalePicker from '../../components/LocalePicker'; // Adjust path as needed

interface LocalePickerOption {
  value: string;
  label: string;
}

interface LocalePickerPlaceholderProps {
  style?: any; // ViewStyle や TextStyle を適切に。ひとまずany
  options: LocalePickerOption[];
  defaultValue: string;
  onValueChange?: (value: string) => void;
  testID?: string; // testID を追加
}

const LocalePickerPlaceholder = ({ style, options, defaultValue, onValueChange, testID }: LocalePickerPlaceholderProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  return (
    <View style={[style, styles.localePickerPlaceholder]} testID={testID}>
      {options.map((option: LocalePickerOption) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.localeOption,
            selectedValue === option.value && styles.localeOptionSelected,
          ]}
          onPress={() => {
            setSelectedValue(option.value);
            if (onValueChange) {
              onValueChange(option.value);
            }
          }}
        >
          <Text
            style={[
              styles.localeOptionText,
              selectedValue === option.value && styles.localeOptionTextSelected,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


// Theme and constants based on YAML
const theme = {
  colors: {
    primary: "#2C6E49",    // 深緑
    secondary: "#97BC62",  // 若葉
    background: "#F2EFEA", // アイボリー
    accent1: "#FFD166",
    accent2: "#EF476F",
    textOnPrimary: "#F2EFEA",
  },
  typography: {
    heading: "Poppins-SemiBold",
    body: "Noto Sans JP", // Make sure Noto Sans JP is linked if using custom fonts
  },
};

const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // 型を指定

  const [welcomeElementsVisible, setWelcomeElementsVisible] = useState(false);

  // Animations
  const logoAnim = useRef(new Animated.Value(0)).current; // opacity and scale
  const titleAnim = useRef(new Animated.Value(0)).current; // opacity and y
  const messageAnim = useRef(new Animated.Value(0)).current; // opacity
  const languageSelectorAnim = useRef(new Animated.Value(0)).current; // opacity and y
  const startButtonAnim = useRef(new Animated.Value(0)).current; // opacity

  useEffect(() => {
    // Initial logo animation
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [logoAnim]);

  const showWelcomeTextAndControls = () => {
    setWelcomeElementsVisible(true);
    Animated.stagger(300, [
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(messageAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(languageSelectorAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(startButtonAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const handleAnimationFinish = () => {
    // As per YAML: onAnimationFinish: "showWelcomeText"
    // The YAML implies cascading animations.
    // Some elements are set to animate after a delay, which is handled by stagger here.
    showWelcomeTextAndControls();
  };

  const navigateToAuth = () => { // 関数名を navigateToAuth に変更
    // As per YAML: onPress: "navigateToOnboarding"
    navigation.navigate('Auth'); // Assuming 'Auth' is a valid route name
  };

  const logoScale = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const titleTranslateY = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });
  
  const languageSelectorTranslateY = languageSelectorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <ImageBackground
        source={require('../../../../assets/images/welcome_bg_pattern.png')} // Adjust path as per your project structure
        style={styles.backgroundImage}
        resizeMode="cover"
      > */}
        <View style={styles.container}>
          <View style={styles.headerContainer} testID="header-container">
            <Animated.View style={{ opacity: logoAnim, transform: [{ scale: logoScale }] }}>
              {/* <LottieView
                testID="app-logo-animation"
                source={require('../../../../assets/animations/plant_pals_logo.json')} // Adjust path
                style={styles.lottieLogo}
                autoPlay
                loop={false}
                speed={0.8}
                onAnimationFinish={handleAnimationFinish}
              /> */}
              <Text style={{textAlign: 'center', fontSize: 20, marginVertical: 20}}>PlantPals Logo (Placeholder)</Text>
            </Animated.View>
          </View>

          {/* Welcome Content - Animated based on Lottie finish or delays */}
          <Animated.View style={[styles.welcomeContent, { opacity: titleAnim, transform: [{ translateY: titleTranslateY }] }]} testID="welcome-content">
            <Text style={styles.appTitle} testID="app-title">
              Plant Pals
            </Text>
          </Animated.View>
          <Animated.View style={{opacity: messageAnim}}>
            <Text style={styles.welcomeMessage} testID="welcome-message">
              ようこそ！植物との新しい暮らし
            </Text>
          </Animated.View>

          {/* Language Selector - Animated */}
          <Animated.View style={[styles.languageSelectorContainer, {opacity: languageSelectorAnim, transform: [{ translateY: languageSelectorTranslateY }]}]} testID="language-selector-container">
            <Text style={styles.languageLabel} testID="language-label">言語を選択</Text>
            <LocalePickerPlaceholder
              testID="language-selector"
              style={styles.languageSelector}
              options={[
                { value: "ja", label: "日本語" },
                { value: "en", label: "English" },
                { value: "zh", label: "中文" },
                { value: "ko", label: "한국어" },
              ]}
              defaultValue="ja"
              onValueChange={(value: string) => console.log('Language selected:', value)} // Placeholder action, valueに型指定
            />
          </Animated.View>

          {/* Start Button - Animated */}
          <Animated.View style={[styles.startButtonContainer, {opacity: startButtonAnim}]} testID="start-button-container">
            <TouchableOpacity
              style={styles.startButton}
              onPress={navigateToAuth} // 修正した関数を呼び出す
              testID="start-button"
            >
              <Text style={styles.startButtonText}>始める</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* <Image
            testID="decoration-bottom"
            source={require('../../../../assets/images/leaf_decoration.png')} // Adjust path
            style={styles.decorationBottom}
          /> */}
        </View>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40, // from YAML
  },
  lottieLogo: {
    width: 220, // from YAML
    height: 220, // from YAML
  },
  welcomeContent: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24, // from YAML
  },
  appTitle: {
    fontFamily: theme.typography.heading,
    fontSize: 32,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  welcomeMessage: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    color: theme.colors.secondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  languageSelectorContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16, // from YAML
  },
  languageLabel: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    color: theme.colors.primary,
    marginBottom: 12,
  },
  languageSelector: { // Style for the LocalePicker itself
    width: 240,
    borderRadius: 12,
    backgroundColor: 'rgba(151, 188, 98, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    padding: 0, // Placeholder uses internal padding
  },
  startButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  startButton: {
    width: 220,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    fontFamily: theme.typography.heading,
    fontSize: 18,
    color: theme.colors.textOnPrimary,
  },
  decorationBottom: {
    position: 'absolute',
    bottom: -20,
    right: -30,
    width: 150,
    height: 150,
    opacity: 0.2,
    zIndex: -1,
  },
  // Placeholder styles for LocalePicker
  localePickerPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50, // Ensure placeholder has some height
  },
  localeOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  localeOptionSelected: {
    backgroundColor: theme.colors.secondary,
  },
  localeOptionText: {
    fontFamily: theme.typography.body,
    color: theme.colors.primary,
  },
  localeOptionTextSelected: {
    color: theme.colors.textOnPrimary,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 