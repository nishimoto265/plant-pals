import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CameraScreen } from '../CameraScreen';
import { NavigationContainer } from '@react-navigation/native';

// モックの設定
// 画像のモック


describe('画像処理テスト', () => {
  
  it('画像撮影成功', async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen  />
      </NavigationContainer>
    );
    
    // #shutter-buttonをタップ
    fireEvent.press(getByTestId('shutter-button'));
  });

  it('画像処理エラー', async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen  />
      </NavigationContainer>
    );
    
    // #shutter-buttonをタップ
    fireEvent.press(getByTestId('shutter-button'));

    // 要素が表示されていることを確認
    expect(getByTestId('error-message')).toBeTruthy();

    // テキスト内容を確認
    expect(getByTestId('error-message')).toHaveTextContent('画像の撮影に失敗しました。もう一度お試しください。');
  });

});