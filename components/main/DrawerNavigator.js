import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from "./DrawerContent"
import HomeScreen from "../Home";
import AccountScreen from "./Account";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {

    return (
        <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Account" component={AccountScreen} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator