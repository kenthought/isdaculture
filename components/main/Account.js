import React from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import { connect } from "react-redux";

export const Account = (props) => {
    const currentUser = props.currentUser
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>Account</Text>
            <View>
                <Text>{currentUser.firstName} Profile</Text>
            </View>
            <View>
                <Text>Number of Ponds:</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16
    },
    screenTitle: {
        marginVertical: 12,
        fontSize: 30,
        fontWeight: 'bold'
    }
})

const mapToStateProps = state => ({
    currentUser: state.userState.currentUser
})

export default connect(mapToStateProps, null)(Account)