import React from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from "react-redux";

export const Account = (props) => {
    const currentUser = useSelector(state => state.userState.currentUser)
    return (
        <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
            <View style={{ flex: 1 }}>
                <Text onPress={() => props.navigation.toggleDrawer()}>
                    <MaterialCommunityIcons name="menu" size={45} />
                </Text>
            </View>
            <View style={{ flex: 3 }}>
                <Text style={styles.screenTitle}>Account</Text>
            </View>
        </View>
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
        fontSize: 30,
        fontWeight: 'bold'
    }
})

export default Account