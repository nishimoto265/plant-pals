import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ErrorOfflineScreen } from '../../ErrorOfflineScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('オフラインモード表示', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ErrorOfflineScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('一般エラー表示', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ErrorOfflineScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('404エラー表示', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ErrorOfflineScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});