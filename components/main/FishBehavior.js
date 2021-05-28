import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text, FlatList, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper"
import Modal from "react-native-modal"
import firebase from "firebase"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const FishBehavior = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [fishBehavior, setFishBehavior] = useState(null);
  const [isModal2Visible, setIsModal2Visible] = useState(false)
  const [fishBehaviorDetails, setFishBehaviorDetails] = useState([])

  const fetchFishBehavior = () => {
    const uid = firebase.auth().currentUser.uid
    firebase.database()
      .ref("fishBehavior")
      .child(uid + "/" + props.props.pondID)
      .on("value", (snapshot) => {
        setFishBehavior(snapshot.val())
      }, (errorObject) => {
        console.log(errorObject.code + " : " + errorObject.message)
      })
  }

  const FishBehaviorModal = () => (
    <View>
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => toggleModal()}
        onBackdropPress={() => toggleModal()}
        swipeDirection="down">
        <View style={{ padding: 10, backgroundColor: "white", borderRadius: 20 }}>
          <View style={{ marginVertical: 15, borderBottomWidth: 1, opacity: .3, marginHorizontal: 150 }} />
          <View style={{ marginVertical: 7 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }} >Fish Behavior</Text>
          </View>
          <View style={{ marginVertical: 7 }}>
            <MaterialCommunityIcons name="fish" color={"skyblue"} size={30} />
            <Text style={{ fontWeight: "bold" }}>Stable</Text>
            <Text>The crops show optimum growth rate, high metabolic process and normal swimming movements in the pond</Text>
          </View>
          <View style={{ marginVertical: 7 }}>
            <MaterialCommunityIcons name="fish" color={"orange"} size={30} />
            <Text style={{ fontWeight: "bold" }}>Sluggish</Text>
            <Text>The crops show sluggish growth rate, slow metabolic process and decreased activity in the pond</Text>
          </View>
          <View style={{ marginVertical: 7 }}>
            <MaterialCommunityIcons name="fish" color={"crimson"} size={30} />
            <Text style={{ fontWeight: "bold" }}>Stressed</Text>
            <Text>The crops show changeable growth rate, high metabolic process, erratic swimming movements and loss of equilibrium</Text>
          </View>
        </View>
      </Modal>
    </View>
  )

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const toggleHideModal = () => {
    setIsModal2Visible(!isModal2Visible)
  }

  const toggleModal2 = (temperature, dissolveOxygen, behavior, timeAndDate) => {
    setIsModal2Visible(!isModal2Visible)
    setFishBehaviorDetails([temperature, dissolveOxygen, behavior, timeAndDate])
  }

  const FishBehaviorDetailsModal = () => (
    <View>
      <Modal
        isVisible={isModal2Visible}
        onSwipeComplete={() => toggleHideModal()}
        onBackdropPress={() => toggleHideModal()}
        swipeDirection="down">
        <View style={{ padding: 10, backgroundColor: "white", borderRadius: 20, flexDirection: "row" }}>
          <View style={{ flex: .8, justifyContent: "center" }}>
            <MaterialCommunityIcons name="fish" color={fishBehavior[2] === "Stable" ? "skyblue" : fishBehavior[2] === "Sluggish" ? "orange" : fishBehavior[2] === "Stressed" ? "crimson" : "skyblue"} size={35} />
          </View>
          <View>
            <Text style={{ marginVertical: 2 }}>Temperature: {fishBehaviorDetails[0]}</Text>
            <Text style={{ marginVertical: 2 }}>Dissolved Oxygen: {fishBehaviorDetails[1]}mg/L</Text>
            <Text style={{ marginVertical: 2 }}>Fish Behavior: {fishBehaviorDetails[2]}</Text>
            <Text style={{ marginVertical: 2 }}>Time and Date: {fishBehaviorDetails[3]}</Text>
          </View>
        </View>
      </Modal>
    </View>
  )


  const Item = ({ temperature, dissolveOxygen, fishBehavior, timeAndDate }) => (
    <View>
      <TouchableOpacity onPress={() => toggleModal2(temperature, dissolveOxygen, fishBehavior, timeAndDate)}>
        <DataTable.Row>
          <DataTable.Cell>
            {temperature}
          </DataTable.Cell>
          <DataTable.Cell>
            {dissolveOxygen}mg/L
              </DataTable.Cell>
          <DataTable.Cell>
            {fishBehavior}
          </DataTable.Cell>
          <DataTable.Cell>
            {timeAndDate}
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableOpacity>
    </View>
  )

  useEffect(() => {
    if (fishBehavior === null) {
      fetchFishBehavior()
    }

    return () => { }
  }, [fishBehavior])

  if (fishBehavior !== null && fishBehavior.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.horizontal}>
          <ActivityIndicator size="small" color="skyblue" />
        </View>
      </SafeAreaView>
    )
  }

  if (fishBehavior === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
          <Text style={styles.screenTitle}>Fish Behavior</Text>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name="alert-box-outline" color={"lightgrey"} size={56} />
          <Text style={{ color: "lightgrey", fontSize: 20 }}>No data</Text>
        </View>
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => (
    <Item
      temperature={fishBehavior[item].pondTemp}
      dissolveOxygen={fishBehavior[item].pondDo}
      fishBehavior={fishBehavior[item].behavior}
      timeAndDate={fishBehavior[item].timeAndDate}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
        <View style={{ flex: 2 }}>
          <Text style={styles.screenTitle}>Fish Behavior</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity onPress={toggleModal}>
            <MaterialCommunityIcons name="information-outline" size={26} />
          </TouchableOpacity>
        </View>
      </View>
      <FishBehaviorModal />
      <View style={{ backgroundColor: "white" }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>
              Temperature
            </DataTable.Title>
            <DataTable.Title>
              Dissolved Oxygen
            </DataTable.Title>
            <DataTable.Title>
              Fish Behavior
            </DataTable.Title>
            <DataTable.Title>
              Time and Date
            </DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={Object.keys(fishBehavior).reverse()}
            renderItem={renderItem}
            style={{ backgroundColor: "white", padding: 10 }}
            keyExtractor={item => item}
          />
        </DataTable>
      </View>
      <FishBehaviorDetailsModal />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: 'bold'
  },

})
export default FishBehavior