import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsScreen } from '../../SettingsScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <SettingsScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('ユーザーデータ読み込み', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <SettingsScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});