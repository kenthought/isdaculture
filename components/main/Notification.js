import React from "react";
import { SafeAreaView, View, Text, StyleSheet, StatusBar, FlatList, ScrollView,  } from "react-native";

export const Notification = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.screenTitle}>Notification</Text>
        </View>
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
  },
})

export default Notification;