import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CameraScreen } from '../CameraScreen';
import { NavigationContainer } from '@react-navigation/native';

// モックの設定
// 画像のモック


describe('権限テスト', () => {
  
  it('権限なし', async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen  />
      </NavigationContainer>
    );

    // テキスト内容を確認
    expect(getByTestId('permission-message')).toHaveTextContent('カメラへのアクセスが許可されていません');
  });

  it('権限リクエスト', async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen  />
      </NavigationContainer>
    );
    
    // #request-permission-buttonをタップ
    fireEvent.press(getByTestId('request-permission-button'));
  });

});