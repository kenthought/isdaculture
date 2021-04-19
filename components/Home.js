import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser, fetchPonds, fetchNotification } from "../redux/actions";
import { bindActionCreators } from "redux";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PondsScreen from "./main/Ponds"
import AddPondScreen from "./main/AddPond"
import NotificationScreen from "./main/Notification";

const Tab = createMaterialBottomTabNavigator();

export class Home extends Component {
    componentDidMount = () => {
        this.props.fetchUser()
        this.props.fetchPonds()
        this.props.fetchNotification()
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
            <Tab.Navigator shifting={true}>
                <Tab.Screen name="Ponds" component={PondsScreen}
                    options={{
                        tabBarLabel: "PONDS",
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="waves" color={color} size={26} />
                        )
                    }} />
                    <Tab.Screen name="Add Pond" component={AddPondScreen}
                    // listeners={({ navigation }) => ({
                    //     tabPress: event => {
                    //         event.preventDefault();
                    //     }
                    // })}
                        options={{
                            tabBarLabel: "",
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="plus-circle" color={color} size={36} />
                            )
                        }} />
                    <Tab.Screen name="Notification" component={NotificationScreen}
                        options={{
                            tabBarLabel: "NOTIFICATION",
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="bell" color={color} size={26} />
                            )
                        }} />
            </Tab.Navigator>
        )
    }
}

const mapToStateProps = state => ({
    currentUser: state.userState.currentUser
})

const mapDispatchToProps = dispatch => bindActionCreators({ fetchUser, fetchPonds, fetchNotification }, dispatch)
  
export default connect(mapToStateProps, mapDispatchToProps)(Home);