import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Button,
    Dimensions
} from 'react-native';

import MainMenu from './screens/MainMenu';
import AddRemoteScreen from './screens/AddRemoteScreen';
import ViewRemotesScreen from './screens/ViewRemotesScreen';
import SettingsScreen from './screens/SettingsScreen';
// import DocumentPicker from 'react-native-document-picker';

const window = Dimensions.get("window");

const App = () => {
    const [stationsUpdated, setStationsUpdated] = useState(true);
    const [dimensions, setDimensions] = useState(window);
    const [baseStations, setBaseStations] = useState([]);
    const [remotes, setRemotes] = useState([]);
    const [isAddRemoteMode, setIsAddRemoteMode] = useState(false);
    const [isViewRemotesMode, setIsViewRemotesMode] = useState(false);
    const [isSettingsMode, setIsSettingsMode] = useState(false);


    const printDimensions = (type, dimensions) => {
        console.log(type + ": " + dimensions.width + " X " + dimensions.height);
    };

    const printCoordinates = (type, coordinates) => {
        console.log(type + ": (" + coordinates.xCoord + ", " + coordinates.yCoord + ")");
    };

    const onChange = ({ window }) => {
        const updatedBaseStations = baseStations;

        for (let i = 0; i < updatedBaseStations.length; i++) {
            updatedBaseStations[i].xCoord = (window.width * updatedBaseStations[i].xCoord) / dimensions.width;
            updatedBaseStations[i].yCoord = (window.height * updatedBaseStations[i].yCoord) / dimensions.height;
        }
        setBaseStations(updatedBaseStations);
        setDimensions(window);
        setStationsUpdated(false);
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    const addBaseStationHandler = () => {
        setBaseStations(currentBaseStations => [
            ...currentBaseStations,
            {
                id: Math.random().toString(),
                xCoord: 0,
                yCoord: 0
            }
        ]);
        setStationsUpdated(false);
    };

    const removeBaseStationHandler = stationId => {
        console.log("Removing base station: " + stationId);
        setBaseStations(currentBaseStations => {
            return currentBaseStations.filter(station => station.id !== stationId);
        });
        setStationsUpdated(false);
    }

    const updateLocation = (stationId, gestureState) => {
        // For debugging the zoom drag event
        // console.log("PageX: " + gestureState.nativeEvent.pageX);
        // console.log("pageY: " + gestureState.nativeEvent.pageY);
        // console.log("locationX: " + gestureState.nativeEvent.locationX);
        // console.log("locationY: " + gestureState.nativeEvent.locationY);
        // For debugging the zoom drag event
        const xCoord = gestureState.nativeEvent.pageX - gestureState.nativeEvent.locationX;
        const yCoord = gestureState.nativeEvent.pageY - gestureState.nativeEvent.locationY;
        const updatedBaseStations = baseStations;
        console.log("Moving: " + stationId + " to: (" + xCoord + ", " + yCoord + ")");
        for (let i = 0; i < updatedBaseStations.length; i++) {
            if (updatedBaseStations[i].id === stationId) {
                updatedBaseStations[i].xCoord = Math.round(xCoord);
                updatedBaseStations[i].yCoord = Math.round(yCoord);
            }
        }
        setBaseStations(updatedBaseStations)
        setStationsUpdated(false);
    };

    const handleUpdate = () => {
        setStationsUpdated(true);
    };

    const saveStationsHandler = () => {
        // fetch()
    };

    const addRemoteHandler = name => {
        if (name.length === 0) {
            return;
        }
        console.log(name)
        // Post to the API here
        setRemotes(currentRemotes => [
            ...currentRemotes,
            { id: Math.random().toString(), employeeName: name }
        ]);
        setIsAddRemoteMode(false);
    };

    const cancelRemoteHandler = () => {
        setIsAddRemoteMode(false);
    };

    const cancelViewRemotesHandler = () => {
        setIsViewRemotesMode(false);
    };

    const removeRemoteHandler = remoteId => {
        console.log("Removing remote: " + remoteId);
        setRemotes(currentRemotes => {
            return currentRemotes.filter(remote => remote.id !== remoteId);
        });
    };

    const onClickAddRemoteHandler = () => {
        setIsAddRemoteMode(true);
    };

    const onClickViewRemotesHandler = () => {
        setIsViewRemotesMode(true);
    };

    // async function pickDocumentHandler() {
    //     try {
    //         const res = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.images],
    //         });
    //         console.log(
    //             res.uri,
    //             res.type, // mime type
    //             res.name,
    //             res.size
    //         );
    //     } catch (err) {
    //         if (DocumentPicker.isCancel(err)) {
    //             // User cancelled the picker, exit any dialogs or menus and move on
    //         } else {
    //             throw err;
    //         }
    //     }
    // };

    let content =   <MainMenu 
                        dimensions={dimensions}
                        baseStations={baseStations}
                        removeBaseStationHandler={removeBaseStationHandler}
                        updateLocation={updateLocation}
                        stationsUpdated={stationsUpdated}
                        askUpdate={handleUpdate}
                        addBaseStationHandler={addBaseStationHandler}
                        saveStationsHandler={saveStationsHandler}
                        setAddRemoteMode={onClickAddRemoteHandler}
                        setViewRemotesMode={onClickViewRemotesHandler}
                    />;

    if (isAddRemoteMode) {
        content = <AddRemoteScreen onAddRemote={addRemoteHandler} onCancelRemoteAddition={cancelRemoteHandler} />;
    } else if (isViewRemotesMode) {
        content = <ViewRemotesScreen remotes={remotes} onCancelViewRemotes={cancelViewRemotesHandler} onRemoveRemote={removeRemoteHandler} />
    } else if (isSettingsMode) {
        content = <SettinsScreen />
    }

    return (
        <View style={styles.screen}>
            {content}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    }
});

export default App;
