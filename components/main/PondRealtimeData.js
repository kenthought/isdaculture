import React from "react";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const RealtimeData = ({ pondTemp, pondTempStatus, pondDO }) => {
    if (pondTemp.toString() === "" && pondDO.toString() === "") {
        return (
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, alignItems: "center", padding: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Pond Temperature</Text>
                    <ActivityIndicator size="small" color="skyblue" style={{ marginVertical: 10 }} />
                </View>
                <View style={{ flex: 1, alignItems: "center", padding: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>Pond Dissolved Oxygen</Text>
                    <ActivityIndicator size="small" color="skyblue" style={{ marginVertical: 10 }} />
                </View>
            </View>
        )
    }

    return (
        <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "center", padding: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Pond Temperature</Text>
                <Text style={{ fontSize: 25, marginVertical: 10 }}>{pondTemp}°C</Text>
                <Text style={{ fontWeight: "bold" }}>{pondTempStatus}</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center", padding: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Pond Dissolved Oxygen</Text>
                <Text style={{ fontSize: 25, marginVertical: 10 }}>{pondDO}mg/L</Text>
            </View>
        </View>
    )
}

export default RealtimeData;