import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const FishBehavior = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    
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
                <Text style={{ fontWeight: "bold" }} >Normal </Text>
                <Text>Temperature is greater than 34 but not more than 37</Text>
              </View>
              <View style={{ marginVertical: 7 }}>
                <Text style={{ fontWeight: "bold" }} >Behaved</Text>
                <Text>Temperature is greater than 34 but not more than 37</Text>
              </View>
              <View style={{ marginVertical: 7 }}>
                <Text style={{ fontWeight: "bold" }} >Sluggish</Text>
                <Text>Temperature is greater than 34 but not more than 37</Text>
              </View>
              <View style={{ marginVertical: 7 }}>
                <Text style={{ fontWeight: "bold" }} >Stressed</Text>
                <Text>Temperature is greater than 34 but not more than 37</Text>
              </View>
            </View>
          </Modal>
        </View>
      )

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible)
      }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.screenTitle}>Fish Behavior</Text>
                </View>
                <View style={{ flex: .80, justifyContent: "center" }}>
                    <TouchableOpacity onPress={toggleModal}>
                        <MaterialCommunityIcons name="information-outline" size={26} />
                    </TouchableOpacity>
                </View>
            </View>
            <FishBehaviorModal />
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