import React from "react";
import { LineChart } from "react-native-chart-kit"
import { View, Text, Dimensions } from "react-native";

export const PondRealtimeChart = ({ pondDetails, chartData, chartLabel }) => {
    return (
        <View style={{ marginTop: 30 }}>
            <Text style={{ fontWeight: "bold" }}>{pondDetails.pondName} TEMPERATURE</Text>
            <LineChart
                data={{
                    labels: chartLabel,
                    datasets: [
                        {
                            data: chartData
                        }
                    ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                yAxisSuffix="°C"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: "white",
                    backgroundGradientFrom: "white",
                    backgroundGradientTo: "white",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(81, 122, 219, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "grey"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    )
}

export default PondRealtimeChart;