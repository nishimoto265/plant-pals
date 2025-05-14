import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// S00_welcome.yaml からテーマカラーなどを参照
const theme = {
  colors: {
    primary: "#2C6E49",
    secondary: "#97BC62",
    background: "#F2EFEA",
    textLight: "#F2EFEA",
  },
  typography: {
    heading: "Poppins-SemiBold", // このフォントが利用可能か確認が必要
    body: "NotoSansJP-Regular", // このフォントが利用可能か確認が必要
  },
};

const WelcomeScreen = () => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        {/* Lottieアニメーションは一旦省略 */}
        <Text style={styles.title}>Plant Pals</Text>
        <Text style={styles.message}>ようこそ！植物との新しい暮らし</Text>

        {/* 言語ピッカーは一旦省略 */}

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>はじめる</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.heading, // フォントの利用可能性に注意
    fontSize: 32,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  message: {
    fontFamily: theme.typography.body, // フォントの利用可能性に注意
    fontSize: 16,
    color: theme.colors.secondary,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: 220,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  buttonText: {
    fontFamily: theme.typography.heading, // フォントの利用可能性に注意
    fontSize: 18,
    color: theme.colors.textLight,
  },
});

export default WelcomeScreen;
