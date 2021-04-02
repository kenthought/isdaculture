import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser, fetchPonds, fetchNotification, fetchFluctuation } from "../redux/actions";
import { bindActionCreators } from "redux";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PondsScreen from "./main/Ponds"
import NotificationScreen from "./main/Notification";
import HistoryScreen from "./main/History";

const Tab = createBottomTabNavigator();

export class Home extends Component {
    componentDidMount = () => {
        this.props.fetchUser()
        this.props.fetchPonds()
        this.props.fetchNotification()
        this.props.fetchFluctuation()
    }
    render = () => {
        // const { currentUser } = this.props
        // if (currentUser == undefined) {
        //     return (
        //         <View style={styles.container}>
        //             <Text>Logging in...</Text>
        //         </View>
        //     )
        // }
        return (
            <Tab.Navigator>
                <Tab.Screen name="Ponds" component={PondsScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        )
                    }} />
                    <Tab.Screen name="Notification" component={NotificationScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="bell" color={color} size={26} />
                            )
                        }} />
                <Tab.Screen name="History" component={HistoryScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="clock" color={color} size={26} />
                        )
                    }} />
            </Tab.Navigator>
        )
    }
}

const mapToStateProps = state => ({
    currentUser: state.userState.currentUser
})

const mapDispatchToProps = dispatch => bindActionCreators({ fetchUser, fetchPonds, fetchNotification, fetchFluctuation }, dispatch)
  
export default connect(mapToStateProps, mapDispatchToProps)(Home);