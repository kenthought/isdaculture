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
  
  useEffect(() => {
    if (pondDetails === null) {
      fetchPondDetails()
    }

    console.log(pondDetails)

    return () => { firebase.database().ref('ponds').off() }
  }, [pondDetails])

  if (pondDetails === undefined || pondDetails === null) {
    return (
      <View style={{ padding: "50%" }}>
        <ActivityIndicator size="small" color="skyblue" />
      </View>
    )
  }

  return (
    <Tab.Navigator initialRouteName="Pond Monitoring" tabBar={props => <TabBar {...props} />}>
      <Tab.Screen name="Pond Monitoring" key={1} children={() => <PondMonitoring props={pondDetails} />} />
      <Tab.Screen name="Fish Behavior" key={2} children={() => <FishBehavior props={pondDetails} />}  />
      <Tab.Screen name="History" key={3} children={() => <History props={pondDetails} />} />
      <Tab.Screen name="Action Log" key={4} children={() => <ActionLog props={pondDetails} />} />
    </Tab.Navigator> 
  );
}

export default Dashboard