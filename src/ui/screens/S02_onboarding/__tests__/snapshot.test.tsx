import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { OnboardingScreen } from '../../OnboardingScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <OnboardingScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});