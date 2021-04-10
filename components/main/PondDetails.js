import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useEffect } from "react/cjs/react.development";


export const PondDetails = ({ props, pondStatus }) => {
    const [prodTimeline, setProdTimeline] = useState("")
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]
    console.log(props)

    const calcProdTimeline = () => {
        const currentDate = new Date()
        const expectedDate = new Date(props.pondDateStarted)
        expectedDate.setDate(expectedDate.getDate() + parseInt(props.expectedTimeline));
        var leftover = Math.abs((currentDate.getTime() - expectedDate.getTime()) / 1000)
        var prodTimelineFormat = ""
        if (leftover <= 0) {
            prodTimelineFormat = "Due time for harvest";
        }
        else {
            if (leftover > 0) {
                setTimeout(() => {
                    var mos = Math.floor(leftover / 2629746);
                    leftover -= (mos * 2629746);
                    var days = Math.floor(leftover / 86400);
                    leftover -= (days * 86400);
                    var hours = Math.floor(leftover / 3600);
                    leftover -= (hours * 3600);
                    var minutes = Math.floor(leftover / 60);
                    leftover -= (minutes * 60);
                    leftover = leftover.toFixed(0)

                    if (mos > 0) {
                        if (mos == 1) {
                            prodTimelineFormat += mos + " mo";
                        }
                        else if (mos > 1) {
                            prodTimelineFormat += mos + " mos";
                        }

                        if (days == 1) {
                            prodTimelineFormat += ", " + days + " day";
                        }
                        else if (days > 1) {
                            prodTimelineFormat += ", " + days + " days";
                        }

                        if (hours == 1) {
                            prodTimelineFormat += ", " + hours + " hr";
                        }
                        else if (hours > 1) {
                            prodTimelineFormat += ", " + hours + " hrs";
                        }

                        if (minutes == 1) {
                            prodTimelineFormat += ", " + minutes + " min";
                        }
                        else if (minutes > 1) {
                            prodTimelineFormat += ", " + minutes + " mins";
                        }

                        if (leftover == 1) {
                            prodTimelineFormat += " and " + leftover + " sec";
                        }
                        else if (leftover > 1) {
                            prodTimelineFormat += " and " + leftover + " secs";
                        }
                    }

                    if (days > 0 && mos == 0) {

                        if (days == 1) {
                            prodTimelineFormat += days + " day";
                        }
                        else if (days > 1) {
                            prodTimelineFormat += days + " days";
                        }

                        if (hours == 1) {
                            prodTimelineFormat += ", " + hours + " hr";
                        }
                        else if (hours > 1) {
                            prodTimelineFormat += ", " + hours + " hrs";
                        }

                        if (minutes == 1) {
                            prodTimelineFormat += ", " + minutes + " min";
                        }
                        else if (minutes > 1) {
                            prodTimelineFormat += ", " + minutes + " mins";
                        }

                        if (leftover == 1) {
                            prodTimelineFormat += " and " + leftover + " sec";
                        }
                        else if (leftover > 1) {
                            prodTimelineFormat += " and " + leftover + " secs";
                        }
                    }

                    if (hours > 0 && days == 0 && mos == 0) {

                        if (hours == 1) {
                            prodTimelineFormat += hours + " hr";
                        }
                        else if (hours > 1) {
                            prodTimelineFormat += days + " hrs";
                        }

                        if (minutes == 1) {
                            prodTimelineFormat += ", " + minutes + " min";
                        }
                        else if (minutes > 1) {
                            prodTimelineFormat += ", " + minutes + " mins";
                        }

                        if (leftover == 1) {
                            prodTimelineFormat += " and " + leftover + " sec";
                        }
                        else if (leftover > 1) {
                            prodTimelineFormat += " and " + leftover + " secs";
                        }
                    }

                    if (minutes > 0 && mos == 0 && days == 0 && hours) {
                        if (minutes == 1) {
                            prodTimelineFormat += minutes + " min";
                        }
                        else if (minutes > 1) {
                            prodTimelineFormat += minutes + " mins";
                        }

                        if (leftover == 1) {
                            prodTimelineFormat += " and " + leftover + " sec";
                        }
                        else if (leftover > 1) {
                            prodTimelineFormat += " and " + leftover + " secs";
                        }
                    }

                    if (leftover > 0 && mos == 0 && days == 0 && minutes == 0 && hours == 0) {
                        if (leftover == 1) {
                            prodTimelineFormat += leftover + " sec";
                        }
                        else if (leftover > 1) {
                            prodTimelineFormat += leftover + " secs";
                        }
                    }

                    setProdTimeline(prodTimelineFormat)
                }, 1000);
            } else {
                console.log("There was an error!!!")
            }
        }
    }

    const pondHarvestDate = (pondDateStarted, expectedTimeline) => {
        const expectedDate = new Date(pondDateStarted)
        expectedDate.setDate(expectedDate.getDate() + parseInt(expectedTimeline));
        return monthNames[expectedDate.getMonth()] + " " + expectedDate.getDate() + ", " + expectedDate.getFullYear();
    }

    useEffect(() => {
        calcProdTimeline()

        return () => { };
    }, [prodTimeline])

    if(props.props === null) {
        return (
            <View style={{padding: 50}}>
                <ActivityIndicator size="small" color="skyblue" />
            </View>
        )
    }

    return (
        <View style={{ padding: 20, flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.screenTitle}>{props.pondName}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", width: "95%" }}>
                <View style={{ flex: 1, width: "90%" }}>
                    <Text style={{ fontWeight: "bold" }}>Production Status: <Text style={{ fontWeight: "normal" }}>{pondStatus}</Text></Text>
                    <Text style={{ fontWeight: "bold" }}>Total Stock: <Text style={{ fontWeight: "normal" }}>{props.fishCapacity}</Text></Text>
                    <Text>{(props.pondLength * props.pondWidth)} square meters</Text>
                </View>
                <View style={{ flex: 1, width: "90%" }}>
                    <Text style={{ fontWeight: "bold" }}>Production Timeline: </Text>
                    <Text>{prodTimeline}</Text>
                    <Text>{pondHarvestDate(props.pondDateStarted, props.expectedTimeline)}</Text>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})

export default PondDetails