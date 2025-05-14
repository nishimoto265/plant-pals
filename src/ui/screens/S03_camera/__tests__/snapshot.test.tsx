import React from 'react';
import { render } from '@testing-library/react-native';
import { CameraScreen } from '../CameraScreen';
import { NavigationContainer } from '@react-navigation/native';

// モックの設定
// 画像のモック
jest.mock('assets/icons/flash_on.png', () => ({}));
jest.mock('assets/icons/flash_off.png', () => ({}));
jest.mock('assets/icons/gallery.png', () => ({}));
jest.mock('assets/icons/shutter.png', () => ({}));
jest.mock('assets/icons/flip_camera.png', () => ({}));


describe('カメラ画面テスト', () => {
  
  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <CameraScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});