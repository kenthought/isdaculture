import React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";

export const FishBehavior = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
                <Text style={styles.screenTitle}>Fish Behavior</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
    },
    screenTitle: {
        fontSize: 30,
        fontWeight: 'bold'
    },

})
export default FishBehavior