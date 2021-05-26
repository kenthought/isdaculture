import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PondMonitoring } from "./PondMonitoring";
import { FishBehavior } from "./FishBehavior";
import { History } from "./History";
import { ActionLog } from "./ActionLog";
import { TabBar } from "./TabBar"
import firebase from "firebase"

const Tab = createMaterialTopTabNavigator();

export function Dashboard({ route }) {
  const [pondDetails, setPondDetails] = useState(null)

  const fetchPondDetails = () => {
    const uid = firebase.auth().currentUser.uid
    firebase.database()
      .ref("ponds")
      .child(uid + "/" + route.params.pondID)
      .on("value", (snapshot) => {
        setPondDetails(snapshot.val())
      }, (errorObject) => {
        console.log(errorObject.code + " : " + errorObject.message)
      })
  }

  if (pondDetails === undefined) {
    return (
      <View style={{ padding: "50%" }}>
        <ActivityIndicator size="small" color="skyblue" />
      </View>
    )
  }

  useEffect(() => {
    if (pondDetails === null) {
      fetchPondDetails()
    }
  }, [pondDetails])

  return (
    <Tab.Navigator initialRouteName="Pond Monitoring" tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Pond Monitoring" children={() => <PondMonitoring props={pondDetails} />} />
      <Tab.Screen name="Fish Behavior" children={() => <FishBehavior props={pondDetails} />}  />
      <Tab.Screen name="History" children={() => <History props={pondDetails} />} />
      <Tab.Screen name="Action Log" children={() => <ActionLog props={pondDetails} />} />
    </Tab.Navigator> 
  );
}

export default Dashboard