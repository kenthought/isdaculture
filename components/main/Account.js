import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { Text, Avatar } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from "react-redux";

export const Account = (props) => {
    const currentUser = useSelector(state => state.userState.currentUser)
    const ponds = useSelector(state => state.userState.ponds)
    const notification = useSelector(state => state.userState.notification)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]

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
            <ScrollView>
            <View style={{ flexDirection: "row", marginVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f4f4f4" }}>
                <View style={{ flex: 1 }}>
                    <Avatar.Image
                        source={{
                            uri: "https://i.pravatar.cc/100"
                        }}
                        size={90}
                    />
                </View>
                <View style={{ flex: 2, flexDirection: "column", padding: 10 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: 20 }}>{currentUser.firstName} {currentUser.lastName}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ textTransform: "uppercase", color: "skyblue", fontWeight: "bold" }}>{currentUser.email}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontWeight: "bold" }}>{currentUser.phoneNumber}</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginVertical: 15 }}>
                <View style={{ borderRadius: 25, marginVertical: 8, alignItems: "center", justifyContent: "center", height: 100, backgroundColor: "#e3e5e3" }}>
                    <Text style={{ fontSize: 20, marginVertical: 3 }}>PONDS</Text>
                    <Text style={{ fontSize: 20, marginVertical: 3 }}>{ponds === null ? 0 : Object.keys(ponds).length}</Text>
                </View>
                <View style={{ borderRadius: 25, marginVertical: 8, alignItems: "center", justifyContent: "center", height: 100, backgroundColor: "#d7f9d7" }}>
                    <Text style={{ fontSize: 20, marginVertical: 3 }}>NOTIFICATIONS</Text>
                    <Text style={{ fontSize: 20, marginVertical: 3 }}>{notification === null ? 0 : Object.keys(notification).length}</Text>
                </View>
                <View style={{ borderRadius: 25, marginVertical: 8, alignItems: "center", justifyContent: "center", height: 100, backgroundColor: "#ead8b3" }}>
                    <Text style={{ fontSize: 20, marginVertical: 3 }}>JOINED</Text>
                    <Text style={{ fontSize: 20, marginVertical: 3 }}>{monthNames[new Date(currentUser.createdAt).getMonth()] + " " + new Date(currentUser.createdAt).getDate() + ", " + new Date(currentUser.createdAt).getFullYear()}</Text>
                </View>
            </View>
            </ScrollView>
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