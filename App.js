import 'react-native-gesture-handler';
import React, { Component } from 'react';
import firebase from 'firebase';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/auth/Login';
import RegisterScreen from './components/auth/Register';
import HomeScreen from "./components/Home";
import PondsScreen from "./components/main/Ponds"
import PondRealtimeScreen from "./components/main/PondRealtime"
import AddPondScreen from "./components/main/AddPond"
import HistoryScreen from "./components/main/History"
import { Provider } from 'react-redux';
import store from "./redux/store";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnQZvAD5m2DNIlFkswYiD9kDt0GOemLH8",
  authDomain: "isdaculture.firebaseapp.com",
  databaseURL: "https://isdaculture-default-rtdb.firebaseio.com",
  projectId: "isdaculture",
  storageBucket: "isdaculture.appspot.com",
  messagingSenderId: "250307437267",
  appId: "1:250307437267:web:8298993821c405830d6a26",
  measurementId: "G-ERCFFYDGZW"
};

firebase.initializeApp(firebaseConfig)

const Stack = createStackNavigator()

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }

  render = () => {
    const { loaded, loggedIn } = this.state;
    if (!loaded) {
      return (
        <View style={styles.container}>
          <Text>
            Loading...
          </Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Ponds" component={PondsScreen} navigation={this.props.navigation} />
            <Stack.Screen name="AddPondScreen" component={AddPondScreen} navigation={this.props.navigation} options={{ title: 'Add Pond' }} />
            <Stack.Screen name="PondRealtime" component={PondRealtimeScreen} navigation={this.props.navigation} options={{ title: 'Pond' }} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default App