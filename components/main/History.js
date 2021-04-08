import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit"
import firebase from "firebase";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

const Item = ({ fluctuationDate, pondProductionStatus, temperatureStatus, duration }) => (
  <View style={{ flexDirection: "column" }}>
    <View style={{ marginVertical: 8, flexDirection: "row" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>{monthNames[new Date(fluctuationDate).getMonth()] + " " + new Date(fluctuationDate).getDate() + ", " + new Date(fluctuationDate).getFullYear()}</Text>
        <Text style={{ textAlign: "center" }}>{formatAMPM(fluctuationDate)}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>{pondProductionStatus}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>{temperatureStatus}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>{secondsToHms(duration)}</Text>
      </View>
    </View>
  </View>
)

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
  return hDisplay + mDisplay + sDisplay;
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
  var strTime = hours + ':' + minutes + ampm;
  return strTime;
}

export const History = ({ route }) => {
  const [chartWidth, setChartWidth] = useState(Dimensions.get("window").width)
  const [pondDetails, setPondDetails] = useState(null)
  const [fluctuation, setFluctuation] = useState(null)
  console.log(pondDetails)
  
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

  const fetchFluctuation = () => {
    const uid = firebase.auth().currentUser.uid
    firebase.database()
      .ref("fluctuation")
      .child(uid + "/" + pondDetails.pondID)
      .on("value", (snapshot) => {
        setFluctuation(snapshot.val())
      }, (errorObject) => {
        console.log(errorObject.code + " : " + errorObject.message)
      })
  }

  const PondHistoryTempChart = () => (
    <View style={{ marginTop: 30 }}>
      <Text>{pondDetails.pondName} Average Temperature</Text>
      <LineChart
        data={{
          labels: ["Mar. 31", "Apr. 1", "Apr. 2", "Apr. 3", "Apr. 4",],
          datasets: [
            {
              data: [29, 27, 25, 28, 27]
            }
          ]
        }}
        width={chartWidth - 18} // from react-native
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

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setChartWidth(Dimensions.get("window").width)
    });

    if(pondDetails === null) {
      fetchPondDetails()
    }
    if (fluctuation === null) {
      fetchFluctuation()
    }

    return () => { }
  }, [fluctuation])

  if (fluctuation === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.horizontal}>
          <ActivityIndicator size="small" color="skyblue" />
        </View>
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => (
    <Item
      fluctuationDate={fluctuation[item].fluctuationDate}
      pondProductionStatus={fluctuation[item].pondProductionStatus}
      temperatureStatus={fluctuation[item].temperatureStatus}
      duration={fluctuation[item].duration}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
        <View>
          <PondHistoryTempChart />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight:"bold" }}>Fluctuation History</Text>
        </View>
        <View style={{ marginVertical: 8, flexDirection: "column" }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>Date</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>Production Status</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>Temperature Status</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ textAlign: "center", fontWeight: "bold" }}>Duration</Text>
            </View>
          </View>
        </View>
        <FlatList
          data={Object.keys(fluctuation).reverse()}
          renderItem={renderItem}
        />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "50%"
  }
})

export default History;