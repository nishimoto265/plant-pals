import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CheckoutScreen } from '../../CheckoutScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <CheckoutScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('決済データ読み込み', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <CheckoutScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});