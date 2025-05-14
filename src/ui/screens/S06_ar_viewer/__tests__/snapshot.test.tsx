import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ARViewerScreen } from '../../ARViewerScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ARViewerScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('植物モデル読み込み', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ARViewerScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});