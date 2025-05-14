import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ProfileScreen } from '../../ProfileScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('プロフィール読み込み', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});