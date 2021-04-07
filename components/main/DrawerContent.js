import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Text, Drawer, Avatar } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from "firebase";

export const DrawerContent = (props) => {

    const signOut = () => {
        firebase.auth().signOut()
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
                    <Text style={{ fontWeight: "bold", fontSize: 20, marginVertical: 3 }}>Jomari Ondap</Text>
                    <Text style={{ fontColor: "skyblue" }}>test@gmail.com</Text>
                </View>
            <Drawer.Section style={{ marginTop: 10 }}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <MaterialCommunityIcons 
                                    name="home"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Home"
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
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'skyblue',
        textAlign: 'center',
    },
})