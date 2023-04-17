import React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Auth from '/home/halincandenza/personalProjects/realReactTestrun/app/Auth.tsx'
import TabOneScreen from '/home/halincandenza/personalProjects/realReactTestrun/app/tabs/indexInTabs.tsx';
import TabTwoScreen from '/home/halincandenza/personalProjects/realReactTestrun/app/tabs/two.tsx';
import ModalScreen from '/home/halincandenza/personalProjects/realReactTestrun/app/modal.tsx';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabsNavigator() {
  return (
      <Tab.Navigator>
        <Tab.Screen
          name="TabOne"
          component={TabOneScreen}
          options={{
            title: 'TEST',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
        <Tab.Screen
          name="TabTwo"
          component={TabTwoScreen}
          options={{
            title: 'Tab Two',
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
      </Tab.Navigator>
  );
}



export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Tabs"
              component={TabsNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Modal" component={ModalScreen} />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
  );
}