import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const TabBar = ({ state, descriptors, navigation, position }) => {
    return (
        <View style={{ flexDirection: 'row', backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#f4f4f4" }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const inputRange = state.routes.map((_, i) => i);
                const opacity = Animated.interpolate(position, {
                    inputRange,
                    outputRange: inputRange.map(i => (i === index ? 1 : 0.3)),
                });

                return (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 10 }}>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                        >
                            <Animated.View style={{ opacity }}>
                            <MaterialCommunityIcons
                                name={label === "Pond Monitoring" ? "waves" :
                                    label === "Fish Behavior" ? "fish" :
                                        label === "History" ? "clock" :
                                            label === "Action Log" ? "format-list-bulleted-square" : ""}
                                color={"skyblue"}
                                size={26}
                                style={{ textAlign: "center" }}
                            />
                            </Animated.View>
                            {/* <Animated.Text
                                style={{
                                    opacity,
                                    color: "skyblue",
                                    textAlign: "center",
                                    fontSize: 12,
                                    fontWeight: ".65",
                                    textTransform: "uppercase"
                                }}>
                                {label}
                            </Animated.Text> */}
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
}