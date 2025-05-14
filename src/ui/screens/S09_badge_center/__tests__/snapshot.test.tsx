import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BadgeCenterScreen } from '../../BadgeCenterScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <BadgeCenterScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('バッジデータ読み込み', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <BadgeCenterScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});