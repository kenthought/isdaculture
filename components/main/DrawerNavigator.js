import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from "../Home";
import AccountScreen from "./Account";
import SignOut from "./SignOut";
import firebase from "firebase";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
    const signOut = () => {
        firebase.auth().signOut()
    }    
    
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Account" component={AccountScreen} />
            <Drawer.Screen name="Sign Out" component={SignOut} listeners={() => 
                    signOut()
                } />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator