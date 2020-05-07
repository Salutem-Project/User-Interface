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
const remotesEndpoint = 'http://athena.matthewpogue.com:1080/remote';
const stationsEndpoint = 'http://athena.matthewpogue.com:1080/station';

const sendHttpRequest = (method, url, data) => {
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {}
    }).then(response => {
        return response.json();
    });
};

const App = () => {
    const [stationsUpdated, setStationsUpdated] = useState(true);
    const [dimensions, setDimensions] = useState(window);
    const [baseStations, setBaseStations] = useState([]);
    const [remotes, setRemotes] = useState([]);
    const [isAddRemoteMode, setIsAddRemoteMode] = useState(false);
    const [isViewRemotesMode, setIsViewRemotesMode] = useState(false);
    const [isSettingsMode, setIsSettingsMode] = useState(false);
    const [pullStations, setPullStations] = useState(true);
    const [pullRemotes, setPullRemotes] = useState(true);

    if (pullStations) {
        // API WORK
        let url = stationsEndpoint + 's';
        const response = sendHttpRequest('GET', url);
        console.log(response);
        response.then(stations => {
            console.log(stations);
            setBaseStations(stations.stations);
        });
        setPullStations(false);
    }

    if (pullRemotes) {
        // API WORK
        let url = remotesEndpoint + 's';
        const response = sendHttpRequest('GET', url);
        response.then(remotes => setRemotes(remotes.remotes));
        setPullRemotes(false);
    }

    const printDimensions = (type, dimensions) => {
        console.log(type + ": " + dimensions.width + " X " + dimensions.height);
    };

    const printCoordinates = (type, coordinates) => {
        console.log(type + ": (" + coordinates.x_cord + ", " + coordinates.y_cord + ")");
    };

    const onChange = ({ window }) => {
        const updatedBaseStations = baseStations;

        for (let i = 0; i < updatedBaseStations.length; i++) {
            updatedBaseStations[i].x_cord = (window.width * updatedBaseStations[i].x_cord) / dimensions.width;
            updatedBaseStations[i].y_cord = (window.height * updatedBaseStations[i].y_cord) / dimensions.height;
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
        const newBaseStation = {
            s_id: Math.floor(Math.random() * 10000000000).toString(),
            location: 'A',
            x_cord: 0,
            y_cord: 0,
            updateOnSave: true
        };

        const url = stationsEndpoint + '/' + newBaseStation.s_id;
        console.log(sendHttpRequest('POST', url, newBaseStation));
        setBaseStations(currentBaseStations => [
            ...currentBaseStations,
            newBaseStation
        ]);
        setStationsUpdated(false);
    };

    const removeBaseStationHandler = stationId => {
        // API WORK
        console.log("Removing base station: " + stationId);
        url = stationsEndpoint + '/' + stationId;
        sendHttpRequest('DELETE', url);
        setBaseStations(currentBaseStations => {
            return currentBaseStations.filter(station => station.s_id !== stationId);
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
        const x_cord = gestureState.nativeEvent.pageX - gestureState.nativeEvent.locationX;
        const y_cord = gestureState.nativeEvent.pageY - gestureState.nativeEvent.locationY;
        const updatedBaseStations = baseStations;
        console.log("Moving: " + stationId + " to: (" + x_cord + ", " + y_cord + ")");
        for (let i = 0; i < updatedBaseStations.length; i++) {
            if (updatedBaseStations[i].s_id === stationId) {
                updatedBaseStations[i].x_cord = Math.round(x_cord);
                updatedBaseStations[i].y_cord = Math.round(y_cord);
                updatedBaseStations[i].updateOnSave = true;
            }
        }
        setBaseStations(updatedBaseStations);
        setStationsUpdated(false);
    };

    const handleUpdate = () => {
        setStationsUpdated(true);
    };

    const saveStationsHandler = () => {
        var url = "";
        baseStations.forEach(station => {
            if (station.updateOnSave) {
                url = stationsEndpoint + '/' + station.s_id;
                console.log("Saving station");
                sendHttpRequest('DELETE', url);
                const response = sendHttpRequest('POST', url, station);
                console.log(response);
                station.updateOnSave = false;
            }
        });
    };

    const addRemoteHandler = name => {
        if (name.length === 0) {
            return;
        }

        const newRemote = {
            r_id: Math.floor(Math.random() * 10000000000).toString(),
            u_id: name
        };

        const url = remotesEndpoint + '/' + newRemote.r_id;
        setRemotes(currentRemotes => [
            ...currentRemotes,
            newRemote
        ]);
        sendHttpRequest('POST', url, newRemote);
        setIsAddRemoteMode(false);
    };

    const cancelRemoteHandler = () => {
        setIsAddRemoteMode(false);
    };

    const cancelViewRemotesHandler = () => {
        setIsViewRemotesMode(false);
    };

    const removeRemoteHandler = remoteId => {
        // API WORK
        const url = remotesEndpoint + '/' + remoteId;
        sendHttpRequest('DELETE', url);
        console.log("Removing remote: " + remoteId);
        setRemotes(currentRemotes => {
            return currentRemotes.filter(remote => remote.r_id !== remoteId);
        });
    };

    const onClickAddRemoteHandler = () => {
        setIsAddRemoteMode(true);
    };

    const onClickViewRemotesHandler = () => {
        setIsViewRemotesMode(true);
    };

    const setRoomHandler = stationId => {
        console.log("I WANT TO SET THE LOCATION");
        // for (let i = 0; i < updatedBaseStations.length; i++) {
        //     if (updatedBaseStations[i].s_id === stationId) {
        //         updatedBaseStations[i].x_cord = Math.round(x_cord);
        //         updatedBaseStations[i].y_cord = Math.round(y_cord);
        //     }
        // }
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

    let content = <MainMenu
        dimensions={dimensions}
        baseStations={baseStations}
        removeBaseStationHandler={removeBaseStationHandler}
        updateLocation={updateLocation}
        stationsUpdated={stationsUpdated}
        askUpdate={handleUpdate}
        handleSetRoom={setRoomHandler}
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
