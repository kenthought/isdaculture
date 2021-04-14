import React from "react";
import { View, Text } from "react-native";

export const RealtimeTemp = ({ pondTemp, pondTempStatus }) => (
    <View style={{ alignItems: "center", padding: 5 }}>
        <Text style={{ fontWeight: "bold" }}>Pond Temperature</Text>
        <Text style={{ fontSize: 25, marginVertical: 10 }}>{pondTemp}°C</Text>
        <Text>{pondTempStatus}</Text>
    </View>
)

export const RealtimeDO = ({ pondDO, pondDOStatus }) => (
    <View style={{ alignItems: "center", padding: 5 }}>
        <Text style={{ fontWeight: "bold" }}>Pond Dissolved Oxygen</Text>
        <Text style={{ fontSize: 25, marginVertical: 10 }}>{pondDO}mg/L</Text>
        <Text>{pondDOStatus}</Text>
    </View>
)