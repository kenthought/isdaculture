import React from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, ScrollView, } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

const Item = ({pondName, date, notification}) => (
    <View style={{ marginVertical: 10 }}>
        <View style={{ flexDirection: "column" }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text>{pondName} - {monthNames[new Date(date).getMonth()] + " " + new Date(date).getDate() + ", " + new Date(date).getFullYear()} {formatAMPM(date)}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text>{notification}</Text>
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

export const Notification = (props) => {
    const { currentUser, notification } = props;

    if (notification === null) {
        return (
          <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>Notification</Text>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name="alert-box-outline" color={"lightgrey"} size={56} />
              <Text style={{ color: "lightgrey", fontSize: 20 }}>No Notification</Text>
            </View>
          </SafeAreaView>
        )
      }
    
      if (notification.length === 0) {
        return (
          <SafeAreaView style={styles.container}>
            <Text style={styles.screenTitle}>Notification</Text>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text>Fetching...</Text>
            </View>
          </SafeAreaView>
        )
      }

    const renderItem = ({ item }) => (
        <Item
            pondName={notification[item].pondName}
            date={notification[item].date}
            notification={notification[item].notification}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <Text style={styles.screenTitle}>Notification</Text>
                </View>
                <FlatList
                    data={Object.keys(notification)}
                    renderItem={renderItem}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const mapToStateProps = state => ({
    currentUser: state.userState.currentUser,
    notification: state.userState.notification
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

export default connect(mapToStateProps, null)(Notification)