import * as React from 'react';
import { View, ActivityIndicator } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PondMonitoringScreen from "./PondMonitoring";
import FishBehaviorScreen from "./FishBehavior";
import HistoryScreen from "./History";
import ActionLogScreen from "./ActionLog";

const Tab = createMaterialTopTabNavigator();

export function Dashboard({ route }) {

    if(route.params.pondID === undefined) {
        return (
            <View style={{padding: "50%"}}>
                <ActivityIndicator size="small" color="skyblue" />
            </View>
        )
    }

    return (
      <Tab.Navigator>
        <Tab.Screen name="PondMonitoring" component={PondMonitoringScreen} pondID={route.params.pondID} />
        <Tab.Screen name="FishBehavior" component={FishBehaviorScreen} />
        <Tab.Screen name="History" component={HistoryScreen} pondID={route.params.pondID} />        
        <Tab.Screen name="ActionLog" component={ActionLogScreen} />
      </Tab.Navigator>
  );
}

export default Dashboard