import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator, ScrollView } from "react-native";
import Modal from "react-native-modal"
import { DataTable } from "react-native-paper";
import { LineChart } from "react-native-chart-kit"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

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

export const History = (props) => {
  const [chartWidth, setChartWidth] = useState(Dimensions.get("window").width)
  const [fluctuation, setFluctuation] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [fluctuationDetails, setFluctuationDetails] = useState([])
  const [dummy, setDummy] = useState(null)
  const [page, setPage] = useState(0);
  const from = page * 8;
  const to = (page + 1) * 8;

  const toggleHideModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const toggleModal = (fluctuationDate, pondProductionStatus, temperatureStatus, duration) => {
    setIsModalVisible(!isModalVisible)
    setFluctuationDetails([fluctuationDate, pondProductionStatus, temperatureStatus, duration])
  }

  const FluctuationDetailsModal = () => (
    <View>
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => toggleHideModal()}
        onBackdropPress={() => toggleHideModal()}
        swipeDirection="down">
        <View style={{ padding: 10, backgroundColor: "white", borderRadius: 20 }}>
          <Text style={{ marginVertical: 2 }}>Fluctuation Date: {fluctuationDetails[0]}</Text>
          <Text style={{ marginVertical: 2 }}>Production Status: {fluctuationDetails[1]}</Text>
          <Text style={{ marginVertical: 2 }}>Temperature Status: {fluctuationDetails[2]}</Text>
          <Text style={{ marginVertical: 2 }}>Duration: {fluctuationDetails[3]}</Text>
        </View>
      </Modal>
    </View>
  )

  const Item = ({ fluctuationDate, pondProductionStatus, temperatureStatus, duration }) => (
    <View>
      <TouchableOpacity onPress={() => toggleModal(monthNames[new Date(fluctuationDate).getMonth()] + " " + new Date(fluctuationDate).getDate() + ", " + new Date(fluctuationDate).getFullYear() + " " + formatAMPM(fluctuationDate), pondProductionStatus, temperatureStatus, secondsToHms(duration))}>
        <DataTable.Row>
          <DataTable.Cell>
            {monthNames[new Date(fluctuationDate).getMonth()] + " " + new Date(fluctuationDate).getDate() + ", " + new Date(fluctuationDate).getFullYear() + " " + formatAMPM(fluctuationDate)}
          </DataTable.Cell>
          <DataTable.Cell>
            {pondProductionStatus}
          </DataTable.Cell>
          <DataTable.Cell>
            {temperatureStatus}
          </DataTable.Cell>
          <DataTable.Cell>
            {secondsToHms(duration)}
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableOpacity>
    </View>
  )

  const fetchFluctuation = () => {
    const uid = firebase.auth().currentUser.uid
    firebase.database()
      .ref("fluctuation")
      .child(uid + "/" + props.props.pondID)
      .on("value", (snapshot) => {
        setFluctuation(snapshot.val())
      }, (errorObject) => {
        console.log(errorObject.code + " : " + errorObject.message)
      })
  }

  const fetchAverageTemp = () => {
    firebase.database()
        .ref("pondRealtimeData")
        .limitToLast(5)
        .on("value", (snapshot) => {
          var count = 0
          var temp = []

            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                temp[count] = childData.date;
                count++;
            });
            setDummy(temp)

        }, (errorObject) => {
            console.log(errorObject.code + " : " + errorObject.message)
        })
}

  const PondHistoryTempChart = () => (
    <View style={{ marginVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f4f4f4" }}>
      <Text style={{ fontWeight: "bold" }}>{props.props.pondName} AVERAGE TEMPERATURE</Text>
      <LineChart
        data={{
          labels: ["Mar. 31", "Apr. 1", "Apr. 2", "Apr. 3", "Apr. 4",],
          datasets: [
            {
              data: [29, 27, 25, 28, 27]
            }
          ]
        }}
        width={chartWidth} // from react-native
        height={170}
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
            borderRadius: 16,
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

    if (fluctuation === null) {
      fetchFluctuation()
      fetchAverageTemp()
    }

    console.log(dummy)

    return () => { firebase.database().ref('fluctuation').off() }
  }, [fluctuation])

  if (fluctuation !== null && fluctuation.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.horizontal}>
          <ActivityIndicator size="small" color="skyblue" />
        </View>
      </SafeAreaView>
    )
  }

  if (fluctuation === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
          <Text style={styles.screenTitle}>History</Text>
        </View>
        <ScrollView style={{ padding: 10, backgroundColor: "white" }}>
            <PondHistoryTempChart />
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontWeight: "bold" }}>FLUCTUATION HISTORY</Text>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <MaterialCommunityIcons name="alert-box-outline" color={"lightgrey"} size={30} />
            <Text style={{ color: "lightgrey", fontSize: 20 }}>No data</Text>
          </View>
        </ScrollView>
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
      <View style={{ marginTop: 3, marginBottom: 8, justifyContent: "center" }}>
        <Text style={styles.screenTitle}>History</Text>
      </View>
      <ScrollView style={{ flexDirection: "column", padding: 10, backgroundColor: "white" }}>
        <View style={{ flex : 1,  padding: 3 }}>
          <PondHistoryTempChart />
        </View>
        <View style={{ flex : 1, marginVertical: 10 }}>
          <Text style={{ fontWeight: "bold" }}>FLUCTUATION HISTORY</Text>
        </View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>
              Date
            </DataTable.Title>
            <DataTable.Title>
              Prod. Status
            </DataTable.Title>
            <DataTable.Title>
              Temp Status
            </DataTable.Title>
            <DataTable.Title>
              Duration
            </DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={Object.keys(fluctuation).reverse()}
            renderItem={renderItem}
            style={{ backgroundColor: "white", padding: 10 }}
            keyExtractor={item => item}
          />
          {/* <DataTable.Pagination
            page={page}
            numberOfPages={Math.floor(Object.keys(fluctuation).length / 8)}
            onPageChange={page => setPage(page)}
            label={`${from + 1}-${to} of ${Object.keys(fluctuation).length}`}
          /> */}
        </DataTable>
      </ScrollView>
      <FluctuationDetailsModal />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
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

export default History;