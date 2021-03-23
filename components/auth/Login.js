import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import { TextInput } from "react-native-paper";

const Login = ({ navigation }) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IsdaCulture</Text>
      <View>
        <TextInput style={styles.input}
          theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
          keyboardType="email-address"
          label="Email"
          setEmail={email => onChangeText(email)} />
        <TextInput style={styles.input}
          theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
          label="Password"
          secureTextEntry={true}
          setPassword={password => onChangeText(password)} />
      </View>
      <View style={{ marginTop: 30, marginBottom: 20 }}>
        <Button color='skyblue' title="Login" />
      </View>
      <View style={{ marginTop: 20, marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Don't have an account yet? </Text>
        <Text style={{ color: 'skyblue' }}
          onPress={() => navigation.navigate("Register")}>
          Register
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'skyblue',
    textAlign: 'center',
    marginTop: '20%',
    marginBottom: 20
  },
  input: {
    marginVertical: 9
  }
});

export default Login
