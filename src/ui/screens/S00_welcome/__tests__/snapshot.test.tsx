import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { WelcomeScreen } from '../../WelcomeScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <WelcomeScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});