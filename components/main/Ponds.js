import React from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressBar } from 'react-native-paper'
import { connect } from "react-redux";

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

const color = ["white", "#03709c"]
const textColor = ["#000000", "#ffff"]

const Item = ({ index, pondID, pondName, pondAddress, fishCapacity, pondDateStarted, expectedDate, props }) => (
    <TouchableOpacity
        style={{ marginVertical: 3, backgroundColor: color[index % color.length], paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, }}
        onPress={() => props.navigation.navigate("Dashboard", { pondID: pondID })}>
        <View style={{ flexDirection: "column" }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>Pond Name: </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>{pondName}</Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>Address: </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text lineBreakMode="tail" numberOfLines={1} style={{ color: textColor[index % textColor.length] }}>{pondAddress}</Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>Fish Capacity: </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>{fishCapacity}</Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>Date Started: </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>{monthNames[new Date(pondDateStarted).getMonth()] + " " + new Date(pondDateStarted).getDate() + ", " + new Date(pondDateStarted).getFullYear()}</Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>Progress: </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor[index % textColor.length] }}>{(((pondProgress(pondDateStarted, expectedDate))) < 0 ? "0%" : (pondProgress(pondDateStarted, expectedDate)) >= 100 ? "100%" : Math.round((pondProgress(pondDateStarted, expectedDate))).toString() + "%")}</Text>
                </View>
            </View>
            <View style={{ marginVertical: 8 }}>
                <ProgressBar progress={((pondProgress(pondDateStarted, expectedDate)) / 100)} color={color[index % color.length === 0 ? 1 : 0]} />
            </View>
        </View>
    </TouchableOpacity>
);

const pondProgress = (pondDateStarted, expectedDate) => {
    const dateStarted = new Date(pondDateStarted)
    dateStarted.setDate(dateStarted.getDate() + 1)
    const dateExpected = new Date(expectedDate);
    const currentDate = new Date()
    return ((currentDate - dateStarted) / (dateExpected - dateStarted)) * 100;
}

// const AddPondButton = ({ props }) => (
//     <TouchableOpacity style={{ position: "absolute", right: 10, bottom: 10 }}>
//         <Text onPress={() => props.navigation.navigate("AddPond")}>
//             <MaterialCommunityIcons name="plus-circle" color="skyblue" size={70} />
//         </Text>
//     </TouchableOpacity>
// )

export const Ponds = (props) => {
    const { currentUser, ponds } = props;
    
    if (ponds === null) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text onPress={() => props.navigation.toggleDrawer()}>
                            <MaterialCommunityIcons name="menu" size={45} />
                        </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.screenTitle}>Ponds</Text>
                    </View>
                </View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <MaterialCommunityIcons name="alert-box-outline" color={"lightgrey"} size={56} />
                    <Text style={{ color: "lightgrey", fontSize: 20 }}>No ponds</Text>
                </View>
            </SafeAreaView>
        )
    }

    if (ponds.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text onPress={() => props.navigation.toggleDrawer()}>
                            <MaterialCommunityIcons name="menu" size={45} />
                        </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.screenTitle}>Ponds</Text>
                    </View>
                </View>
                <View style={styles.horizontal}>
                    <ActivityIndicator size="small" color="skyblue" />
                </View>
            </SafeAreaView>
        )
    }

    const renderItem = ({ item, index }) => (
        <Item
            index={index}
            pondID={ponds[item].pondID}
            pondName={ponds[item].pondName}
            pondAddress={ponds[item].pondAddress}
            fishCapacity={ponds[item].fishCapacity}
            pondDateStarted={ponds[item].pondDateStarted}
            expectedDate={ponds[item].expectedDate}
            props={props}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text onPress={() => props.navigation.toggleDrawer()}>
                        <MaterialCommunityIcons name="menu" size={45} />
                    </Text>
                </View>
                <View style={{ flex: 3 }}>
                    <Text style={styles.screenTitle}>Ponds</Text>
                </View>
            </View>
            <FlatList
                data={Object.keys(ponds)}
                renderItem={renderItem}
                keyExtractor={item => item}
            />
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
        marginHorizontal: 16,
    },
    screenTitle: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: "50%"
    }
})

export default connect(mapToStateProps, null)(Ponds)