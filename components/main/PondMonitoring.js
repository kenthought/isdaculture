import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import firebase from "firebase";
import PondDetails from "./PondDetails";
import { RealtimeTemp, RealtimeDO } from "./PondRealtimeData"
import { PondRealtimeChart } from "./PondRealtimeChart"

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export const PondMonitoring = (props) => {
    const [expoPushToken, setExpoPushToken] = useState('')
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef();
    const responseListener = useRef();
    const [pondTempTime, setPondTempTime] = useState("")
    const [pondTemp, setPondTemp] = useState("")
    const [prevPondTemp, setPrevPondTemp] = useState("")
    const [pondDO, setPondDO] = useState("")
    const [pondStatus, setPondStatus] = useState("")
    const [pondTempStatus, setPondTempStatus] = useState("")
    const [pondDOStatus, setPondDOStatus] = useState("")
    const [tempAndProdStatus, setTempAndProdStatus] = useState([])
    const [chartLabel, setChartLabel] = useState([0, 0, 0, 0, 0])
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0])
    const [fluctuationDate, setFluctuationDate] = useState(new Date())
    const [initial, setInitial] = useState(true)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]

    if (props.props === null) {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
    }

    const fetchRealtimeData = () => {
        firebase.database()
            .ref("pondRealtimeData")
            .limitToLast(5)
            .on("value", (snapshot) => {
                var count = 0
                var fetchChartTempData = []
                var fetchDOData = ""
                var fetchChartLabel = []
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();
                    fetchChartTempData[count] = parseFloat(childData.pondTemp)
                    fetchDOData = childData.pondDO
                    fetchChartLabel[count] = formatAMPM(childData.date)
                    count++
                });
                chartData.splice(0, chartData.length, ...fetchChartTempData)
                setChartData(chartData)
                chartLabel.splice(0, chartLabel.length, ...fetchChartLabel)
                setChartLabel(chartLabel)

                setPondDO(fetchDOData)
                setPondTemp(chartData[chartData.length - 1])
                setPrevPondTemp(chartData[chartData.length - 2])
                setPondTempTime(chartLabel[chartData.length - 1])

                tempStatus()
                doStatus()
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
        var strTime = hours + ':' + minutes + ':' + seconds + ampm;
        return strTime;
    }

    const tempStatus = () => {
        if (pondTemp >= 24 && pondTemp < 36) //NORMAL LEVEL
        {
            if (pondTemp >= 24 && pondTemp < 36) {
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

    const doStatus = () => {
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

    const sendPondNotificationAndFluctuationRecording = () => {
        // console.log(prevPondTemp, pondTemp, fluctuationDate)
        var tempArr = []
        if (prevPondTemp == -127.00 || (prevPondTemp >= 24 && prevPondTemp < 36))    //if last recorded pondTemp is NORMAL, user-default or output form disconnected sensor, -> then allow sms sending once WARNING 2 and CRITICAL status is detected
        {
            if (prevPondTemp == -127.00)	//means that sensor is disconnected/malfunctioned, or previous temperature is user-default
            {
                console.log("\nTemperature Analysis commencing...");
                console.log("\nSMS Notification Sending: Enabled");
                console.log("\nSystem Action Logs Insertion: Enabled");
                console.log("\nFluctuation Occurrence Recording: Enabled\n");
            }

            if (pondTemp >= 16 && pondTemp < 20)    //sending notification and fluctuation recording when current temperature reaches WARNING 2 status (COLD)
            {
                //start timer for fluctuation recording
                setFluctuationDate(new Date())
                tempAndProdStatus.push("WORSE")
                tempAndProdStatus.push("Warning 2 (Cold)")
                setTempAndProdStatus(tempAndProdStatus)

                var title = "Normal to Warning 2 (Cold) Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " lowers down at " + pondTemp + "°C and is now on WARNING 2 production status. Temperature regulation is ongoing, and preparation for emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 40 && pondTemp < 44)   //sending notification and fluctuation recording when current temperature reaches WARNING 2 status (HOT)
            {
                //start timer for fluctuation recording
                setFluctuationDate(new Date())
                tempAndProdStatus.push("WORSE")
                tempAndProdStatus.push("Warning 2 (Hot)")
                setTempAndProdStatus(tempAndProdStatus)

                var title = "Normal to Warning 2 (Hot) Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " rises up at " + pondTemp + "°C and is now on WARNING 2 production status. Temperature regulation is ongoing, and preparation for emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp < 16) //sending notification and fluctuation recording when current temperature reaches CRITICAL status (COLD)
            {
                //start timer for fluctuation recording
                setFluctuationDate(new Date())
                tempAndProdStatus.push("WORST")
                tempAndProdStatus.push("Critical (Cold)")
                setTempAndProdStatus(tempAndProdStatus)

                var title = "Normal to Critical (Cold) Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " quickly lowers down at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is ongoing. Immediate emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 44)    //sending notification and fluctuation recording when current temperature reaches CRITICAL status (HOT)
            {
                //start timer for fluctuation recording
                setFluctuationDate(new Date())
                tempAndProdStatus.push("WORST")
                tempAndProdStatus.push("Critical (Hot)")
                setTempAndProdStatus(tempAndProdStatus)

                var title = "Normal to Critical (Hot) Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " quickly rises up at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is ongoing. Immediate emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if ((pondTemp >= 20 && pondTemp < 24) || (pondTemp >= 36 && pondTemp < 40))      //fluctuation recording when current temperature reaches WARNING 1 status (HOT & COLD)
            {
                //start timer for fluctuation recording
                console.log("0 fluctuation date: " + fluctuationDate)
                setFluctuationDate(new Date())
                console.log("0.5 fluctuation date: " + fluctuationDate)

                if (pondTemp >= 20 && pondTemp < 24) //WARNING 1 (Cold)
                {
                    // condition_id = 3;
                    // production_id = 3;
                    tempAndProdStatus.push("BAD")
                    tempAndProdStatus.push("Warning 1 (Cold)")
                    setTempAndProdStatus(tempAndProdStatus)
                }
                else if (pondTemp >= 36 && pondTemp < 40) //WARNING 1 (Hot)
                {
                    // condition_id = 3;
                    // production_id = 2;
                    console.log("1 fluctuation date: " + fluctuationDate)
                    tempAndProdStatus.push("BAD")
                    tempAndProdStatus.push("Warning 1 (Hot)")
                    setTempAndProdStatus(tempAndProdStatus)
                    console.log(tempAndProdStatus)
                }
            }
        }
        else if ((prevPondTemp >= 20 && prevPondTemp < 24) || (prevPondTemp >= 36 && prevPondTemp < 40))    //if last temperature recorded by the system is in WARNING 1 status, allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (pondTemp >= 16 && pondTemp < 20)    //sending notification when current temperature reaches WARNING 2 status (COLD)
            {
                var title = "Warning 1 to Warning 2 (Cold) Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " lowers down at " + pondTemp + "°C and is now on WARNING 2 production status. Temperature regulation is ongoing, and preparation for emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 40 && pondTemp < 44)   //sending notification when current temperature reaches WARNING 2 status (HOT)
            {
                var title = "Warning 1 to Warning 2 (Hot) Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " rises up at " + pondTemp + "°C and is now on WARNING 2 production status. Temperature regulation is ongoing, and preparation for emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp < 16) //sending notification when current temperature reaches CRITICAL status (COLD)
            {
                var title = "Warning 1 to Critical (Cold) Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " quickly lowers down at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is ongoing. Immediate emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 44)    //sending notification when current temperature reaches CRITICAL status (HOT)
            {
                var title = "Warning 1 to Critical (Hot) Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " quickly rises up at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is ongoing. Immediate emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 24 && pondTemp < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                var title = "Normal Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " lowers down at " + pondTemp + "°C and is back to NORMAL temperature.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
                console.log("3 fluctuation date: " + fluctuationDate)
                console.log("1st " + tempArr + " " + ((new Date().getTime() - fluctuationDate.getTime()) / 1000))
                console.log("Temp and Prod: ", tempAndProdStatus[0], tempAndProdStatus[1])
                insertFluctuation(fluctuationDate.toString(), tempAndProdStatus[0], tempAndProdStatus[1], (new Date().getTime() - fluctuationDate.getTime()) / 1000)
            }
        }
        else if (prevPondTemp >= 16 && prevPondTemp < 20)   //if last temperature recorded by the system is in WARNING 2 status (COLD), allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (pondTemp < 16)      //sending notification when current temperature reaches CRITICAL status (COLD)
            {
                var title = "Warning 2 (Cold) to Critical (Too Cold)";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " continues to lower down at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is still ongoing. Immediate emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 44)    //sending notification when current temperature reaches CRITICAL status (HOT)
            {
                var title = "QUALITY ASSURANCE";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " suddenly rises up from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on CRITICAL production status. Temperature sensor may be tampered or failed to function properly.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 40 && pondTemp < 44)   //sending notification when current temperature reaches WARNING 2 status (HOT)
            {
                var title = "QUALITY ASSURANCE";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " suddenly rises up from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on WARNING 2 production status. Temperature sensor may be tampered or failed to function properly.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 24 && pondTemp < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                var title = "Normal Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " lowers down at " + pondTemp + "°C and is back to NORMAL temperature.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
                console.log("2nd " + ((new Date().getTime() - fluctuationDate.getTime()) / 1000))
                insertFluctuation(fluctuationDate.toString(), tempAndProdStatus[0], tempAndProdStatus[1], (new Date().getTime() - fluctuationDate.getTime()) / 1000)
            }
        }
        else if (prevPondTemp >= 40 && prevPondTemp < 44)   //if last temperature recorded by the system is in WARNING 2 status (HOT), allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (pondTemp < 16)     //sending notification when current temperature reaches CRITICAL status (COLD)
            {
                var title = "QUALITY ASSURANCE";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " suddenly drops down from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on CRITICAL production status. Temperature sensor may be tampered or failed to function properly.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 44)    //sending notification when current temperature reaches CRITICAL status (HOT)
            {
                var title = "Warning 2 (Hot) to Critical (Too Hot)";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " continues to rise up at " + pondTemp + "°C and is now on CRITICAL production status. The system activated its alarm while temperature regulation is still ongoing. Immediate emergency harvest is advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 16 && pondTemp < 20)    //sending notification when current temperature reaches WARNING 2 status (COLD)
            {
                var title = "QUALITY ASSURANCE";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " suddenly drops down from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on WARNING 2 production status. Temperature sensor may be tampered or failed to function properly.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 24 && pondTemp < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                var title = "Normal Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " lowers down at " + pondTemp + "°C and is back to NORMAL temperature.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
                console.log("3rd " + ((new Date().getTime() - fluctuationDate.getTime()) / 1000))
                insertFluctuation(fluctuationDate.toString(), tempAndProdStatus[0], tempAndProdStatus[1], (new Date().getTime() - fluctuationDate.getTime()) / 1000)
            }
        }
        else if (prevPondTemp < 16)       //if last temperature recorded by the system is in CRITICAL status (COLD), allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (pondTemp >= 16 && pondTemp < 20)    //sending notification when current temperature reaches WARNING 2 status (COLD)
            {
                var title = "Critical (Too Cold) to Warning 2 (Cold)";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " is now under regulation and continues to rise up at " + pondTemp + "°C, classifying it as WARNING 2 production status. System alarm has been deactivated while temperature regulation is ongoing. Preparation for emergency harvest is still advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 40 && pondTemp < 44)   //sending notification when current temperature reaches WARNING 2 status (HOT)
            {
                var title = "QUALITY ASSURANCE";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " suddenly rises up from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on WARNING 2 production status. Temperature sensor may be tampered or failed to function properly.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 44)    //sending notification when current temperature reaches CRITICAL status (HOT)
            {
                var title = "QUALITY ASSURANCE";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " suddenly rises up from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on CRITICAL production status. Temperature sensor may be tampered or failed to function properly.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 24 && pondTemp < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                var title = "Normal Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " lowers down at " + pondTemp + "°C and is back to NORMAL temperature.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
                console.log("4th " + ((new Date().getTime() - fluctuationDate.getTime()) / 1000))
                insertFluctuation(fluctuationDate.toString(), tempAndProdStatus[0], tempAndProdStatus[1], (new Date().getTime() - fluctuationDate.getTime()) / 1000)
            }
        }
        else if (prevPondTemp >= 44)  //if last temperature recorded by the system is in CRITICAL status (HOT), allow sms sending once WARNING 2 and CRITICAL is detected
        {
            if (pondTemp >= 16 && pondTemp < 20)    //sending notification when current temperature reaches WARNING 2 status (COLD)
            {
                var title = "QUALITY ASSURANCE";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " suddenly drops down from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on WARNING 2 production status. Temperature sensor may be tampered or failed to function properly.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 40 && pondTemp < 44)   //sending notification when current temperature reaches WARNING 2 status (HOT)
            {
                var title = "Critical (Too Hot) to Warning 2 (Hot)";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " is now under regulation and continues to lower down at " + pondTemp + "°C, classifying it as WARNING 2 production status. System alarm has been deactivated while temperature regulation is ongoing. Preparation for emergency harvest is still advised.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp < 16)      //sending notification when current temperature reaches CRITICAL status (COLD)
            {
                var title = "QUALITY ASSURANCE";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " suddenly drops down from " + prevPondTemp + "°C to " + pondTemp + "°C and is now on CRITICAL production status. Temperature sensor may be tampered or failed to function properly.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
            }
            else if (pondTemp >= 24 && pondTemp < 36) //stop, record and reset timer and log array when NORMAL temperature is achieved
            {
                var title = "Normal Temperature";
                var body = "IsdaCulture Advisory:\n\nWater temperature in " + props.props.pondName + " lowers down at " + pondTemp + "°C and is back to NORMAL temperature.";
                insertNotification(title + "\n" + body.slice(23), new Date().toString())
                sendPushNotification(expoPushToken, title, body)
                console.log("5th " + ((new Date().getTime() - fluctuationDate.getTime()) / 1000))
                insertFluctuation(fluctuationDate.toString(), tempAndProdStatus[0], tempAndProdStatus[1], (new Date().getTime() - fluctuationDate.getTime()) / 1000)
            }
        }
    }

    const insertNotification = (notification, date) => {
        const db = firebase.database()
        db.ref('notification/' + firebase.auth().currentUser.uid).push().set({
            pondID: props.props.pondID,
            pondName: props.props.pondName,
            notification,
            date
        })
    }

    const insertFluctuation = (fluctuationDate, temperatureStatus, pondProductionStatus, duration) => {
        console.log("4 fluctuation date: " + fluctuationDate)
        console.log(temperatureStatus, pondProductionStatus, duration)
        const expectedDate = new Date(props.props.expectedDate)
        expectedDate.setSeconds(expectedDate.getSeconds() + parseInt(duration)) //adding the fluctuation duration
        const db = firebase.database()
        db.ref('fluctuation/' + firebase.auth().currentUser.uid + "/" + props.props.pondID).push().set({
            pondID: props.props.pondID,
            pondName: props.props.pondName,
            temperatureStatus,
            pondProductionStatus,
            fluctuationDate,
            duration
        })

        var newExpectedDate = {
            createdAt: props.props.createdAt,
            expectedDate: expectedDate.toString(),
            expectedTimeline: props.props.expectedTimeline,
            fishCapacity: props.props.fishCapacity,
            pondAddress: props.props.pondAddress,
            pondDateStarted: props.props.pondDateStarted,
            pondID: props.props.pondID,
            pondLength: props.props.pondLength,
            pondName: props.props.pondName,
            pondWidth: props.props.pondWidth,
            typeOfPond: props.props.typeOfPond,
        };

        var updates = {};
        updates['ponds/' + firebase.auth().currentUser.uid + "/" + props.props.pondID] = newExpectedDate;

        firebase.database().ref().update(updates);
        setTempAndProdStatus([])
        setFluctuationDate("")
    }

    const actionLogAndFishBehavior = () => {
        if (prevPondTemp >= 24 && prevPondTemp < 36) {
            if (pondTemp < 24) 
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Warning Status: Activating water pump releasing hot water.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Sluggish", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
            else if (pondTemp > 36) 
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Warning Status: Activating water pump releasing cold water.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Sluggish", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
        }
        else if ((prevPondTemp >= 16 && prevPondTemp < 24) || (prevPondTemp >= 36 && prevPondTemp < 44)) {
            if (pondTemp >= 24 && pondTemp < 36)
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Normal Status: Stopping the water pump, Monitoring temperature.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Stable", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
            else if (pondTemp < 16)
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Critical Status: Activating system alarm.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Stressed", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
            else if (pondTemp > 44)
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Critical Status: Activating system alarm.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Stressed", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
        }
        else if (prevPondTemp < 16) {
            if (pondTemp >= 24 && pondTemp < 36)
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Normal Status: Stopping the water pump, Monitoring temperature.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Stable", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
            else if (pondTemp >= 16 && pondTemp < 24)
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Warning Status: Stopping the system alarm, Regulating temperature.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Sluggish", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
        }
        else if (prevPondTemp >= 44) {
            if (pondTemp >= 24 && pondTemp < 36)
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Normal Status: Stopping the water pump, Monitoring temperature.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Stable", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
            else if (pondTemp >= 36 && pondTemp < 44)
            {
                const date = new Date()
                insertActionLog(pondTemp, pondTempStatus, pondStatus, "Warning Status: Stopping the system alarm, Regulating temperature.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
                insertFishBehavior(pondTemp, pondDO, "Sluggish", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            }
        }
    }

    const initialFunction = () => {
        if (pondTemp >= 24 && pondTemp < 36) {
            const date = new Date()
            insertActionLog(pondTemp, pondTempStatus, pondStatus, "Normal Status: Monitoring temperature.", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            insertFishBehavior(pondTemp, pondDO, "Stable", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
        }
        else if ((pondTemp >= 16 && pondTemp < 24) || (pondTemp >= 36 && pondTemp < 44)) {
            const date = new Date()
            insertActionLog(pondTemp, pondTempStatus, pondStatus, "Warning Status: Regulating Temperature", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            insertFishBehavior(pondTemp, pondDO, "Sluggish", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
        }
        else if (pondTemp < 16 || pondTemp >= 44) {
            const date = new Date()
            insertActionLog(pondTemp, pondTempStatus, pondStatus, "Critical Status: Regulating Temperature", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
            insertFishBehavior(pondTemp, pondDO, "Stressed", monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + formatAMPM(date))
        }
    }

    const insertActionLog = (pondTemp, pondTempStatus, prodStatus, action, timeAndDate) => {
        console.log("Action Log: ", pondTemp, pondTempStatus, prodStatus, action, timeAndDate)
    }

    const insertFishBehavior = (pondTemp, pondDo, behavior, timeAndDate) => {
        console.log("Fish Behavior: ", pondTemp, pondDo, behavior, timeAndDate)
    }

    useEffect(() => {
        fetchRealtimeData()
        sendPondNotificationAndFluctuationRecording()
        actionLogAndFishBehavior()

        if (initial === true) {
            if (pondTemp != "" && pondDO != "" && pondStatus != "" && pondTempStatus != "") {
                initialFunction()
                setInitial(false)
            }
        }

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
            firebase.database().ref('pondRealtimeData').off()
        };
    }, [pondTempTime, pondStatus])

    if (props.props === null || pondStatus == "") {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="skyblue" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <PondDetails props={props.props} pondStatus={pondStatus} />
                </View>
                <View style={{ flexDirection: "column", marginTop: 10, padding: 10, backgroundColor: "white" }}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <RealtimeTemp pondTemp={pondTemp} pondTempStatus={pondTempStatus} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <RealtimeDO pondDO={pondDO} pondDOStatus={pondDOStatus} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <PondRealtimeChart pondDetails={props.props} chartData={chartData} chartLabel={chartLabel} />
                    </View>
                </View>
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

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
export async function sendPushNotification(expoPushToken, title, body) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

export default PondMonitoring