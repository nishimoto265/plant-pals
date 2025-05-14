import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GachaResultScreen } from '../../GachaResultScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <GachaResultScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('一般報酬表示', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <GachaResultScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('レアアイテム表示', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <GachaResultScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});