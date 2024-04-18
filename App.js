import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';
import AppDataContext from './AddDataContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [appData, setAppData] = useState({
    isOnboardingCompleted: false
  });

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('appdata');
      if (value !== null) {
        const storedState = JSON.parse(value);
        setAppData((prevState) => ({
          ...prevState,
          ...storedState,
        }));
      }
    } catch (e) {
      Alert.alert('Error', `${e.message}`, [
        { text: "OK" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify(appData);
      await AsyncStorage.setItem('appdata', jsonValue);
    } catch (e) {
      Alert.alert('Error', `${e.message}`, [
        { text: "OK" }
      ]);
    }
  };

  useEffect( () => {
    getData();
  }, []);

  useEffect( () => {
    storeData();
  }, [appData]);

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      <AppDataContext.Provider value={{appData, setAppData}}>
        <SafeAreaView style={styles.container}>
          <Stack.Navigator>
            {
              appData.isOnboardingCompleted ? (
                <>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Profile" component={Profile} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Onboarding" component={Onboarding} />
                </>
              )
            }
          </Stack.Navigator>
        </SafeAreaView>
      </AppDataContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
  },
});
