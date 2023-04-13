import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import IntroScreenComponent from '/home/halincandenza/personalProjects/realReactTestrun/components/IntroScreenComponent.tsx';
import App from '/home/halincandenza/personalProjects/realReactTestrun/app/tabs/layoutWithTabsAndAuthentication';
import { SplashScreen } from 'expo-router';

const lightGrey = '#f0f2f5';

const Stack = createStackNavigator();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    RobotoSlab: require('/home/halincandenza/personalProjects/realReactTestrun/assets/fonts/RobotoSlab-VariableFont_wght.ttf'),
    ...FontAwesome.font,
  });

  const [showIntro, setShowIntro] = useState(true);
  const colorScheme = useColorScheme();

  const handleAnimationComplete = () => {
    setShowIntro(false);
  };

  const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      card: lightGrey,
      background: lightGrey,
    },
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      card: lightGrey,
      background: lightGrey,
    },
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {!loaded && <SplashScreen />}
      {loaded && (
        <NavigationContainer independent={true} theme={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
          {showIntro ? (
            <IntroScreenComponent onAnimationComplete={handleAnimationComplete} />
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="Tabs" component={App} options={{ headerShown: false }} />
              
            </Stack.Navigator>
          )}
        </NavigationContainer>
      )}
    </>
  );
}