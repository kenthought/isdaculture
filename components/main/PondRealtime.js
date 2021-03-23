import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit"
import firebase from "firebase";
import { ScrollView } from "react-native-gesture-handler";
import PondDetails from "./PondDetails";
import { schedulePushNotification } from "./Notification";

export const PondRealtime = ({ route }) => {
    const [pondDetails, setPondDetails] = useState(null)
    const [pondTemp, setPondTemp] = useState("")
    const [prevPondTemp, setPrevPondTemp] = useState("")
    const [pondDO, setPondDO] = useState("")
    const [pondStatus, setPondStatus] = useState("")
    const [pondTempStatus, setPondTempStatus] = useState("")
    const [pondDOStatus, setPondDOStatus] = useState("")
    const [chartWidth, setChartWidth] = useState(Dimensions.get("window").width)
    const [chartLabel, setChartLabel] = useState([0, 0, 0, 0, 0])
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0])
    var timer = 1
    var refreshIntervalId = ''

    const RealtimeTemp = () => (
        <View style={{ alignItems: "center", padding: 5 }}>
            <Text>Pond Temperature</Text>
            <Text style={{ fontSize: 25, marginVertical: 10 }}>{pondTemp}°C</Text>
            <Text>{pondTempStatus}</Text>
        </View>
    )

    const RealtimeDO = () => (
        <View style={{ alignItems: "center", padding: 5 }}>
            <Text>Pond Dissolved Oxygen</Text>
            <Text style={{ fontSize: 25, marginVertical: 10 }}>{pondDO}mg/L</Text>
            <Text>{pondDOStatus}</Text>
        </View>
    )

    const PondRealtimeTempChart = () => (
        <View style={{ marginTop: 30 }}>
            <Text>{pondDetails.pondName} Temperature</Text>
            <LineChart
                data={{
                    labels: chartLabel,
                    datasets: [
                        {
                            data: chartData
                        }
                    ]
                }}
                width={chartWidth - 20} // from react-native
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

    const fetchPondDetails = () => {
        const uid = firebase.auth().currentUser.uid
        firebase.database()
            .ref("ponds")
            .child(uid + "/" + route.params.pondID)
            .on("value", (snapshot) => {
                setPondDetails(snapshot.val())
            }, (errorObject) => {
                console.log(errorObject.code + " : " + errorObject.message)
            })
    }

    const fetchPondTemp = () => {
        // firebase.database()
        //     .ref("pondRealtimeTemp")
        //     .on("value", (snapshot) => {
        //         chartLabel.splice(0, 1)
        //         chartLabel.splice(5, 0, formatAMPM(snapshot.val().date))
        //         setChartLabel(chartLabel)
        //         chartData.splice(0, 1)
        //         chartData.splice(5, 0, snapshot.val().pondTemp)
        //         setChartData(chartData)
        //         setPondTemp(snapshot.val().pondTemp)
        //         tempStatus(snapshot.val().pondTemp)
        //         // console.log(snapshot.val())
        //     }, (errorObject) => {
        //         console.log(errorObject.code + " : " + errorObject.message)
        //     })
        fetchPondChart()
        // firebase.database()
        //     .ref("pondRealtimeChart")
        //     .limitToLast(1)
        //     .on("value", (snapshot) => {
        //         snapshot.forEach(function (childSnapshot) {
        //             var childData = childSnapshot.val();
        //                     chartLabel.splice(0, 1)
        //                     chartLabel.splice(5, 0, formatAMPM(childData.date))
        //                     setChartLabel(chartLabel)
        //                     chartData.splice(0, 1)
        //                     chartData.splice(5, 0, childData.pondTemp)
        //                     setChartData(chartData)
        //             setPondTemp(childData.pondTemp)
        //             tempStatus(childData.pondTemp)
        //         });
        //     }, (errorObject) => {
        //         console.log(errorObject.code + " : " + errorObject.message)
        //     })
    }

    const fetchPondChart = () => {
        firebase.database()
            .ref("pondRealtimeData")
            .limitToLast(5)
            .on("value", (snapshot) => {
                var count = 0
                var fetchChartData = []
                var fetchChartLabel = []
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();
                    fetchChartData[count] = childData.pondTemp
                    fetchChartLabel[count] = formatAMPM(childData.date)
                    count++
                });
                chartData.splice(0, chartData.length, ...fetchChartData)
                setChartData(chartData)
                chartLabel.splice(0, fetchChartData.length, ...fetchChartLabel)
                setChartLabel(chartLabel)
                setPondTemp(chartData[4])
                setPrevPondTemp(chartData[3])
                tempStatus(chartData[chartData.length - 1])
                // console.log(prevPondTemp, pondTemp)
                // console.log(chartData)
                sendPondNotificationAndFluctuationRecording()
            }, (errorObject) => {
                console.log(errorObject.code + " : " + errorObject.message)
            })
    }

    const formatAMPM = (date) => {
        var formatTime = new Date(date)
        var hours = formatTime.getHours();
        var minutes = formatTime.getMinutes();
        var seconds = formatTime.getSeconds();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ':' + seconds;
        return strTime;
    }

    const tempStatus = (pondTemp) => {
        var pondTemp = pondTemp
        if (pondTemp >= 24 && pondTemp < 36) //NORMAL LEVEL
        {
            if (pondTemp >= 26 && pondTemp < 34) {
                setPondTempStatus("BETTER - BEST");
            }
            else {
                setPondTempStatus("GOOD");
            }
            setPondStatus("Normal");
        }
        else if ((pondTemp >= 16 && pondTemp < 24) || (pondTemp >= 36 && pondTemp < 44))    //WARNING LEVEL
        {
            if (pondTemp >= 16 && pondTemp < 24) {
            }
            else if (pondTemp >= 36 && pondTemp < 44) {
            }

            if ((pondTemp >= 20 && pondTemp < 24) || (pondTemp >= 36 && pondTemp < 40)) {
                setPondStatus("Warning 1");
                setPondTempStatus("BAD");
            }
            else if ((pondTemp >= 16 && pondTemp < 20) || (pondTemp >= 40 && pondTemp < 44)) {
                setPondStatus("Warning 2");
                setPondTempStatus("WORSE");
            }
        }
        else    // CRITICAL LEVEL
        {
            if (pondTemp === -127.00) {
                setPondStatus("Critical");
            }
            if (pondTemp < 16 & pondTemp != -127.00) {
                setPondStatus("Critical");
                setPondTempStatus("WORST");
            }
            else if (pondTemp >= 44) {
                setPondStatus("Critical");
                setPondTempStatus("WORST");
            }
        }
    }

    const sendPondNotificationAndFluctuationRecording = () => {
        if (parseFloat(prevPondTemp) == -127.00 || (parseFloat(prevPondTemp) >= 24 && parseFloat(prevPondTemp) < 36))    //if last recorded temperature is NORMAL, user-default or output form disconnected sensor, -> then allow sms sending once WARNING 2 and CRITICAL status is detected
        {
            if (parseFloat(prevPondTemp) == -127.00)	//means that sensor is disconnected/malfunctioned, or previous temperature is user-default
            {
                console.log("\nTemperature Analysis commencing...");
                console.log("\nSMS Notification Sending: Enabled");
                console.log("\nSystem Action Logs Insertion: Enabled");
                console.log("\nFluctuation Occurrence Recording: Enabled\n");
            }

            if (parseFloat(pondTemp) >= 16 && parseFloat(pondTemp) < 20)    //sms sending and fluctuation recording when current temperature reaches WARNING 2 status (COLD)
            {
                //start timer for fluctuation recording
                refreshIntervalId = setInterval(function () { timer++; }, 1000);

                var title = "Normal to Warning 2 (Cold) Temperature";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond in the pond lowers down at " + pondTemp + "°C and is now on WARNING 2 production status. Temperature regulation is ongoing, and preparation for emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 40 && parseFloat(pondTemp) < 44)   //sms sending and fluctuation recording when current temperature reaches WARNING 2 status (HOT)
            {
                //start timer for fluctuation recording
                refreshIntervalId = setInterval(function () { timer++; }, 1000);

                var title = "Normal to Warning 2 (Hot) Temperature";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond in the pond rises up at " + pondTemp + "°C and is now on WARNING 2 production status. Temperature regulation is ongoing, and preparation for emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) < 16) //sms sending and fluctuation recording when current temperature reaches CRITICAL status (COLD)
            {
                //start timer for fluctuation recording
                refreshIntervalId = setInterval(function () { timer++; }, 1000);

                var title = "Normal to Critical (Cold) Temperature";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond quickly lowers down at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is ongoing. Immediate emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 44)    //sms sending and fluctuation recording when current temperature reaches CRITICAL status (HOT)
            {
                //start timer for fluctuation recording
                refreshIntervalId = setInterval(function () { timer++; }, 1000);

                var title = "Normal to Critical (Hot) Temperature";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond quickly rises up at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is ongoing. Immediate emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if ((parseFloat(pondTemp) >= 20 && parseFloat(pondTemp) < 24) || (parseFloat(pondTemp) >= 36 && parseFloat(pondTemp) < 40))      //fluctuation recording when current temperature reaches WARNING 1 status (HOT & COLD)
            {
                //start timer for fluctuation recording
                refreshIntervalId = setInterval(function () { timer++; }, 1000);

                if (parseFloat(pondTemp) >= 20 && parseFloat(pondTemp) < 24) //WARNING 1 (Cold)
                {
                    // condition_id = 3;
                    // production_id = 3;
                }
                else if (parseFloat(pondTemp) >= 36 && parseFloat(pondTemp) < 40) //WARNING 1 (Hot)
                {
                    // condition_id = 3;
                    // production_id = 2;
                }
            }
        }
        else if ((parseFloat(prevPondTemp) >= 20 && parseFloat(prevPondTemp) < 24) || (parseFloat(prevPondTemp) >= 36 && parseFloat(prevPondTemp) < 40))    //if last temperature recorded by the system is in WARNING 1 status, allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (parseFloat(pondTemp) >= 16 && parseFloat(pondTemp) < 20)    //sms sending when current temperature reaches WARNING 2 status (COLD)
            {
                var title = "Warning 1 to Warning 2 (Cold) Temperature";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond lowers down at " + pondTemp + "°C and is now on WARNING 2 production status. Temperature regulation is ongoing, and preparation for emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 40 && parseFloat(pondTemp) < 44)   //sms sending when current temperature reaches WARNING 2 status (HOT)
            {
                var title = "Warning 1 to Warning 2 (Hot) Temperature";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond rises up at " + pondTemp + "°C and is now on WARNING 2 production status. Temperature regulation is ongoing, and preparation for emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) < 16) //sms sending when current temperature reaches CRITICAL status (COLD)
            {
                var title = "Warning 1 to Critical (Cold) Temperature";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond quickly lowers down at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is ongoing. Immediate emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 44)    //sms sending when current temperature reaches CRITICAL status (HOT)
            {
                var title = "Warning 1 to Critical (Hot) Temperature";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond quickly rises up at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is ongoing. Immediate emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 24 && parseFloat(pondTemp) < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                    clearInterval(refreshIntervalId);
                    // insert_fluctuation_occurrence(user_id, pond_id, id_arr[0], id_arr[1], timer);
                    timer = 1;
            }
        }
        else if (parseFloat(prevPondTemp) >= 16 && parseFloat(prevPondTemp) < 20)   //if last temperature recorded by the system is in WARNING 2 status (COLD), allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (parseFloat(pondTemp) < 16)      //sms sending when current temperature reaches CRITICAL status (COLD)
            {
                var title = "Warning 2 (Cold) to Critical (Too Cold)";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond continues to lower down at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is still ongoing. Immediate emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 44)    //sms sending when current temperature reaches CRITICAL status (HOT)
            {
                var title = "QUALITY ASSURANCE";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond suddenly rises up from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on CRITICAL production status. Temperature sensor may be tampered or failed to function properly.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 40 && parseFloat(pondTemp) < 44)   //sms sending when current temperature reaches WARNING 2 status (HOT)
            {
                var title = "QUALITY ASSURANCE";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond suddenly rises up from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on WARNING 2 production status. Temperature sensor may be tampered or failed to function properly.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 24 && parseFloat(pondTemp) < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                    clearInterval(refreshIntervalId);
                    // insert_fluctuation_occurrence(user_id, pond_id, id_arr[0], id_arr[1], timer);
                    timer = 1;
            }
        }
        else if (parseFloat(prevPondTemp) >= 40 && parseFloat(prevPondTemp) < 44)   //if last temperature recorded by the system is in WARNING 2 status (HOT), allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (parseFloat(pondTemp) < 16)     //sms sending when current temperature reaches CRITICAL status (COLD)
            {
                var title = "QUALITY ASSURANCE";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond suddenly drops down from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on CRITICAL production status. Temperature sensor may be tampered or failed to function properly.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 44)    //sms sending when current temperature reaches CRITICAL status (HOT)
            {
                var title = "Warning 2 (Hot) to Critical (Too Hot)";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond continues to rise up at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is still ongoing. Immediate emergency harvest is advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 16 && parseFloat(pondTemp) < 20)    //sms sending when current temperature reaches WARNING 2 status (COLD)
            {
                var title = "QUALITY ASSURANCE";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond suddenly drops down from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on WARNING 2 production status. Temperature sensor may be tampered or failed to function properly.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 24 && parseFloat(pondTemp) < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                    clearInterval(refreshIntervalId);
                    // insert_fluctuation_occurrence(user_id, pond_id, id_arr[0], id_arr[1], timer);
                    timer = 1;
            }
        }
        else if (parseFloat(prevPondTemp) < 16 && parseFloat(prevPondTemp) != -69)       //if last temperature recorded by the system is in CRITICAL status (COLD), allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (parseFloat(pondTemp) >= 16 && parseFloat(pondTemp) < 20)    //sms sending when current temperature reaches WARNING 2 status (COLD)
            {
                var title = "Critical (Too Cold) to Warning 2 (Cold)";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond is now under regulation and continues to rise up at " + pondTemp + "°C, classifying it as WARNING 2 production status. System alarm has been deactivated while temperature regulation is ongoing. Preparation for emergency harvest is still advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 40 && parseFloat(pondTemp) < 44)   //sms sending when current temperature reaches WARNING 2 status (HOT)
            {
                var title = "QUALITY ASSURANCE";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond suddenly rises up from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on WARNING 2 production status. Temperature sensor may be tampered or failed to function properly.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 44)    //sms sending when current temperature reaches CRITICAL status (HOT)
            {
                var title = "QUALITY ASSURANCE";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond suddenly rises up from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on CRITICAL production status. Temperature sensor may be tampered or failed to function properly.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 24 && parseFloat(pondTemp) < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                    clearInterval(refreshIntervalId);
                    // insert_fluctuation_occurrence(user_id, pond_id, id_arr[0], id_arr[1], timer);
                    console.log(timer)
            }
        }
        else if (parseFloat(prevPondTemp) >= 44)  //if last temperature recorded by the system is in CRITICAL status (HOT), allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (parseFloat(pondTemp) >= 16 && parseFloat(pondTemp) < 20)    //sms sending when current temperature reaches WARNING 2 status (COLD)
            {
                var title = "QUALITY ASSURANCE";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond suddenly drops down from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on WARNING 2 production status. Temperature sensor may be tampered or failed to function properly.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 40 && parseFloat(pondTemp) < 44)   //sms sending when current temperature reaches WARNING 2 status (HOT)
            {
                var title = "Critical (Too Hot) to Warning 2 (Hot)";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond is now under regulation and continues to lower down at " + pondTemp + "°C, classifying it as WARNING 2 production status. System alarm has been deactivated while temperature regulation is ongoing. Preparation for emergency harvest is still advised.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) < 16)      //sms sending when current temperature reaches CRITICAL status (COLD)
            {
                var title = "QUALITY ASSURANCE";
                var body = pondDetails.pondName + " Advisory:\n\nWater temperature in the pond suddenly drops down from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on CRITICAL production status. Temperature sensor may be tampered or failed to function properly.";
                schedulePushNotification(title, body)
            }
            else if (parseFloat(pondTemp) >= 24 && parseFloat(pondTemp) < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                    clearInterval(refreshIntervalId);
                    // insert_fluctuation_occurrence(user_id, pond_id, id_arr[0], id_arr[1], timer);
                    timer = 1;
            }
        }
    }

    const fetchPondDO = () => {
        firebase.database()
            .ref("pondRealtimeDO")
            .on("value", (snapshot) => {
                setPondDO(snapshot.val().pondDO)
                doStatus(snapshot.val().pondDO)
                // console.log(snapshot.val())
            }, (errorObject) => {
                console.log(errorObject.code + " : " + errorObject.message)
            })
    }

    const doStatus = (pondDO) => {
        var pondDO = pondDO
        if (pondDO >= 3 && pondDO < 4) {
            setPondStatus("Warning 2");
            setPondDOStatus("WORSE");
        }
        else if (pondDO >= 4 && pondDO < 6) {
            setPondStatus("Warning 1");
            setPondDOStatus("BAD");
        }
        else if (pondDO >= 6 && pondDO <= 7) {
            setPondDOStatus("GOOD");
        }
        else if (pondDO > 7 && pondDO <= 9) {
            setPondDOStatus("BETTER");
        }
        else if (pondDO > 9) {
            setPondDOStatus("BEST");
        }
        else {
            setPondStatus("Critical");
            setPondDOStatus("WORST");
        }
    }

    useEffect(() => {
        Dimensions.addEventListener('change', () => {
            setChartWidth(Dimensions.get("window").width)
        });

        if (pondDetails === null) {
            fetchPondDetails()
        } else {
            fetchPondTemp()
            fetchPondDO()
        }

        return () => { firebase.database().ref().off() };
    }, [pondDetails])

    if (pondDetails === null || pondTemp === "" || pondDO === "") {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>Loading...</Text>
            </View>
        )
    }

    if (pondTemp === "-127.00") {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={{ paddingBottom: 10 }}>
                        <PondDetails pondDetails={pondDetails} pondStatus={pondStatus} />
                    </View>
                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                        <View style={{ alignItems: "center", padding: 5 }}>
                            <Text>Pond Temperature</Text>
                            <Text style={{ fontSize: 25, marginVertical: 4 }}>Error</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <RealtimeDO />
                        </View>
                    </View>
                    <PondRealtimeTempChart />
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{ paddingBottom: 10 }}>
                    <PondDetails pondDetails={pondDetails} pondStatus={pondStatus} />
                </View>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <View style={{ flex: 1 }}>
                        <RealtimeTemp />
                    </View>
                    <View style={{ flex: 1 }}>
                        <RealtimeDO />
                    </View>
                </View>
                <PondRealtimeTempChart />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 7,
        paddingHorizontal: 10
    }
})

export default PondRealtime