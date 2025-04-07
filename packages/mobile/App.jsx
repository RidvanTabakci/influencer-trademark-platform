import React from 'react';
import Navigation from './src/Routes/navigation'; // içinde NavigationContainer var
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation /> 
    </GestureHandlerRootView>
  );
};

export default App;
