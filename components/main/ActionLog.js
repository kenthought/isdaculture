import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text, FlatList, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper"
import Modal from "react-native-modal"
import firebase from 'firebase'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export const ActionLog = (props) => {
    const [actionLog, setActionLog] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [actionLogDetails, setActionLogDetails] = useState([])

    const fetchActionLog = () => {
        const uid = firebase.auth().currentUser.uid
        firebase.database()
            .ref("actionLog")
            .child(uid + "/" + props.props.pondID)
            .on("value", (snapshot) => {
                setActionLog(snapshot.val())
            }, (errorObject) => {
                console.log(errorObject.code + " : " + errorObject.message)
            })
    }

    const toggleHideModal = () => {
        setIsModalVisible(!isModalVisible)
    }

    const toggleModal = (temperature, tempStatus, prodStatus, action, timeAndDate) => {
        setIsModalVisible(!isModalVisible)
        setActionLogDetails([temperature, tempStatus, prodStatus, action, timeAndDate])
    }

    const ActionLogDetailsModal = () => (
        <View>
            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={() => toggleHideModal()}
                onBackdropPress={() => toggleHideModal()}
                swipeDirection="down">
                <View style={{ padding: 10, backgroundColor: "white", borderRadius: 20 }}>
                    <Text style={{ marginVertical: 2 }}>Temperature: {actionLogDetails[0]}</Text>
                    <Text style={{ marginVertical: 2 }}>Temperature Status: {actionLogDetails[1]}</Text>
                    <Text style={{ marginVertical: 2 }}>Production Status: {actionLogDetails[2]}</Text>
                    <Text style={{ marginVertical: 2 }}>Action: {actionLogDetails[3]}</Text>
                    <Text style={{ marginVertical: 2 }}>Time and Date: {actionLogDetails[4]}</Text>
                </View>
            </Modal>
        </View>
    )

    const Item = ({ temperature, tempStatus, prodStatus, action, timeAndDate }) => (
        <View>
            <TouchableOpacity onPress={() => toggleModal(temperature, tempStatus, prodStatus, action, timeAndDate)}>
                <DataTable.Row>
                    <DataTable.Cell>
                        {temperature}
                    </DataTable.Cell>
                    <DataTable.Cell>
                        {tempStatus}
                    </DataTable.Cell>
                    <DataTable.Cell>
                        {prodStatus}
                    </DataTable.Cell>
                    <DataTable.Cell>
                        {action}
                    </DataTable.Cell>
                    <DataTable.Cell>
                        {timeAndDate}
                    </DataTable.Cell>
                </DataTable.Row>
            </TouchableOpacity>
        </View>
    )

    useEffect(() => {
        if (actionLog === null) {
            fetchActionLog()
        }

        return () => { firebase.database().ref('actionLog').off() }
    }, [actionLog])

    if (actionLog !== null && actionLog.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.horizontal}>
                    <ActivityIndicator size="small" color="skyblue" />
                </View>
            </SafeAreaView>
        )
    }

    if (actionLog === null) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
                    <Text style={styles.screenTitle}>Action Log</Text>
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
            temperature={actionLog[item].pondTemp}
            tempStatus={actionLog[item].pondTempStatus}
            prodStatus={actionLog[item].prodStatus}
            action={actionLog[item].action}
            timeAndDate={actionLog[item].timeAndDate}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
                <Text style={styles.screenTitle}>Action Log</Text>
            </View>
            <View style={{ backgroundColor: "white" }}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>
                            Temperature
                        </DataTable.Title>
                        <DataTable.Title>
                            Temp Status
                        </DataTable.Title>
                        <DataTable.Title>
                            Prod. Status
                        </DataTable.Title>
                        <DataTable.Title>
                            Action
                        </DataTable.Title>
                        <DataTable.Title>
                            Time and date
                        </DataTable.Title>
                    </DataTable.Header>
                    <FlatList
                        data={Object.keys(actionLog).reverse()}
                        renderItem={renderItem}
                        style={{ backgroundColor: "white", padding: 10 }}
                        keyExtractor={item => item}
                    />
                </DataTable>
            </View>
            <ActionLogDetailsModal />
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
    }
})
export default ActionLog