import React from "react";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const RealtimeTemp = ({ pondTemp, pondTempStatus }) => {
    if (pondTemp.toString() === "") {
        return (
            <View style={{ alignItems: "center", padding: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Pond Temperature</Text>
                <ActivityIndicator size="small" color="skyblue" style={{ marginVertical: 10 }} />
            </View>
        )
    }

        return (
            <View style={{ alignItems: "center", padding: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Pond Temperature</Text>
                <Text style={{ fontSize: 25, marginVertical: 10 }}>{pondTemp}°C</Text>
                <Text>{pondTempStatus}</Text>
            </View>
        )
}

export const RealtimeDO = ({ pondDO, pondDOStatus }) => {
    if (pondDO.toString() === "") {
        return (
            <View style={{ alignItems: "center", padding: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Pond Temperature</Text>
                <ActivityIndicator size="small" color="skyblue" style={{ marginVertical: 10 }} />
            </View>
        )
    }

    return (
       <View style={{ alignItems: "center", padding: 5 }}>
        <Text style={{ fontWeight: "bold" }}>Pond Dissolved Oxygen</Text>
        <Text style={{ fontSize: 25, marginVertical: 10 }}>{pondDO}mg/L</Text>
        <Text>{pondDOStatus}</Text>
    </View>
    )
}