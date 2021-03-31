import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, ScrollView, } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

const Item = ({ pondName, fluctuationDate, temperatureStatus, pondProductionStatus, duration }) => (
  <View style={{ marginVertical: 10 }}>
    <View style={{ flexDirection: "column" }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text>Pond Name: </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{pondName}</Text>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text>Fluctuation Date: </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{monthNames[new Date(fluctuationDate).getMonth()] + " " + new Date(fluctuationDate).getDate() + ", " + new Date(fluctuationDate).getFullYear()}</Text>
          <Text>{formatAMPM(new Date(fluctuationDate))}</Text>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text>Temperature Status: </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{temperatureStatus}</Text>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text>Production Status: </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{pondProductionStatus}</Text>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Text>Duration: </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text>{duration}</Text>
        </View>
      </View>
    </View>
  </View>
)

const formatAMPM = (date) => {
  var formatTime = new Date(date)
  var hours = formatTime.getHours();
  var minutes = formatTime.getMinutes();
  var seconds = formatTime.getSeconds();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ampm;
  return strTime;
}

export const History = (props) => {
  const [pondDetails, setPondDetails] = useState("")
  const { currentUser, fluctuation } = props;

  if (fluctuation === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.screenTitle}>History</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="alert-box-outline" color={"lightgrey"} size={56} />
          <Text style={{ color: "lightgrey", fontSize: 20 }}>No history</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (fluctuation.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.screenTitle}>Fluctuation History</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>Fetching...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => (
    <Item
      pondName={fluctuation[item].pondName}
      fluctuationDate={fluctuation[item].fluctuationDate}
      temperatureStatus={fluctuation[item].temperatureStatus}
      pondProductionStatus={fluctuation[item].pondProductionStatus}
      duration={fluctuation[item].duration}
    />
  );


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Text style={styles.screenTitle}>Fluctuation History</Text>
        </View>
        <FlatList
          data={Object.keys(fluctuation)}
          renderItem={renderItem}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const mapToStateProps = state => ({
  currentUser: state.userState.currentUser,
  fluctuation: state.userState.fluctuation
})

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
  },
})

export default connect(mapToStateProps, null)(History);