import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NotificationScreen } from '../../NotificationScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <NotificationScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('通知データ読み込み', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <NotificationScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});