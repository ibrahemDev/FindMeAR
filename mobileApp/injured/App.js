import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import { AppLoading } from 'expo';

import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import xhr from './lib/Xhr';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/home/';
import NewEmergency from './screens/NewEmergency/';
import ViewEmergency from './screens/ViewEmergency/';



const fetchFonts = () => {


  return Font.loadAsync({

    //Roboto: require('./assets/fonts/Roboto.ttf'),
      //Roboto_medium: require('./assets/fonts/Roboto_medium.ttf'),
      ...Ionicons.font


  });
};


const ggg = async function(){


}



const Stack = createStackNavigator();


export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(function (){


      ggg()


    } , [])



    if (!dataLoaded) {
        return (
          <AppLoading
            startAsync={fetchFonts}
            onFinish={() => setDataLoaded(true)}
          />
        );
      }


  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator  headerMode="none">{/*headerMode="none" */}
        <Stack.Screen name="Home"         options={{

        }}  component={HomeScreen} />
        <Stack.Screen name="NewEmergency" component={NewEmergency} />

        <Stack.Screen name="ViewEmergency" component={ViewEmergency} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}



/*
<Stack.Screen name="NewEmergency" component={AddForm} />
          <Stack.Screen name="ViewEmergency" component={ViewEmergency} />

*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
