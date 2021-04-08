import React, { useState } from 'react'
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from 'react-native';
import { TextInput } from "react-native-paper";
import firebase from 'firebase'

export const register = (firstName, lastName, phoneNumber, email, password, setRequired, setRequiredError) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            const db = firebase.database()
            const ref = db.ref('users/' + firebase.auth().currentUser.uid).set({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email
            })
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
            setRequired(true)
            setRequiredError("Please check for the errors below:\n" + error.message)
        })
}

const Register = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [required, setRequired] = useState(false)
    const [requiredError, setRequiredError] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>IsdaCulture</Text>
                <Text style={{ fontWeight: 'bold', marginTop: 30 }}>New here?</Text>
                <Text style={{ marginBottom: 15 }}>Signing up is easy. It only takes a few steps.</Text>
                <View>
                    <TextInput style={styles.input}
                        theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                        label="First Name"
                        onChangeText={firstName => setFirstName(firstName)} 
                        value={firstName}
                        />
                    <TextInput style={styles.input}
                        theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                        label="Last Name"
                        onChangeText={lastName => setLastName(lastName)} 
                        value={lastName}
                        />
                    <TextInput style={styles.input}
                        theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                        label="Phone number"
                        keyboardType="phone-pad"
                        onChangeText={phoneNumber => setPhoneNumber(phoneNumber)} 
                        value={phoneNumber}/>
                    <TextInput style={styles.input}
                        theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                        label="Email"
                        keyboardType="email-address"
                        onChangeText={email => setEmail(email)} 
                        value={email}
                        />
                    <TextInput style={styles.input}
                        theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                        label="Password"
                        secureTextEntry={true}
                        onChangeText={password => setPassword(password)} 
                        value={password}
                        />
                </View>
                {required && (
                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 15 }}>
                        <Text style={{ color: "red", fontSize: 10 }}>{requiredError}</Text>
                    </View>
                )}
                <View style={{ marginTop: 30, marginBottom: 20 }}>
                    <Button color='skyblue' title="Register"
                        onPress={() => {
                            var requiredError = "";
                            if (firstName === "")
                                requiredError += "\nFirst Name is required"
                            if (lastName === "")
                                requiredError += "\nLast Name is required"
                            if (phoneNumber === "")
                                requiredError += "\nPhone Number is required"
                            if (email === "")
                                requiredError += "\nEmail is required"
                            if (password === "")
                                requiredError += "\nPassword is required"
                            if (requiredError === "") {
                                register(firstName, lastName, phoneNumber, email, password, setRequired, setRequiredError)
                            } else {
                                setRequired(true)
                                setRequiredError("Please check for the error(s) below:" + requiredError)
                            }
                        }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffff'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'skyblue'
    },
    input: {
        marginVertical: 9
    }
})


export default Register