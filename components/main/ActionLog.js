import React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";

export const ActionLog = () => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
                <Text style={styles.screenTitle}>Action Log</Text>
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
    }
})
export default ActionLog