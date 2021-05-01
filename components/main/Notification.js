import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity, ActivityIndicator } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import { connect } from "react-redux";

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

const Item = ({ pondName, date, notification }) => (
    <View style={{ padding: 5, marginVertical: 10 }}>
        <View style={{ flexDirection: "column" }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ fontWeight: "bold" }}>{pondName} - {monthNames[new Date(date).getMonth()] + " " + new Date(date).getDate() + ", " + new Date(date).getFullYear()} {formatAMPM(date)}</Text>
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
    const [isModalVisible, setIsModalVisible] = useState(false)

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible)
    }

    const ProdStatusModal = () => (
        <View>
            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={() => toggleModal()}
                onBackdropPress={() => toggleModal()}
                swipeDirection="down">
                <View style={{ padding: 10, backgroundColor: "white", borderRadius: 20 }}>
                    <View style={{ marginVertical: 15, borderBottomWidth: 1, opacity: .3, marginHorizontal: 150 }} />
                    <View style={{ marginVertical: 7 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }} >Production Status</Text>
                    </View>
                    <View style={{ marginVertical: 7 }}>
                        <Text style={{ fontWeight: "bold" }} >Normal </Text>
                        <Text>Temperature is in suitable condition.</Text>
                    </View>
                    <View style={{ marginVertical: 7 }}>
                        <Text style={{ fontWeight: "bold" }} >Warning 1 (Hot) </Text>
                        <Text>Temperature is between 36°C and 40°C.</Text>
                    </View>
                    <View style={{ marginVertical: 7 }}>
                        <Text style={{ fontWeight: "bold" }} >Warning 1 (Cold) </Text>
                        <Text>Temperature is between 20°C and 24°C.</Text>
                    </View>
                    <View style={{ marginVertical: 7 }}>
                        <Text style={{ fontWeight: "bold" }} >Warning 2 (Hot) </Text>
                        <Text>Temperature is between 40°C and 44°C.</Text>
                    </View>
                    <View style={{ marginVertical: 7 }}>
                        <Text style={{ fontWeight: "bold" }} >Warning 2 (Cold) </Text>
                        <Text>Temperature is between 16°C and 20°C.</Text>
                    </View>
                    <View style={{ marginVertical: 7 }}>
                        <Text style={{ fontWeight: "bold" }} >Critical (Hot) </Text>
                        <Text>Temperature is greater than 44°C.</Text>
                    </View>
                    <View style={{ marginVertical: 7 }}>
                        <Text style={{ fontWeight: "bold" }} >Critical (Cold) </Text>
                        <Text>Temperature is below 16°C.</Text>
                    </View>
                </View>
            </Modal>
        </View>
    )

    if (notification === null) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text onPress={() => props.navigation.toggleDrawer()}>
                            <MaterialCommunityIcons name="menu" size={45} />
                        </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.screenTitle}>Notification</Text>
                    </View>
                    <View style={{ flex: 1.5, justifyContent: "center" }}>
                        <TouchableOpacity onPress={toggleModal}>
                            <MaterialCommunityIcons name="information-outline" size={26} />
                        </TouchableOpacity>
                    </View>
                    <ProdStatusModal />
                </View>
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
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text onPress={() => props.navigation.toggleDrawer()}>
                            <MaterialCommunityIcons name="menu" size={45} />
                        </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={styles.screenTitle}>Notification</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TouchableOpacity onPress={toggleModal}>
                            <MaterialCommunityIcons name="information-outline" size={26} />
                        </TouchableOpacity>
                    </View>
                    <ProdStatusModal />
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
            pondName={notification[item].pondName}
            date={notification[item].date}
            notification={notification[item].notification}
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
                    <Text style={styles.screenTitle}>Notification</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <TouchableOpacity onPress={toggleModal}>
                        <MaterialCommunityIcons name="information-outline" size={26} />
                    </TouchableOpacity>
                </View>
                <ProdStatusModal />
            </View>
            <FlatList
                data={Object.keys(notification).reverse()}
                renderItem={renderItem}
                style={{ padding: 10, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            />
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
        fontSize: 30,
        fontWeight: 'bold'
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: "50%"
    }
})

export default connect(mapToStateProps, null)(Notification)