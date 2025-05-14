import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { CameraScreen } from '../CameraScreen';
import { NavigationContainer } from '@react-navigation/native';

// モックの設定
// 画像のモック


describe('カメラ操作テスト', () => {
  
  it('シャッターボタン', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen />
      </NavigationContainer>
    );
    
    // #shutter-buttonをタップ
    fireEvent.press(getByTestId('shutter-button'));

    // 関数が呼ばれたことを確認
    expect(takePicture).toHaveBeenCalled();
  });

  it('フラッシュ切替', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen />
      </NavigationContainer>
    );
    
    // #flash-toggleをタップ
    fireEvent.press(getByTestId('flash-toggle'));
  });

  it('カメラ切替', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <CameraScreen />
      </NavigationContainer>
    );
    
    // #flip-cameraをタップ
    fireEvent.press(getByTestId('flip-camera'));

    // 関数が呼ばれたことを確認
    expect(switchCamera).toHaveBeenCalled();
  });

});