import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FamilyManagerScreen } from '../../FamilyManagerScreen'; // Assumes component is in parent dir relative to __tests__

describe('スナップショットテスト', () => {

  it('標準レンダリング', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <FamilyManagerScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('ファミリーデータ読み込み', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <FamilyManagerScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

});