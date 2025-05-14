import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StoreScreen } from '../../StoreScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <StoreScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('ストアアイテム読み込み', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <StoreScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});