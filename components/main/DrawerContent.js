import React from "react";
import { View, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { Text, Drawer, Avatar } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from "firebase";
import { useSelector } from "react-redux";

export const DrawerContent = (props) => {
    const signOut = () => { firebase.auth().signOut() }
    const currentUser = useSelector(state => state.userState.currentUser)

    if (currentUser === null) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={style.container, style.horizontal}>
                    <ActivityIndicator size="small" color="skyblue" />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View>
                    <Text style={style.title}>IsdaCulture</Text>
                </View>
                <View style={{ alignItems: "center", padding: 30, borderColor: "#f4f4f4", borderBottomWidth: 1 }}>
                    <Avatar.Image
                        source={{
                            uri: "https://i.pravatar.cc/100"
                        }}
                        size={70}
                    />
                    <Text style={{ fontWeight: "bold", fontSize: 20, marginVertical: 5 }}>{currentUser.firstName} {currentUser.lastName}</Text>
                    <Text style={{ color: "skyblue" }}>{currentUser.email}</Text>
                </View>
                <Drawer.Section style={{ marginTop: 10 }}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons
                                name="home"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Home"
                        onPress={() => props.navigation.navigate("Home")}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons
                                name="account"
                                color={color}
                                size={size}
                            />
                        )}
                        label="Account"
                        onPress={() => props.navigation.navigate("Account")}
                    />
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={{ marginBottom: 15, borderTopColor: "#f4f4f4", borderTopWidth: 1 }}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons
                            name="exit-to-app"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={() => signOut()}
                />
            </Drawer.Section>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'skyblue',
        textAlign: 'center',
    }
})

export default DrawerContent