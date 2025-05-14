import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CameraScreen } from '../CameraScreen';
import { NavigationContainer } from '@react-navigation/native';

// ナビゲーション関数のモック
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// その他のモック
// 画像のモック


describe('ギャラリーアクセステスト', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    mockNavigate.mockReset();
  });

  
  it('ギャラリーを開く', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen />
      </NavigationContainer>
    );
    
    // #gallery-buttonをタップ
    fireEvent.press(getByTestId('gallery-button'));
  });

  it('画像選択', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen />
      </NavigationContainer>
    );
    
    // #gallery-buttonをタップ
    fireEvent.press(getByTestId('gallery-button'));

    // ナビゲーションを確認
    expect(mockNavigate).toHaveBeenCalledWith('PlantIdentification');
  });

});