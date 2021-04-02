import React from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, ScrollView, } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressBar } from 'react-native-paper'
import { connect } from "react-redux";

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

const Item = ({ pondID, pondName, pondAddress, fishCapacity, pondDateStarted, expectedTimeline, props }) => (
    <TouchableOpacity onPress={() => props.navigation.navigate("Dashboard", { pondID: pondID })}>
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
                        <Text>Address: </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>{pondAddress}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <Text>Fish Capacity: </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>{fishCapacity}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <Text>Date Started: </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>{monthNames[new Date(pondDateStarted).getMonth()] + " " + new Date(pondDateStarted).getDate() + ", " + new Date(pondDateStarted).getFullYear()}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <Text>Progress: </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>{(((pondProgress(pondDateStarted, parseInt(expectedTimeline)))) < 0 ? "0%" : (pondProgress(pondDateStarted, parseInt(expectedTimeline))) >= 100 ? "100%" : Math.round((pondProgress(pondDateStarted, parseInt(expectedTimeline)))).toString() + "%")}</Text>
                    </View>
                </View>
                <View style={{ marginVertical: 8, border: 1, borderTopColor: "lightgrey" }}>
                    <ProgressBar progress={((pondProgress(pondDateStarted, parseInt(expectedTimeline))) / 100)} color={"skyblue"} />
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const pondProgress = (pondDateStarted, expectedTimeline) => {
    const dateStarted = new Date(pondDateStarted)
    dateStarted.setDate(dateStarted.getDate() + 1)
    const expectedDate = new Date(dateStarted);
    const currentDate = new Date()
    expectedDate.setDate(expectedDate.getDate() + expectedTimeline);
    return ((currentDate - dateStarted) / (expectedDate - dateStarted)) * 100;
}

const AddPondButton = ({ props }) => (
    <TouchableOpacity style={{ position: "absolute", right: 10, bottom: 10 }}>
        <Text onPress={() => props.navigation.navigate("AddPondScreen")}>
            <MaterialCommunityIcons name="plus-circle" color="skyblue" size={70} />
        </Text>
    </TouchableOpacity>
)

export const Ponds = (props) => {
    const { currentUser, ponds } = props;

    if (ponds === null) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.screenTitle}>Ponds</Text>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <MaterialCommunityIcons name="alert-box-outline" color={"lightgrey"} size={56} />
                    <Text style={{ color: "lightgrey", fontSize: 20 }}>No ponds</Text>
                </View>
                <AddPondButton props={props} />
            </SafeAreaView>
        )
    }

    if (ponds.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.screenTitle}>Ponds</Text>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text>Fetching...</Text>
                </View>
                <AddPondButton props={props} />
            </SafeAreaView>
        )
    }

    const renderItem = ({ item }) => (
        <Item
            pondID={ponds[item].pondID}
            pondName={ponds[item].pondName}
            pondAddress={ponds[item].pondAddress}
            fishCapacity={ponds[item].fishCapacity}
            pondDateStarted={ponds[item].pondDateStarted}
            expectedTimeline={ponds[item].expectedTimeline}
            props={props}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <Text style={styles.screenTitle}>Ponds</Text>
                </View>
                <FlatList
                    data={Object.keys(ponds)}
                    renderItem={renderItem}
                />
            </ScrollView>
            <AddPondButton props={props} />
        </SafeAreaView>
    )
}

const mapToStateProps = state => ({
    currentUser: state.userState.currentUser,
    ponds: state.userState.ponds
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

export default connect(mapToStateProps, null)(Ponds)