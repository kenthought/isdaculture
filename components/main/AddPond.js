import React, { useState, useEffect } from "react"
import { SafeAreaView, View, StyleSheet, StatusBar, Text, Button, Pressable, ScrollView } from "react-native";
import { RadioButton, TextInput } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from "firebase";

export const AddPond = ( {navigation} ) => {
    const [pondName, setPondName] = useState("")
    const [pondAddress, setPondAddress] = useState("")
    const [checked, setChecked] = useState('nursery');
    const [checked2, setChecked2] = useState('');
    const [checked3, setChecked3] = useState('');
    const [typeOfPond, setTypeOfPond] = useState("")
    const [pondLength, setPondLength] = useState("")
    const [pondWidth, setPondWidth] = useState("")
    const [fishCapacity, setFishCapacity] = useState("")
    const [date, setDate] = useState(new Date())
    const [pondDateStarted, setPondDateStarted] = useState("")
    const [expectedTimeline, setExpectedTimeline] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);
    const [shouldShow2, setShouldShow2] = useState(false);
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [required, setRequired] = useState(false);
    const [requiredError, setRequiredError] = useState("");

    useEffect(() => {
        pondFishCapacity()
    }, [pondLength, pondWidth, checked, checked2, checked3])

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || pondDateStarted;
        setShow(Platform.OS === 'ios');
        setDate(currentDate)
        const formattedDate = (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear()
        setPondDateStarted(formattedDate);
        console.log(formattedDate)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const pondFishCapacity = () => {
        var fishStock = ""
        var expectedTimeline = "0"
        var typeOfPond = ""
        if (pondLength != "" || pondWidth != "" || pondLength != "0" || pondWidth != "0") {
            if (checked === "nursery") {
                const stockingDensity = 40
                const avgWeight = 0.005

                typeOfPond = "nursery"
                fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                expectedTimeline = "60"
            }
            else if (checked === "transitional") {
                const stockingDensity = 5
                const avgWeight = 0.07

                typeOfPond = "transitional"
                fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                expectedTimeline = "30"
            }
            else if (checked === "rearing") {
                expectedTimeline = 120;
                const avgWeight = 0.17;

                if (checked2 === "common") {
                    if (checked3 === "extensive") {
                        const stockingDensity = 0.2

                        typeOfPond = "extensive"
                        fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                    }
                    else if (checked3 === "modular") {
                        const stockingDensity = 0.3

                        typeOfPond = "modular"
                        fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                    }
                    else if (checked3 === "plankton") {
                        const stockingDensity = 0.5

                        typeOfPond = "plankton"
                        fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                    }
                    else if (checked3 === "multiSized") {
                        const stockingDensity = 1.1

                        typeOfPond = "multi sized"
                        fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                    }
                    else if (checked3 === "semiIntensive") {
                        const stockingDensity = 1

                        typeOfPond = "semi-intensive"
                        fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                    }
                    else if (checked3 === "intensive") {
                        const stockingDensity = 2.1

                        typeOfPond = "intensive"
                        fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                    }
                }
                else if (checked2 === "custom") {
                    const stockingDensity = 1;

                    typeOfPond = "custom"
                    fishStock = (Math.floor((stockingDensity * (pondLength * pondWidth) / avgWeight))).toString()
                }
            }
        }
        setTypeOfPond(typeOfPond)
        setExpectedTimeline(expectedTimeline)
        setFishCapacity(fishStock)
    }

    const pondMakeID = (length) => {
        var result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const addPond = (pondName, pondAddress, typeOfPond, pondLength, pondWidth, fishCapacity, expectedTimeline, pondDateStarted, setRequired, setRequiredError) => {
        const pondID = pondMakeID(15)
            const db = firebase.database()
            db.ref('ponds/' + firebase.auth().currentUser.uid + "/" + pondID).set({
                pondID: pondID,
                pondName: pondName,
                pondAddress: pondAddress,
                typeOfPond: typeOfPond,
                pondLength: pondLength,
                pondWidth: pondWidth,
                fishCapacity: fishCapacity,
                expectedTimeline: expectedTimeline,
                pondDateStarted: pondDateStarted,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            })
            .catch((error) => {
                console.log(error)
            })

        navigation.popToTop()
        console.log(pondName + " " + pondAddress + " " + typeOfPond + " " + pondLength + " " + pondWidth + " " + fishCapacity + " " + expectedTimeline + " " + pondDateStarted)
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={{ justifyContent:"center", alignItems: "center", marginVertical: 10 }}>
                <Text style={styles.screenTitle}>Add Ponds</Text>
        </View>
            <ScrollView>
                <View style={{ padding: 20, backgroundColor: "white", borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                    <TextInput 
                        label="Name of Pond"
                        style={styles.input}
                        theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                        onChangeText={pondName => setPondName(pondName)} 
                        value={pondName} />
                    <TextInput
                        label="Address"
                        style={styles.input}
                        theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                        onChangeText={pondAddress => setPondAddress(pondAddress)} 
                        value={pondAddress} />
                    <View>
                        <View style={{ marginVertical: 9 }}>
                            <Text>Type of Pond: </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <Text>Nursery</Text>
                                <RadioButton
                                    value="Nursery"
                                    status={checked === 'nursery' ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked('nursery');
                                        setShouldShow(false);
                                        setShouldShow2(false);
                                        setChecked2("");
                                        setChecked3("");
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <Text>Transitional</Text>
                                <RadioButton
                                    value="Transitional"
                                    status={checked === 'transitional' ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked('transitional');
                                        setShouldShow(false);
                                        setShouldShow2(false);
                                        setChecked2("");
                                        setChecked3("");
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: "center" }}>
                                <Text>Rearing</Text>
                                <RadioButton
                                    value="Rearing"
                                    status={checked === 'rearing' ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked('rearing');
                                        setShouldShow(true)
                                    }}
                                />
                            </View>
                        </View>
                        {shouldShow && (
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ textAlign: "center" }}>Rearing Pond</Text>
                                <View style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }} >
                                    <View style={{ flex: 1, alignItems: "center" }}>
                                        <Text>Common Option</Text>
                                        <RadioButton
                                            value="Commmon"
                                            status={checked2 === 'common' ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked2('common'),
                                                    setShouldShow2(true)
                                            }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: "center" }}>
                                        <Text>Custom</Text>
                                        <RadioButton
                                            value="Custom"
                                            status={checked2 === 'custom' ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked2('custom');
                                                setChecked3("");
                                                setShouldShow2(false);
                                            }}
                                        />
                                    </View>
                                </View>
                                {shouldShow2 && (
                                    <View style={{ marginVertical: 20 }}>
                                        <Text style={{ textAlign: "center" }}>Common Option</Text>
                                        <View style={{ flexDirection: "column" }}>
                                            <View style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }} >
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text>Extensive</Text>
                                                    <RadioButton
                                                        value="Extensive"
                                                        status={checked3 === 'extensive' ? 'checked' : 'unchecked'}
                                                        onPress={() => {
                                                            setChecked3("extensive");
                                                        }}
                                                    />
                                                </View>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text>Modular</Text>
                                                    <RadioButton
                                                        value="Modular"
                                                        status={checked3 === 'modular' ? 'checked' : 'unchecked'}
                                                        onPress={() => {
                                                            setChecked3("modular");
                                                        }}
                                                    />
                                                </View>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text>Plankton</Text>
                                                    <RadioButton
                                                        value="Plankton"
                                                        status={checked3 === 'plankton' ? 'checked' : 'unchecked'}
                                                        onPress={() => {
                                                            setChecked3("plankton");
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "column" }}>
                                                <View style={{ flexDirection: "row", marginTop: 20, alignItems: "center" }} >
                                                    <View style={{ flex: 1, alignItems: "center" }}>
                                                        <Text>Multi Sized</Text>
                                                        <RadioButton
                                                            value="Multi Sized"
                                                            status={checked3 === 'multiSized' ? 'checked' : 'unchecked'}
                                                            onPress={() => {
                                                                setChecked3("multiSized");
                                                            }}
                                                        />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: "center" }}>
                                                        <Text style={{ textAlign: "center" }}>Semi-Intensive</Text>
                                                        <RadioButton
                                                            value="Semi-Intensive"
                                                            status={checked3 === 'semiIntensive' ? 'checked' : 'unchecked'}
                                                            onPress={() => {
                                                                setChecked3("semiIntensive");
                                                            }}
                                                        />
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: "center" }}>
                                                        <Text>Intensive</Text>
                                                        <RadioButton
                                                            value="Intensive"
                                                            status={checked3 === 'intensive' ? 'checked' : 'unchecked'}
                                                            onPress={() => {
                                                                setChecked3("intensive");
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flex: 1, width: "80%", marginRight: 3 }}>
                            <TextInput
                                label="Pond Length"
                                style={styles.input}
                                theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                                keyboardType="number-pad"
                                onChangeText={pondLength => setPondLength(pondLength)}
                                value={pondLength} />
                        </View>
                        <View style={{ flex: 1, width: "80%", marginLeft: 3}}>
                            <TextInput
                                label="Pond Width"
                                style={styles.input}
                                theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                                keyboardType="number-pad"
                                onChangeText={pondWidth => setPondWidth(pondWidth)}
                                value={pondWidth} />
                        </View>
                    </View>
                    <View>
                        <TextInput
                            label="Fish Capacity"
                            style={styles.input}
                            theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                            editable={false}
                            onChangeText={fishCapacity => setFishCapacity(fishCapacity)}
                            value={fishCapacity} />
                    </View>
                    <Pressable onPress={showDatepicker}>
                        <TextInput
                            label="Date Started"
                            style={styles.input}
                            theme={{ colors: { primary: 'skyblue',underlineColor:'transparent',}}}
                            editable={false}
                            value={pondDateStarted} />
                    </Pressable>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                    {required && (
                        <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
                            <Text style={{ color: "red", fontSize: 10 }}>{requiredError}</Text>
                        </View>
                    )}
                    <View style={{ marginVertical: 20 }}>
                        <Button
                            title="Submit"
                            color="skyblue"
                            onPress={() => {
                                var requiredError = "";
                                if (pondName === "")
                                    requiredError += "\nName of Pond is required"

                                if (pondAddress === "")
                                    requiredError += "\nAddress is required"

                                if (pondLength === "")
                                    requiredError += "\nPond Length is required"

                                if (pondWidth === "")
                                    requiredError += "\nPond Width is required"

                                if (pondDateStarted === "")
                                    requiredError += "\nDate Started is required"

                                if (requiredError === "") {
                                    addPond(pondName, pondAddress, typeOfPond, pondLength, pondWidth, fishCapacity, expectedTimeline, date.toString(), setRequired, setRequiredError)
                                } else {
                                    setRequired(true)
                                    setRequiredError("Please check for the errors below:" + requiredError)
                                }
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16
    },
    screenTitle: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    input: {
        marginVertical: 9
    }
})

export default AddPond