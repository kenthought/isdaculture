import React from "react"
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native"

export const SignOut = () => {
    return (
        <SafeAreaView>
            <View style={{ padding: "50%" }}>
                <Text>Signing Out</Text>
                <ActivityIndicator size="large" color="rgb(255, 98, 98)" />
            </View>
        </SafeAreaView>
    )
}

export default SignOut